// @flow

const { join, dirname, resolve } = require("path")
const getDB = require("database").default
const watch = require("watch")
const yaml = require("js-yaml")
const fs = require("fs")
const moment = require("moment")
const recursiveReadDir = require("recursive-readdir")
const isEqual = require("lodash/isEqual")
const cloneDeep = require("lodash/cloneDeep")

const targetDir = resolve(
  process.env.TARGET_DIR || join(__dirname, "sample-config")
)

const loadFirst = !process.env.LOAD_FIRST
  ? !["yes", "true"].includes((process.env.WRITE_FIRST || "").toLowerCase())
  : ["yes", "true"].includes((process.env.LOAD_FIRST || "").toLowerCase())

const writeMode = !process.env.WRITE_MODE
  ? false
  : ["yes", "true"].includes((process.env.WRITE_MODE || "").toLowerCase())

async function main() {
  console.log(`TARGET CONFIG DIRECTORY: ${targetDir}`)

  const db = await getDB()

  let lastDefScan = null
  let entityIdToFile = {}

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }

  async function loadDir() {
    const log = (...args) => console.log("load-from-dir>", ...args)

    log("reading directory...")
    const files = await recursiveReadDir(targetDir)

    log(`${files.length} files found`)
    const documents = []
    for (const fi of files) {
      if (fi.endsWith(".yaml")) {
        const yamlDocs = yaml.safeLoadAll(fs.readFileSync(fi))
        for (const doc of yamlDocs) {
          documents.push({ def: doc, path: fi })
        }
      }
    }
    log(`${documents.length} yaml documents found`)

    entityIdToFile = {}
    // TODO do this all in a single transaction
    log(`deleting database definitions...`)
    await db("definition").del()

    log("inserting documents as definitions...")
    for (const { def, path } of documents) {
      log(`inserting def "${def.name}"...`)
      const [{ entity_id }] = await db("definition")
        .insert({ def })
        .returning("entity_id")
      entityIdToFile[entity_id] = { path, def }
    }
    log(`done`)
    lastDefScan = Date.now()
  }

  async function writeToDir() {
    const log = (...args) => console.log("write-to-dir>", ...args)
    log("attempting to write to target directory...")
    const contents = await new Promise(async onCompleteWrite => {
      log("reading target directory...")
      const files = await recursiveReadDir(targetDir)
      log(`${files.length} files found`)
      const contents = {}
      for (const fi of files) {
        contents[fi] = yaml.safeLoadAll(fs.readFileSync(fi))
      }
      log("finished loading yaml.")
      onCompleteWrite(contents)
    })

    const dirContents = cloneDeep(contents)

    log("reading definitions from database...")
    const newDefs = await db("definition").where(
      "updated_at",
      ">",
      moment.utc(lastDefScan || 0)
    )
    log(`${newDefs.length} updated definitions found`)

    lastDefScan = Date.now()
    const changedFiles = new Set()

    for (const { entity_id, def: newDef } of newDefs) {
      // if this is an existing definition, replace it in the original file
      if (entityIdToFile[entity_id]) {
        const { path: prevPath, def: prevDef } = entityIdToFile[entity_id]

        // Check that the definition hasn't moved
        if (
          contents[prevPath] &&
          contents[prevPath].some(d => d.name === prevDef.name)
        ) {
          // Replace the previous definition with the new definition
          contents[prevPath] = contents[prevPath].map(d =>
            d.name === prevDef.name ? newDef : d
          )
          changedFiles.add(prevPath)
          continue
        }
      }

      // New definition should be placed in a reasonable location
      const newPath = join(
        targetDir,
        newDef.kind.toLowerCase() + "s",
        newDef.name + ".yaml"
      )

      contents[newPath] = [newDef]
      changedFiles.add(newPath)
    }

    log(`${changedFiles.size} files changed`)

    if (changedFiles.size === 0) return

    log(`Writing changed files to target directory...`)
    for (const changedFilePath of changedFiles) {
      fs.mkdirSync(dirname(changedFilePath), { recursive: true })
      fs.writeFileSync(
        changedFilePath,
        contents[changedFilePath].map(doc => yaml.safeDump(doc)).join("\n---\n")
      )
    }
    log(`done`)
  }

  if (loadFirst) {
    console.log("Loading config from directory (LOAD_FIRST)...")
    await loadDir()
  } else {
    console.log("Writing config to directory (WRITE_FIRST)...")
    await writeToDir()
  }

  setTimeout(() => {
    console.log("Watching config directory for changes...")
    watch.watchTree(targetDir, { interval: 0.1 }, (f, curr, prev) => {
      loadDir()
    })
  }, 500)
  if (writeMode) {
    async function checkDBAndWrite() {
      const { count } = await db("definition")
        .where("updated_at", ">", moment.utc(lastDefScan || 0))
        .count()
        .first()
      if (parseInt(count) > 0) {
        await writeToDir()
      }
      setTimeout(checkDBAndWrite, 200)
    }
    checkDBAndWrite()
  }
}

main()

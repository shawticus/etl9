// @flow

import React, { useEffect, useState } from "react"
import Page from "../Page"
import { makeStyles } from "@material-ui/styles"
import { useAPI } from "../APIProvider"
import ListSearch from "../ListSearch"
import Button from "@material-ui/core/Button"
import StageEditor from "../StageEditor"
import PipelineDiagram from "../PipelineDiagram"
import useNavigation from "../../utils/use-navigation.js"

const createButton =  { label: "+ New Stage", href: "/create-stage" }

const useStyles = makeStyles({
  root: { padding: 20 },
  actions: { paddingTop: 20, textAlign: "right" },
  nav: {
    display: "flex",
    paddingBottom: 20
  },
  createButton: {
    border: "1px solid green",
    padding: "1em",
    margin: "1em",
	color: "green"
  }
})

export const StagesPage = () => {
  const c = useStyles()
  const api = useAPI()
  const { navigate } = useNavigation()
  const [selectedStage, changeSelectedStage] = useState()
  const [mode, changeMode] = useState("editor")
  const [stages, changeStages] = useState([])
  const { getStages } = useAPI()

  useEffect(() => {
    getStages().then(stages => {
      changeStages(stages)
      const paths = window.location.pathname.split("/")
      if (paths.length === 3) {
        const [_0, _1, stageName] = paths
        changeSelectedStage(stages.find(s => s.def.name === stageName))
      }
    })
  }, [])
  useEffect(() => {
    if (selectedStage) {
      navigate(`/stages/${selectedStage.def.name}`)
    }
  }, [selectedStage && selectedStage.def.name])

  return (
    <Page title="Stages">
      <Button className={c.createButton} onClick={() => navigate(createButton.href) } >{createButton.label} </Button>
      {!selectedStage ? (
        <ListSearch
          placeholder="Search for Stage"
          items={stages.map(stage => ({
            stage,
            label: stage.def.name,
            description: stage.def.description
          }))}
          onSelect={item => changeSelectedStage(item.stage)}
        />
      ) : (
        <div className={c.root}>
          <div className={c.nav}>
            <Button onClick={() => changeSelectedStage(null)}>
              Back to Search
            </Button>
            <div style={{ flexGrow: 1 }} />
            <Button
              disabled={mode === "editor"}
              onClick={() => changeMode("editor")}
            >
              Editor
            </Button>
            <Button
              disabled={mode === "component"}
              onClick={() => changeMode("component")}
            >
              Component
            </Button>
          </div>
          {mode === "editor" ? (
            <>
              <StageEditor
                stage={selectedStage}
                onChange={changeSelectedStage}
              />
              <div className={c.actions}>
                <Button
                  onClick={async () => {
                    await api.modifyStage(selectedStage)
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          ) : mode === "component" ? (
            <div
              style={{ width: "100%", height: 400, border: "1px solid #ccc" }}
            >
              <PipelineDiagram
                stages={[selectedStage.def]}
                pipeline={{
                  nodes: {
                    stage: {
                      name: selectedStage.def.name,
                      inputs: {}
                    }
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      )}
    </Page>
  )
}

export default StagesPage

// @flow

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Rete from "rete"
import ReactRenderPlugin from "rete-react-render-plugin"
import ConnectionPlugin from "rete-connection-plugin"
import ContextMenuPlugin from "rete-context-menu-plugin"
import AreaPlugin from "rete-area-plugin"
import AutoArrangePlugin from "@seveibar/rete-auto-arrange-plugin/build/auto-arrange-plugin.common.js"
import MyControl from "./MyControl.js"
import MyNode from "./MyNode.js"
import hash from "object-hash"

class SimpleControl extends Rete.Control {
  constructor(emitter, key, name, type, value, optional) {
    super(key)
    this.render = "react"
    this.component = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ color: "#fff", paddingRight: 4 }}>
            {optional === true ? "" : "*"}
            {name}
          </div>
          <input
            placeholder={`[${type}]`}
            style={{
              border: "none",
              width: 150,
              padding: 4,
              marginRight: 4,
              borderRadius: 4
            }}
            value={JSON.stringify(value)}
          />
        </div>
      )
    }
    this.props = { emitter, name }
  }
}

const genericSocket = new Rete.Socket("Generic Value")
class StageComponent extends Rete.Component {
  constructor(stage) {
    super(stage.name)
    this.stage = stage
  }

  builder(node) {
    for (const inputKey in this.stage.inputs) {
      const inp = this.stage.inputs[inputKey]
      const reteInput = new Rete.Input(
        inputKey,
        `${inp.optional === true ? "" : "*"}${inputKey}[${inp.type}]`,
        genericSocket,
        false
      )
      const reteInputControl = new SimpleControl(
        this.editor,
        "control",
        inputKey,
        inp.type,
        node.data[inputKey],
        inp.optional
      )
      reteInput.addControl(reteInputControl)
      node.addInput(reteInput)
    }
    for (const outputKey in this.stage.outputs) {
      const out = this.stage.outputs[outputKey]
      node.addOutput(
        new Rete.Output(outputKey, `${outputKey}[${out.type}]`, genericSocket)
      )
    }

    return node
  }
  worker(node, inputs, outputs) {}
}

export const Diagram = ({ nodes, stages, onConnectionCreated }: any) => {
  const [editor, changeEditor] = useState()
  const containerMountRef = useCallback(container => {
    if (!container) return

    const editor = new Rete.NodeEditor("demo@0.1.0", container)
    const components = stages
      .map(s => new StageComponent(s))
      .concat([
        new StageComponent({
          name: "Value",
          inputs: {},
          outputs: {
            output: { type: "any" }
          }
        })
      ])
    components.forEach(c => editor.register(c))

    editor.use(ConnectionPlugin)
    editor.use(ReactRenderPlugin, { component: MyNode })
    editor.use(ContextMenuPlugin)
    editor.use(AutoArrangePlugin, { margin: { x: 50, y: 80 }, depth: 0 })

    let debounceTime = Date.now()
    editor.on("connectioncreated", ({ input, output }) => {
      if (Date.now() - debounceTime < 500) return
      debounceTime = Date.now()
      if (onConnectionCreated)
        onConnectionCreated({
          inputNodeId: input.node.id,
          inputKey: input.key,
          outputNodeId: output.node.id,
          outputKey: output.key
        })
    })

    changeEditor(editor)
  }, [])

  useEffect(() => {
    if (editor) {
      editor.fromJSON(nodes)
      editor.view.resize()
      setTimeout(() => {
        editor.view.resize()
        editor.trigger("arrange", {})
        AreaPlugin.zoomAt(editor)
      }, 50)
    }
  }, [hash(nodes), hash(stages), Boolean(editor)])

  return (
    <div style={{ textAlign: "left", width: "100%", height: "100%" }}>
      <div ref={containerMountRef} />
    </div>
  )
}

export default Diagram

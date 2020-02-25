// @flow

import React from "react"
import Diagram from "../Diagram/index"

const testStage = {
  kind: "Stage",
name: "MyStageName",
description: "Some stage description",
inputs: {
  some_input: {
    type: "string"
  }
},
outputs: {
  some_input: {
    type: "string"
  }
}
}

export const NodesPage = () => {
  return (
    <Diagram
    stages={stages}
    nodes={reteNodes}
    onConnectionCreated={({
      inputNodeId,
      inputKey,
      outputNodeId,
      outputKey
    }) => {
      const newPipeline = cloneDeep(pipeline)
      onChange(
        set(newPipeline, ["nodes", inputNodeId, "inputs", inputKey], {
          node: outputNodeId,
          output: outputKey
        })
      )
    }}
  />
  )
}

export default NodesPage

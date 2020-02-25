// @flow

import React, { useState, useEffect } from "react"
import Page from "../Page"
import { makeStyles } from "@material-ui/styles"
import WaterTable from "react-watertable"
import { useAPI } from "../APIProvider"
import useNavigation from "../../utils/use-navigation.js"
import GroupedInstances from "../GroupedInstances"

const useStyles = makeStyles({
  root: {
    padding: 20
  },
  statusBlocks: {
    display: "flex",
    flexWrap: "wrap"
  },
  statusBlock: {
    margin: 20,
    padding: 20,
    backgroundColor: "#000",
    "& .title": {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase"
    },
    "& .value": {
      color: "#fff",
      fontSize: 28
    }
  }
})

export const WelcomePage = () => {
  const c = useStyles()
  const { navigate } = useNavigation()

  const statusBlocks = [
    // { title: "Calls/Min", value: 103 },
    // { title: "Active Instances", value: instances ? instances.length : "..." }
  ]

  return (
    <Page title="Welcome">
      <div className={c.root}>

		<h1>Welcome to ETL9</h1>
		<h3>An pipeline orchestrator for everyone.</h3>


      </div>
    </Page>
  )
}

export default WelcomePage

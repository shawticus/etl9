// @flow

import React, {Button, useState, useEffect } from "react"
import Page from "../Page"
import { makeStyles } from "@material-ui/styles"
import useNavigation from "../../utils/use-navigation.js"
import Instances from "../Instances"

const createButton =  { label: "+ Launch Instance", href: "/launch-instance" }

const useStyles = makeStyles({
  root: {
    padding: 20
  },
  createButton: {
    border: "1px solid green",
    padding: "1em",
    margin: "1em",
	color: "green"
  }
})

export default () => {
  const c = useStyles()
  const { navigate } = useNavigation()

  return (
    <Page title="Instances">
      <div className={c.root}>
      <Button className={c.createButton} onClick={() => navigate(createButton.href) } >{createButton.label} </Button>
        <Instances />
      </div>
    </Page>
  )
}

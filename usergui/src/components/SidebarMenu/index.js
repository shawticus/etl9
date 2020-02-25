// @flow

import React from "react"
import { makeStyles } from "@material-ui/styles"
import classnames from "classnames"
import List from "@material-ui/core/List"
import Divider from "@material-ui/core/Divider"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { grey, blue } from "@material-ui/core/colors"
import useNavigation from "../../utils/use-navigation.js"

const useStyles = makeStyles({
  item: {
    marginTop: 5,
    marginBottom: 5
  },
  selectedItem: {
    "&&": { backgroundColor: grey[800] },
    "&& span": {
      color: "#fff",
      fontWeight: "bold"
    }
  },
  createButton: {
    border: "1px solid green",
    padding: "1em",
    margin: "1em"
  },
	logo: {
		padding:".5em",
		paddingBottom:".25em",
		color:"#222"
	}
})

const createButton =  { label: "Create Pipeline", href: "/create-pipeline" }

const items = [
  { label: "Welcome", href: "/" },
  "sep",
  { label: "Instances", href: "/instances" },
  { label: "Pipelines", href: "/pipelines" },
  { label: "Stages", href: "/stages" },
  { label: "Types", href: "/types" },
  "sep",
  { label: "Environment", href: "/environment" },
  { label: "Errors & Warnings", href: "/errors" }
  // { label: "Settings", href: "/settings" }
]

export const SidebarMenu = ({ currentPageTitle }: any) => {
  const c = useStyles()
  const { navigate } = useNavigation()
  return (
    <div className={c.root}>
	<h1 className={c.logo}>ETL9</h1>
      <List>
        {items.map(
          (item, i) =>
            item === "sep" ? (
              <Divider key={i} />
            ) : (
              <ListItem
                button
                onClick={() => navigate(item.href)}
                key={item.label}
                disabled={currentPageTitle === item.label}
                className={classnames(
                  c.item,
                  currentPageTitle === item.label && c.selectedItem
                )}
              >
                <ListItemText>{item.label}</ListItemText>
              </ListItem>
            )
        )}
      </List>
    </div>
  )
}

export default SidebarMenu

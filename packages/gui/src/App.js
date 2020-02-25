// @flow

import React from "react"
import Theme from "./components/Theme"
import { Locations, Location } from "react-router-component"

import APIProvider from "./components/APIProvider"
import PipelinesPage from "./components/PipelinesPage"
import StagesPage from "./components/StagesPage"
import TypesPage from "./components/TypesPage"
import CreateStagePage from "./components/CreateStagePage"
import CreateTypePage from "./components/CreateTypePage"
import CreatePipelinePage from "./components/CreatePipelinePage"
import LaunchInstancePage from "./components/LaunchInstancePage"
import WelcomePage from "./components/WelcomePage"
import EnvironmentPage from "./components/EnvironmentPage"
import SettingsPage from "./components/SettingsPage"
import InstancePage from "./components/InstancePage"
import InstancesPage from "./components/InstancesPage"
import ErrorsPage from "./components/ErrorsPage"

function App() {
  return (
    <APIProvider>
      <Theme>
        <Locations>
          <Location path="/" handler={WelcomePage} />
          <Location path="/launch-instance" handler={LaunchInstancePage} />
          <Location path="/pipelines" handler={PipelinesPage} />
          <Location path="/stages" handler={StagesPage} />
          <Location path="/stages/*" handler={StagesPage} />
          <Location path="/types" handler={TypesPage} />
          <Location path="/create-pipeline" handler={CreatePipelinePage} />
          <Location path="/create-stage" handler={CreateStagePage} />
          <Location path="/create-type" handler={CreateTypePage} />
          <Location path="/settings" handler={SettingsPage} />
          <Location path="/environment" handler={EnvironmentPage} />
          <Location path="/instance/*" handler={InstancePage} />
          <Location path="/instances" handler={InstancesPage} />
          <Location path="/errors" handler={ErrorsPage} />
        </Locations>
      </Theme>
    </APIProvider>
  )
}

export default App

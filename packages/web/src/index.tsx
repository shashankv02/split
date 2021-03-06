import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { GlobalStyles } from "@noquarter/ui"

import LogRocket from "logrocket"
import setupLogRocketReact from "logrocket-react"

import * as serviceWorker from "./lib/serviceWorker"

import Application from "./application"
import { production } from "./lib/config"
import "./lib/prototypes"

if (production) {
  LogRocket.init("yluxch/split")
  setupLogRocketReact(LogRocket)
}

const UI = () => (
  <Fragment>
    <GlobalStyles />
    <Application />
  </Fragment>
)

ReactDOM.render(<UI />, document.getElementById("root"))

serviceWorker.unregister()

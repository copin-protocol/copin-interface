import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ROUTES from 'utils/config/routes'

import DeviceLogsPage from './DeviceLogsPage'

const SecurityPage = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.DEVICE_LOGS.path} component={DeviceLogsPage} />
      <Redirect to={ROUTES.DEVICE_LOGS.path} />
    </Switch>
  )
}

export default SecurityPage

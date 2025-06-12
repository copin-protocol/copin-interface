import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import ROUTES from 'utils/config/routes'

import MySubscriptionPage from './MySubscriptionPage'
import PaymentHistoryPage from './PaymentHistoryPage'

const UserSubscriptionPage = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.USER_SUBSCRIPTION.path} component={MySubscriptionPage} />
      <Route exact path={ROUTES.USER_SUBSCRIPTION_PAYMENT_HISTORY.path} component={PaymentHistoryPage} />
      <Redirect to={ROUTES.USER_SUBSCRIPTION.path} />
    </Switch>
  )
}

export default UserSubscriptionPage

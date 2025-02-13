import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'

import AlertDashboard from './AlertDashboard'
import Layout from './Layouts/Layout'
import UserSubscription from './UserSubscription'

export default function SettingsPage() {
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="Settings" />
      <Layout userSubscription={<UserSubscription />} botAlert={<AlertDashboard />} />
    </SafeComponentWrapper>
  )
}

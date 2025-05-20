import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'

import AlertDashboard from './AlertDashboard'
import AlertLogsPage from './AlertLogs'
import Layout from './Layouts/Layout'

export default function AlertSettingsPage() {
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="Alert" />
      <Layout alertList={<AlertDashboard />} alertLogs={<AlertLogsPage />} />
    </SafeComponentWrapper>
  )
}

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useInternalRole from 'hooks/features/useInternalRole'

import Layout from './Layouts/Layout'
import Overview from './Overview'
import PublicSystemStatus from './PublicPage'
import SystemAlert from './PublicPage/ProtocolStatus'
import WalletWatcher from './WalletWatcher'

export default function SystemStatusPage() {
  const isInternal = useInternalRole()
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="System Status" />
      {isInternal ? (
        <Layout nodeStatus={<Overview />} walletWatcher={<WalletWatcher />} systemAlert={<SystemAlert />} />
      ) : (
        <PublicSystemStatus />
      )}
    </SafeComponentWrapper>
  )
}

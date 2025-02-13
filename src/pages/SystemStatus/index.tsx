import { Trans } from '@lingui/macro'
import React from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoDataFound from 'components/@ui/NoDataFound'
import useInternalRole from 'hooks/features/useInternalRole'

import Layout from './Layouts/Layout'
import Overview from './Overview'
import WalletWatcher from './WalletWatcher'

export default function SystemStatusPage() {
  const isInternal = useInternalRole()
  return (
    <>
      <CustomPageTitle title="System Status" />
      {isInternal ? (
        <Layout nodeStatus={<Overview />} walletWatcher={<WalletWatcher />} />
      ) : (
        <NoDataFound message={<Trans>You do not have permission to access this data</Trans>} />
      )}
    </>
  )
}

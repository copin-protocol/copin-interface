import { Trans } from '@lingui/macro'
import { ThermometerSimple } from '@phosphor-icons/react'
import { Redirect } from 'react-router-dom'

import PageHeader from 'components/@widgets/PageHeader'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import ProtocolStatus from './ProtocolStatus'

export default function PublicSystemStatus() {
  return (
    <SafeComponentWrapper>
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <PageHeader
          pageTitle={`System Status`}
          headerText={<Trans>PROTOCOL STATUS</Trans>}
          icon={ThermometerSimple}
          showSelectProtocol={false}
          showOnMobile
        />
        <Box flex="1 0 0">
          <ProtocolStatus />
        </Box>
      </Flex>
      <Redirect to={ROUTES.PROTOCOL_STATUS.path} />
    </SafeComponentWrapper>
  )
}

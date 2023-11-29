import { Trans } from '@lingui/macro'
import React from 'react'
import { Link } from 'react-router-dom'

import ExplorerTraders from 'assets/images/explorer-traders.png'
import { Button } from 'theme/Buttons'
import { Flex, Image, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

export default function NoAlertList() {
  return (
    <Flex
      px={3}
      py={40}
      sx={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <Image src={ExplorerTraders} sx={{ maxWidth: 162, mb: 3 }} alt="explorer-traders" />
      <Type.Caption mb={12} color="neutral3" textAlign="center">
        <Trans>Discover more than 100,000+ traders on Copin</Trans>
      </Type.Caption>
      <Link to={ROUTES.HOME_EXPLORER.path}>
        <Button type="button" variant="primary" width={150}>
          <Trans>Explorer Traders</Trans>
        </Button>
      </Link>
    </Flex>
  )
}

import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'

import ExplorerTraders from 'assets/images/explorer-traders.png'
import { Button } from 'theme/Buttons'
import { Flex, Image, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'

export default function NoAlertList({ buttonVariant = 'primary' }: { buttonVariant?: string }) {
  return (
    <Flex px={3} py={4} sx={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Image src={ExplorerTraders} sx={{ maxWidth: 90, mb: 3 }} alt="explorer-traders" />
      <Type.Caption mb={12} color="neutral2" textAlign="center">
        <Trans>Discover more than 100,000+ traders on Copin</Trans>
      </Type.Caption>
      <Link to={generateExplorerRoute({ protocol: DEFAULT_PROTOCOL })}>
        <Button type="button" variant={buttonVariant} width={150}>
          <Trans>Explorer Traders</Trans>
        </Button>
      </Link>
    </Flex>
  )
}

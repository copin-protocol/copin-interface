import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import noTraders from 'assets/images/traders-empty.svg'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import { Flex, Image, Type } from 'theme/base'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'

export default function NoAlertList({
  buttonVariant = 'ghostPrimary',
  title = 'You have not add alert any trader yet.',
}: {
  buttonVariant?: string
  title?: ReactNode
}) {
  return (
    <Flex px={3} py={3} sx={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Alert
        variant="cardWarning"
        description={
          <Flex pt={2} flexDirection="column" alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
            <Image width={100} src={noTraders} alt="alert-no-traders" />
            <Type.Caption textAlign="center" color="orange1">
              {title}
            </Type.Caption>
            <Link to={generateExplorerRoute({})} target="_blank">
              <Button type="button" variant={buttonVariant} p={0}>
                <Trans>Explore Traders</Trans>
              </Button>
            </Link>
          </Flex>
        }
      />
    </Flex>
  )
}

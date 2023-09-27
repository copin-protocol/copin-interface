import { Trans } from '@lingui/macro'
import { ArrowClockwise, House } from '@phosphor-icons/react'
import React from 'react'
import { Link } from 'react-router-dom'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'
import { getErrorMessage } from 'utils/helpers/handleError'

const ErrorFallback = ({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) => {
  const message = getErrorMessage(error)
  let dynamicModuleError = false
  if (message.includes('Failed to fetch dynamically imported module')) {
    dynamicModuleError = true
  }
  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column" height="100vh" textAlign="center">
      <Type.H2>
        <Trans>Something went wrong</Trans>
      </Type.H2>
      <Type.Caption color="neutral3" maxWidth={750} my={3}>
        {message}
        {dynamicModuleError && <Trans>. Try to reload the page to fix this issue</Trans>}
      </Type.Caption>
      <Flex sx={{ gap: 2 }}>
        <ButtonWithIcon
          icon={<ArrowClockwise size={20} />}
          width={175}
          variant="outlinePrimary"
          block
          onClick={() => location.reload()}
        >
          <Trans>Reload</Trans>
        </ButtonWithIcon>
        <Link to="/">
          <ButtonWithIcon icon={<House size={20} />} width={175} variant="outline" block onClick={resetErrorBoundary}>
            <Trans>Back To Home</Trans>
          </ButtonWithIcon>
        </Link>
      </Flex>
    </Flex>
  )
}

export default ErrorFallback

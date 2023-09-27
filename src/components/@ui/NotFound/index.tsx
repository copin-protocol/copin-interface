import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import image404 from 'assets/images/404-image.png'
import { Button } from 'theme/Buttons'
import { Box, Flex, Image, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'

export default function NotFound({
  title = <Trans>This Page Could Not Be Found</Trans>,
  message = (
    <Trans>
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </Trans>
  ),
  back = (
    <Link to={ROUTES.HOME.path} replace>
      <Button variant="primary">
        <Trans>Back to home</Trans>
      </Button>
    </Link>
  ),
}: {
  title?: ReactNode
  message?: ReactNode
  back?: ReactNode
}) {
  return (
    <Flex width="100%" sx={{ alignItems: 'center', justifyContent: 'center' }} minHeight={500}>
      <Flex
        p={3}
        sx={{ maxWidth: 600, width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <Image src={image404} sx={{ maxWidth: [200, 250], mb: 4 }} alt="404" />
        <Type.LargeBold mb={16} textAlign="center">
          {title}
        </Type.LargeBold>
        <Type.Body mb={4} color="neutral3" textAlign="center">
          {message}
        </Type.Body>
        {back}
        <Box height={1} width="100%" bg="neutral7" mt={4}></Box>
        <Box mt={3}>
          <Type.Caption sx={{ '&>*': { mx: 2 } }}>
            <span>
              <Trans>Need help?</Trans>
            </span>
            <a href={LINKS.docs} target="_blank" rel="noreferrer">
              View Docs
            </a>
            <a href={LINKS.discord} target="_blank" rel="noreferrer">
              Join Discord
            </a>
          </Type.Caption>
        </Box>
      </Flex>
    </Flex>
  )
}

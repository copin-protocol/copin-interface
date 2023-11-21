import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import notFound from 'assets/images/not-found.png'
import { Flex, Image, Type } from 'theme/base'

export default function NoDataFound({ message = <Trans>No Data Found</Trans> }: { message?: ReactNode }) {
  return (
    <Flex px={3} py={4} sx={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Image src={notFound} sx={{ maxWidth: 65, mb: 3 }} alt="no-data-found" />
      <Type.Caption color="neutral3" textAlign="center">
        {message}
      </Type.Caption>
    </Flex>
  )
}

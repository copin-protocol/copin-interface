import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import noSelectTraders from 'assets/images/select-traders.svg'
import noTraders from 'assets/images/traders-empty.svg'
import { Button } from 'theme/Buttons'
import { Flex, Image, Type } from 'theme/base'

type ComponentTypes = 'noTraders' | 'noSelectTraders' | 'noSelectTradersInHistory' | 'noSelectTradersInOpening'
const configs: { [key in ComponentTypes]: { title: ReactNode; content: ReactNode; image: string } } = {
  noTraders: {
    title: <Trans>This trader list is empty</Trans>,
    content: <Trans>Let copy a trader and make profit!</Trans>,
    image: noTraders,
  },
  noSelectTraders: {
    title: <Trans>Please pick trader to view copies detail</Trans>,
    content: (
      <Trans>
        Find the trader you want in the list of traders, all of the trader&apos;s copy settings will be listed here.
      </Trans>
    ),
    image: noSelectTraders,
  },
  noSelectTradersInHistory: {
    title: <Trans>Please pick trader to view your history</Trans>,
    content: (
      <Trans>
        Find the trader you want in the list of traders above, all of the trader&apos;s history positions will be listed
        here.
      </Trans>
    ),
    image: noSelectTraders,
  },
  noSelectTradersInOpening: {
    title: <Trans>Please pick trader to view your opening positions</Trans>,
    content: null,
    image: noSelectTraders,
  },
}

export default function NoDataOrSelect({
  type,
  actionButton,
  handleClickActionButton,
  isLoading,
  actionButtonText,
}: {
  type: ComponentTypes
  actionButton?: JSX.Element | null
  handleClickActionButton?: () => void
  isLoading?: boolean
  actionButtonText?: ReactNode
}) {
  const config = configs[type]
  return (
    <Flex
      sx={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <Image src={config.image} sx={{ height: 48 }} />
      <Type.CaptionBold textAlign="center" mt={20} mb={1}>
        {config.title}
      </Type.CaptionBold>
      <Type.Caption textAlign="center">{config.content}</Type.Caption>
      {actionButton ? (
        actionButton
      ) : handleClickActionButton ? (
        <Button variant="primary" mt={3} onClick={handleClickActionButton} isLoading={isLoading} disabled={isLoading}>
          {actionButtonText}
        </Button>
      ) : null}
    </Flex>
  )
}

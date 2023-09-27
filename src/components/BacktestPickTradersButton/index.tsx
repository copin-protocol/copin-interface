import { ArrowElbowLeftUp, ArrowRight } from '@phosphor-icons/react'

import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'

export default function PickTradersButton({
  listAddress,
  handleClick,
  type = 'home',
}: {
  listAddress: string[] | undefined
  handleClick: () => void
  type?: 'home' | 'backtest'
}) {
  const noSelectTitle = type === 'home' ? 'Select trader to backtest' : 'Select trader to set strategy'
  const buttonTitle = type === 'home' ? 'Backtest' : 'Set Strategy'
  const sx =
    type === 'home'
      ? {}
      : {
          px: 1,
          '& > div': {
            gap: 1,
            justifyContent: ['start', 'center'],
            '& > div': {
              gap: 1,
            },
          },
        }
  return (
    <>
      {listAddress?.length ? (
        <Button
          className="backtest__button"
          variant="primary"
          sx={{
            color: 'neutral7',
            width: '100%',
            height: '100%',
            borderRadius: 0,
            py: 0,
            px: 12,
            flexShrink: 0,
            ...sx,
          }}
          onClick={handleClick}
        >
          <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <Box color="neutral1">
              <AvatarGroup addresses={listAddress} limit={3} />
            </Box>
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Type.CaptionBold>
                {buttonTitle} {`(${listAddress.length})`}
              </Type.CaptionBold>
              <ArrowRight size={16} />
            </Flex>
          </Flex>
        </Button>
      ) : (
        <Flex
          className="no_select__message"
          width="100%"
          height="100%"
          sx={{
            alignItems: 'center',
            gap: 2,
            px: 3,
            flexShrink: 0,
            borderRight: 'small',
            borderColor: ['transparent', 'neutral4'],
          }}
          color="neutral3"
        >
          <ArrowElbowLeftUp size={16} />
          <Type.Caption>{noSelectTitle}</Type.Caption>
        </Flex>
      )}
    </>
  )
}

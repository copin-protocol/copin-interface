import { CaretDown, CaretUp, Minus } from '@phosphor-icons/react'

import { AccountInfo, AvatarSize } from 'components/@ui/AccountInfo'
import { TopTraderData } from 'entities/trader'
import CopyButton from 'theme/Buttons/CopyButton'
import { Flex, IconBox, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function LeaderInfo({
  info,
  size = 40,
  isCurrentLeaderboard,
}: {
  info: TopTraderData
  size?: AvatarSize
  isCurrentLeaderboard?: boolean
  hasHover?: boolean
}) {
  const deltaRanking = isCurrentLeaderboard ? (info?.lastRanking ?? 1001) - info.ranking : 0

  return (
    <Flex
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
      }}
      minWidth="200px"
    >
      <Flex
        alignItems="center"
        sx={{
          gap: 1,
          '& .hiding-btn': { opacity: 0, transition: 'all 240ms ease' },
          '&:hover': { '& .hiding-btn': { opacity: 1 } },
        }}
      >
        <AccountInfo
          address={info.account}
          protocol={info.protocol}
          avatarSize={size}
          wrapperSx={{ width: 'fit-content' }}
          addressWidth={'100%'}
          shouldShowProtocol={false}
        />
        <CopyButton
          type="button"
          variant="ghost"
          value={info.account}
          size="sm"
          sx={{ color: 'neutral3', p: 0 }}
          iconSize={14}
          className={'hiding-btn'}
        ></CopyButton>
        <Flex alignItems="center">
          <IconBox
            icon={
              deltaRanking === 0 ? (
                <Minus />
              ) : deltaRanking > 0 ? (
                <CaretUp weight="fill" />
              ) : (
                <CaretDown weight="fill" />
              )
            }
            color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}
          />
          <Type.Small color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}>
            {deltaRanking !== 0 && formatNumber(Math.abs(deltaRanking))}
            {isCurrentLeaderboard && !info.lastRanking && '+'}
          </Type.Small>
        </Flex>
      </Flex>
    </Flex>
  )
}

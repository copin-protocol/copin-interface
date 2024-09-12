// import { Link } from 'react-router-dom'
import AddressAvatar from 'components/@ui/AddressAvatar'
import RankingChangeIndicator from 'components/@ui/RankingChangeIndicator'
import { TopTraderData } from 'entities/trader'
// import { useProtocolStore } from 'hooks/store/useProtocols'
// import useTraderCopying from 'hooks/store/useTraderCopying'
// import CopyButton from 'theme/Buttons/CopyButton'
// import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
import { addressShorten } from 'utils/helpers/format'

// import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

export default function AccountInfo({
  info,
  size = 40,
  isCurrentLeaderboard,
}: {
  info: TopTraderData
  size?: number
  isCurrentLeaderboard?: boolean
}) {
  // const { protocol: defaultProtocol } = useProtocolStore()
  // const { isCopying } = useTraderCopying(info.account, info.protocol)
  // const protocol = info.protocol ?? defaultProtocol

  return (
    <Flex
      // as={Link}
      // to={generateTraderMultiExchangeRoute({ protocol, address: info.account })}
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
      }}
      onClick={(e: any) => e.stopPropagation()}
      minWidth="200px"
    >
      <AddressAvatar address={info.account} size={size} />
      <Flex
        flexDirection="column"
        sx={{
          textAlign: 'left',
        }}
      >
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.CaptionBold
            // data-tip="React-tooltip"
            // data-tooltip-id={`account-${info.account}-tt`}
            // data-tooltip-delay-hide={0}
            // data-tooltip-delay-show={360}
            // data-tooltip-offset={-8}
            color={'inherit'}
            width={80}
            // sx={{
            //   ':hover': {
            //     color: 'primary1',
            //     textDecoration: 'underline',
            //   },
            // }}
          >
            {addressShorten(info.account, 3, 5)}
          </Type.CaptionBold>
          {isCurrentLeaderboard && <RankingChangeIndicator ranking={info.ranking} lastRanking={info.lastRanking} />}
          {/* <Tooltip
            id={`account-${info.account}-tt`}
            place="top"
            type="dark"
            effect="solid"
            noArrow={true}
            clickable={true}
            style={{
              padding: 0,
            }}
            delayShow={360}
            delayHide={0}
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <CopyButton
                variant="ghost"
                size="xs"
                value={info.account}
                iconSize={16}
                sx={{
                  transition: 'none',
                }}
              >
                Copy
              </CopyButton>
            </div>
          </Tooltip> */}
        </Flex>
      </Flex>
    </Flex>
  )
}

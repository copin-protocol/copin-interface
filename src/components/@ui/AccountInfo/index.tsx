import { SystemStyleObject } from '@styled-system/css'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useGlobalStore from 'hooks/store/useGlobalStore'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import useTraderCopying from 'hooks/store/useTraderCopying'
// import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { addressShorten, shortenText } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

// import ProtocolLogo from '../ProtocolLogo'

export function AccountInfo({
  isOpenPosition,
  address,
  protocol,
  type,
  note,
  size = 40,
  smartAccount,
  keyword,
  hasHover = true,
  sx,
  wrapperSx,
}: {
  isOpenPosition: boolean
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  note?: string
  size?: number
  smartAccount?: string
  keyword?: string
  hasHover?: boolean
  sx?: SystemStyleObject & GridProps
  wrapperSx?: any
}) {
  const protocolTooltipId = uuid()
  const { setTrader } = useQuickViewTraderStore()
  const { protocol: defaultProtocol } = useGlobalStore()
  protocol = protocol ?? defaultProtocol
  const { isCopying } = useTraderCopying(address, protocol)

  return (
    <Flex
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
        ...(wrapperSx || {}),
      }}
    >
      <Box
        width={size}
        height={size}
        sx={{
          '&:hover': hasHover
            ? {
                cursor: 'pointer',
                backgroundImage: `url(${IconEye})`,
                backgroundSize: '24px',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }
            : {},
        }}
        onClick={(event) => {
          event.stopPropagation()
          setTrader({ address, protocol, type })
        }}
      >
        <AddressAvatar address={address} size={size} sx={{ '&:hover': hasHover ? { opacity: 0.25 } : {} }} />
        {/*{!hasHover || (hasHover && !isHovered) ? (*/}
        {/*  <AddressAvatar address={address} size={size} />*/}
        {/*) : (*/}
        {/*  <Flex*/}
        {/*    width={size}*/}
        {/*    height={size}*/}
        {/*    fontSize={size * 0.65}*/}
        {/*    sx={{*/}
        {/*      borderRadius: size / 2,*/}
        {/*      overflow: 'hidden',*/}
        {/*      backgroundColor: 'neutral7',*/}
        {/*      flexShrink: 0,*/}
        {/*      '&:hover': { cursor: 'pointer' },*/}
        {/*    }}*/}
        {/*    alignItems="center"*/}
        {/*    justifyContent="center"*/}
        {/*    onClick={() => {*/}
        {/*      action?.()*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Eye size={16} />*/}
        {/*  </Flex>*/}
        {/*)}*/}
      </Box>
      <Flex
        as={Link}
        to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: type } })}
        onClick={(e: any) => e.stopPropagation()}
        flex="1"
        flexDirection="column"
        sx={{
          color: 'inherit',
          textAlign: 'left',
          ...sx,
        }}
      >
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Caption
            // data-tip="React-tooltip"
            // data-tooltip-id={`account-${address}-tt`}
            // data-tooltip-delay-hide={0}
            // data-tooltip-delay-show={360}
            // data-tooltip-offset={-8}
            width={80}
            lineHeight="24px"
            color={isCopying ? 'orange1' : 'inherit'}
            sx={{
              ':hover': {
                color: 'primary1',
                textDecoration: 'underline',
              },
            }}
          >
            <HighlightKeyword text={address} keyword={keyword} />
          </Type.Caption>
          {/* {isOpenPosition && (
            <ActiveDot tooltipId={`tt_opening_${address}`} tooltipContent={<Trans>Having open positions</Trans>} />
          )} */}
          <ProtocolLogo
            protocol={protocol}
            size={24}
            hasText={false}
            data-tip="React-tooltip"
            data-tooltip-id={`tt_protocol_${protocolTooltipId}`}
            data-tooltip-offset={0}
          />
          <Tooltip id={`tt_protocol_${protocolTooltipId}`} clickable={false}>
            <ProtocolLogo protocol={protocol} />
          </Tooltip>
        </Flex>
        {smartAccount ? (
          <Type.Small
            color="neutral3"
            data-tip="React-tooltip"
            data-tooltip-id={`tt_sm_${smartAccount}`}
            data-tooltip-offset={0}
            data-tooltip-delay-hide={0}
            data-tooltip-delay-show={360}
          >
            Smart Account:{' '}
            <Type.Small>
              <HighlightKeyword text={smartAccount} keyword={keyword} />
            </Type.Small>
          </Type.Small>
        ) : note != null ? (
          note ? (
            <Type.Small
              px={2}
              py="2px"
              bg="neutral4"
              sx={{ borderRadius: 20, width: 'fit-content' }}
              data-tip="React-tooltip"
              data-tooltip-id={`tt_note_${address}`}
              data-tooltip-offset={0}
            >
              {note.slice(0, 10)}
              {note.length > 10 && '...'}
            </Type.Small>
          ) : (
            <div></div>
          )
        ) : // <Type.Small color="neutral3">
        //   <BalanceText protocol={protocol} account={address} />
        // </Type.Small>
        null}
        {note && note.length > 10 && (
          <Tooltip id={`tt_note_${address}`} clickable={false}>
            {note}
          </Tooltip>
        )}
        {smartAccount && (
          <Tooltip id={`tt_sm_${smartAccount}`} clickable={false}>
            Smart Account: {smartAccount}
          </Tooltip>
        )}
      </Flex>
    </Flex>
  )
}

function HighlightKeyword({ text, keyword }: { text: string; keyword?: string }) {
  return keyword ? (
    <Highlighter
      searchWords={[keyword, addressShorten(keyword, 3, 5), shortenText(keyword, 5), keyword.slice(-3, keyword.length)]}
      textToHighlight={addressShorten(text, 3, 5)}
      highlightStyle={{
        backgroundColor: 'rgba(78, 174, 253, 0.3)',
        color: 'white',
      }}
    />
  ) : (
    <>{addressShorten(text, 3, 5)}</>
  )
}

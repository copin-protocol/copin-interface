import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import ActiveDot from 'components/@ui/ActiveDot'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { useProtocolStore } from 'hooks/store/useProtocols'
import useTraderCopying from 'hooks/store/useTraderCopying'
// import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
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
  sx?: SystemStyleObject & GridProps
  wrapperSx?: any
}) {
  const protocolTooltipId = uuid()
  const { protocol: defaultProtocol } = useProtocolStore()
  protocol = protocol ?? defaultProtocol
  const { isCopying } = useTraderCopying(address, protocol)

  return (
    <Flex
      as={Link}
      to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: type } })}
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
        ...(wrapperSx || {}),
      }}
      onClick={(e: any) => e.stopPropagation()}
    >
      <AddressAvatar address={address} size={size} />
      <Flex
        flex="1"
        flexDirection="column"
        sx={{
          width: 100,
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

          {isOpenPosition && (
            <ActiveDot tooltipId={`tt_opening_${address}`} tooltipContent={<Trans>Having open positions</Trans>} />
          )}
          <ProtocolLogo
            protocol={protocol}
            size={24}
            hasText={false}
            data-tip="React-tooltip"
            data-tooltip-id={`tt_protocol_${protocolTooltipId}`}
            data-tooltip-offset={0}
          />
          <Tooltip id={`tt_protocol_${protocolTooltipId}`} place="top" type="dark" effect="solid" clickable={false}>
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
              py={1}
              bg="neutral4"
              sx={{ borderRadius: 'sm', width: 'fit-content' }}
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
          <Tooltip id={`tt_note_${address}`} place="top" type="dark" effect="solid" clickable={false}>
            {note}
          </Tooltip>
        )}
        {smartAccount && (
          <Tooltip id={`tt_sm_${smartAccount}`} place="top" type="dark" effect="solid" clickable={false}>
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

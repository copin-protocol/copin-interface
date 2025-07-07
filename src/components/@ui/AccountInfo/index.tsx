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
import { useEnsName } from 'hooks/useEnsName'
// import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { addressShorten, shortenEnsName, shortenText } from 'utils/helpers/format'
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
  shouldShowProtocol = true,
  sx,
  addressWidth = 80,
  wrapperSx,
  label,
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
  shouldShowProtocol?: boolean
  sx?: SystemStyleObject & GridProps
  addressWidth?: number | string
  wrapperSx?: any
  label?: string
}) {
  const protocolTooltipId = uuid()
  const ensTooltipId = uuid()
  const { setTrader } = useQuickViewTraderStore()
  const { protocol: defaultProtocol } = useGlobalStore()
  protocol = protocol ?? defaultProtocol
  const { isCopying } = useTraderCopying(address, protocol)

  const { ensName } = useEnsName(address)

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
        <Flex alignItems="center" sx={{ gap: 1, alignItems: 'start' }}>
          <Flex flexDirection={'column'} justifyContent={'start'}>
            <Flex alignItems="center">
              <Type.Caption
                width={addressWidth}
                color={isCopying ? 'orange1' : 'inherit'}
                sx={{
                  lineHeight: '24px',
                  ':hover': {
                    color: 'primary1',
                    textDecoration: 'underline',
                  },
                  ...sx,
                }}
                data-tip="React-tooltip"
                data-tooltip-id={ensTooltipId}
                data-tooltip-offset={0}
              >
                {ensName ? shortenEnsName(ensName) : <HighlightKeyword text={address} keyword={keyword} />}
              </Type.Caption>

              {shouldShowProtocol && (
                <>
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
                </>
              )}
            </Flex>
            {label && (
              <Type.Small
                px={2}
                py="2px"
                bg="neutral4"
                color="neutral1"
                sx={{ borderRadius: 20, width: 'fit-content', display: 'inline-block' }}
                // data-tip="React-tooltip"
                // data-tooltip-id={label && label.length > 10 ? `tt_combined_${address}_${protocol}` : undefined}
                // data-tooltip-offset={0}
              >
                {label}
              </Type.Small>
            )}
          </Flex>
          {/* <Tooltip id={`tt_combined_${address}_${protocol}`} clickable={false} place="bottom">
            <div>{label && <Type.Caption>{label}</Type.Caption>}</div>
          </Tooltip> */}

          {ensName && (
            <Tooltip id={ensTooltipId} clickable={false}>
              <Flex flexDirection="column" sx={{ gap: 1 }}>
                <Type.Caption>{ensName}</Type.Caption>
                <Type.Caption>
                  <HighlightKeyword text={address} keyword={keyword} />
                </Type.Caption>
              </Flex>
            </Tooltip>
          )}
          {/* {shouldShowProtocol && (
            <ProtocolLogo
              protocol={protocol}
              size={24}
              hasText={false}
              data-tip="React-tooltip"
              data-tooltip-id={`tt_protocol_${protocolTooltipId}`}
              data-tooltip-offset={0}
            />
          )}
          <Tooltip id={`tt_protocol_${protocolTooltipId}`} clickable={false}>
            <ProtocolLogo protocol={protocol} />
          </Tooltip> */}
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
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
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
        ) : null}
        {note && note.length > 10 && (
          <Tooltip id={`tt_note_${address}`} clickable={false}>
            <Type.Caption
              maxWidth={300}
              textAlign="center"
              style={{
                textTransform: 'none',
              }}
            >
              {note}
            </Type.Caption>
          </Tooltip>
        )}
        {smartAccount && (
          <Tooltip id={`tt_sm_${smartAccount}`} clickable={false}>
            <Type.Caption>Smart Account: {smartAccount}</Type.Caption>
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

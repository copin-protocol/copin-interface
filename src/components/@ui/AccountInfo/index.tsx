import { SystemStyleObject } from '@styled-system/css'
import { HTMLAttributeAnchorTarget } from 'react'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { AlertLabel } from 'components/@widgets/AlertLabel'
import useGlobalStore from 'hooks/store/useGlobalStore'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { useEnsName } from 'hooks/useEnsName'
import { DisabledActionType } from 'pages/TraderDetails/TraderActionButtons'
// import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { addressShorten, shortenEnsName, shortenText } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

// import ProtocolLogo from '../ProtocolLogo'

export type AvatarSize = 40 | 32 | 24 | 18

export function AccountInfo({
  address,
  protocol,
  type,
  addressFormatter: AddressFormatter = Type.Caption,
  note,
  avatarSize = 40,
  smartAccount,
  keyword,
  hasQuickView = true,
  shouldShowProtocol = true,
  shouldShowFullText = false,
  hasLink = true,
  hasAddressTooltip = true,
  textSx,
  addressWidth = 80,
  wrapperSx = {},
  label,
  labelSx = {},
  addressProps = {},
  onPreview,
  linkTarget,
  quickViewDisabledActions,
  quickViewDisabledLinkAccount,
}: {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  note?: string
  avatarSize?: AvatarSize
  smartAccount?: string
  keyword?: string
  hasQuickView?: boolean
  shouldShowProtocol?: boolean
  shouldShowFullText?: boolean
  hasLink?: boolean
  hasAddressTooltip?: boolean
  textSx?: SystemStyleObject & GridProps
  addressWidth?: number | string
  wrapperSx?: any
  label?: string
  labelSx?: SystemStyleObject & GridProps
  addressFormatter?: React.ElementType
  addressProps?: any
  onPreview?: () => void
  linkTarget?: HTMLAttributeAnchorTarget
  quickViewDisabledActions?: DisabledActionType[]
  quickViewDisabledLinkAccount?: boolean
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
        ...wrapperSx,
      }}
    >
      <Box
        width={avatarSize}
        height={avatarSize}
        sx={{
          '&:hover': hasQuickView
            ? {
                cursor: 'pointer',
                backgroundImage: `url(${IconEye})`,
                backgroundSize: `${avatarSize / 1.5}px`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }
            : {},
        }}
        onClick={
          hasQuickView
            ? (event) => {
                event.stopPropagation()
                event.preventDefault()
                onPreview?.()
                setTrader(
                  { address, protocol, type },
                  {
                    disabledActions: quickViewDisabledActions,
                    disabledLinkAccount: quickViewDisabledLinkAccount,
                  }
                )
              }
            : undefined
        }
      >
        <AddressAvatar address={address} size={avatarSize} sx={{ '&:hover': hasQuickView ? { opacity: 0.25 } : {} }} />
      </Box>
      <Flex
        as={hasLink ? Link : 'div'}
        to={hasLink ? generateTraderMultiExchangeRoute({ protocol, address, params: { time: type } }) : undefined}
        target={linkTarget}
        onClick={(e: any) => e.stopPropagation()}
        flex="1"
        flexDirection="column"
        sx={{
          color: 'inherit',
          textAlign: 'left',
          ...textSx,
        }}
      >
        <Flex alignItems="center" sx={{ gap: 1, alignItems: 'start' }}>
          <Flex flexDirection={'column'} justifyContent={'start'}>
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <AddressFormatter
                width={addressWidth}
                color={isCopying ? 'orange1' : 'inherit'}
                sx={{
                  lineHeight: '24px',
                  ...(hasLink && {
                    ':hover': {
                      color: 'primary1',
                      textDecoration: 'underline',
                    },
                  }),
                  ...textSx,
                }}
                data-tip="React-tooltip"
                data-tooltip-id={ensTooltipId}
                data-tooltip-offset={0}
                {...addressProps}
              >
                {ensName ? (
                  shouldShowFullText ? (
                    ensName
                  ) : (
                    shortenEnsName(ensName)
                  )
                ) : keyword ? (
                  <HighlightKeyword text={address} keyword={keyword} shouldShowFullText={shouldShowFullText} />
                ) : shouldShowFullText ? (
                  address
                ) : (
                  addressShorten(address)
                )}
              </AddressFormatter>

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
            <AlertLabel alertLabel={label || ''} sx={{ fontSize: '10px', ...labelSx }} />
          </Flex>
          {/* <Tooltip id={`tt_combined_${address}_${protocol}`} clickable={false} place="bottom">
            <div>{label && <Type.Caption>{label}</Type.Caption>}</div>
          </Tooltip> */}

          {ensName && hasAddressTooltip && (
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
              {note.slice(0, 12)}
              {note.length > 12 && '...'}
            </Type.Small>
          ) : (
            <div></div>
          )
        ) : null}
        {/* {note && note.length > 10 && (
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
        )} */}
        {smartAccount && (
          <Tooltip id={`tt_sm_${smartAccount}`} clickable={false}>
            <Type.Caption>Smart Account: {smartAccount}</Type.Caption>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  )
}

function HighlightKeyword({
  text,
  keyword,
  shouldShowFullText = false,
}: {
  text: string
  keyword?: string
  shouldShowFullText?: boolean
}) {
  return keyword ? (
    <Highlighter
      searchWords={[keyword, addressShorten(keyword, 3, 5), shortenText(keyword, 5), keyword.slice(-3, keyword.length)]}
      textToHighlight={shouldShowFullText ? text : addressShorten(text, 3, 5)}
      highlightStyle={{
        backgroundColor: 'rgba(78, 174, 253, 0.3)',
        color: 'white',
      }}
    />
  ) : (
    <>{shouldShowFullText ? text : addressShorten(text, 3, 5)}</>
  )
}

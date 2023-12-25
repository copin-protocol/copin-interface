import { SystemStyleObject } from '@styled-system/css'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import { useProtocolStore } from 'hooks/store/useProtocols'
import useTraderCopying from 'hooks/store/useTraderCopying'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { addressShorten, shortenText } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

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
}) {
  const { protocol: defaultProtocol } = useProtocolStore()
  const { isCopying } = useTraderCopying(address)
  protocol = protocol ?? defaultProtocol

  return (
    <Flex
      as={Link}
      to={generateTraderDetailsRoute(protocol, address, { type })}
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
      }}
      onClick={(e: any) => e.stopPropagation()}
    >
      <AddressAvatar address={address} size={size} />
      <Flex
        flexDirection="column"
        sx={{
          width: 90,
          textAlign: 'left',
          ...sx,
        }}
      >
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Caption
            data-tip="React-tooltip"
            data-tooltip-id={`account-${address}-tt`}
            data-tooltip-delay-hide={0}
            data-tooltip-delay-show={360}
            data-tooltip-offset={-8}
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
          <Tooltip
            id={`account-${address}-tt`}
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
                value={address}
                iconSize={16}
                sx={{
                  transition: 'none',
                }}
              >
                Copy
              </CopyButton>
            </div>
          </Tooltip>

          {isOpenPosition && (
            <Box
              width={8}
              height={8}
              bg="green2"
              sx={{
                borderRadius: '50%',
              }}
              data-tip="React-tooltip"
              data-tooltip-id={`tt_opening_${address}`}
            />
          )}
          {isOpenPosition && (
            <Tooltip id={`tt_opening_${address}`} place="top" type="dark" effect="solid" clickable={false}>
              <Type.Small sx={{ maxWidth: [300, 400] }}>Having open positions</Type.Small>
            </Tooltip>
          )}
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
        ) : (
          <Type.Small color="neutral3">
            <BalanceText protocol={protocol} account={address} />
          </Type.Small>
        )}
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

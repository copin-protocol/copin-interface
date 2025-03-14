import { Trans } from '@lingui/macro'
import { MinusCircle } from '@phosphor-icons/react'

import { CopyTradeData } from 'entities/copyTrade'
import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, Type } from 'theme/base'

import { renderCopyTrader, renderTitle } from '../renderProps/copyTradeColumns'

export default function ListSelectedCopyTrade({ onDismiss }: { onDismiss: () => void }) {
  const { listCopyTrade, toggleCopyTrade } = useSelectCopyTrade()
  const handleDeleteSelection = (copyTrade: CopyTradeData) => {
    toggleCopyTrade(copyTrade)
    if (listCopyTrade.length === 1) {
      onDismiss()
    }
  }
  return (
    <Box>
      <Flex mb={2} px={3} sx={{ gap: 3 }}>
        <Type.Caption color="neutral3" sx={{ width: 160, flexShrink: 0 }}>
          <Trans>TRADER</Trans>
        </Type.Caption>
        <Type.Caption flex="1" color="neutral3" textAlign="left">
          <Trans>LABEL</Trans>
        </Type.Caption>
        <Box flex="auto 0 40px" />
      </Flex>
      <Box sx={{ maxHeight: 400, minHeight: 200, overflow: 'hidden auto' }}>
        {listCopyTrade.map((copyTrade) => {
          return (
            <Flex
              py={1}
              key={copyTrade.id}
              px={3}
              sx={{ gap: 3, alignItems: 'center', '&:hover': { bg: 'neutral5', '.icon': { opacity: 1 } } }}
            >
              <Flex sx={{ width: 160, flexShrink: 0 }}>
                {renderCopyTrader({ data: copyTrade, options: { enabledQuickView: false } })}
              </Flex>
              <Flex flex="1">{renderTitle(copyTrade)}</Flex>
              <IconButton
                className="icon"
                width="max-content"
                height="max-content"
                icon={<MinusCircle size={16} />}
                sx={{
                  opacity: 0,
                  flex: 'auto 0 40px',
                  p: 0,
                  m: 0,
                  color: 'neutral2',
                  '&:hover': { color: 'neutral1' },
                }}
                onClick={() => handleDeleteSelection(copyTrade)}
              />
            </Flex>
          )
        })}
      </Box>
    </Box>
  )
}

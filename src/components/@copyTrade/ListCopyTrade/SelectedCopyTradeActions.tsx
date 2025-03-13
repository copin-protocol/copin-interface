import { Trans } from '@lingui/macro'
import { PencilSimpleLine, Stamp, Trash } from '@phosphor-icons/react'
import { ComponentProps, useState } from 'react'

import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, Type } from 'theme/base'

import BulkCopyModifyModal, { BulkCopyModifyModalType } from '../BulkCopyModifyModal'
import SelectCopyTradeCheckbox from './SelectCopyTradeCheckbox'

export default function SelectedCopyTradeActions({
  isAbsolutePosition,
  hiddenSelectAll,
  hiddenSelectedText,
  hiddenCancel,
  wrapperSx = {},
  isDcp = false,
}: {
  isAbsolutePosition?: boolean
  hiddenSelectAll?: boolean
  hiddenSelectedText?: boolean
  hiddenCancel?: boolean
  wrapperSx?: any
  isDcp?: boolean
}) {
  const { listCopyTrade, prevListCopyTrade, setPrevListCopyTrade, toggleSelectAll } = useSelectCopyTrade()
  const [modal, setModal] = useState<null | BulkCopyModifyModalType>(null)
  const _listCopyTrade = listCopyTrade?.length ? listCopyTrade : prevListCopyTrade
  const handleOpenModal = (type: BulkCopyModifyModalType) => {
    setModal(type)
    setPrevListCopyTrade(listCopyTrade)
  }
  const handleDismissModal = () => {
    setModal(null)
  }

  const listAction = (
    <Flex sx={{ alignItems: 'center', gap: 12 }}>
      {!hiddenSelectedText && (
        <Type.Caption color="neutral3">
          <Trans>
            Selected{' '}
            <Box as="span" color="neutral1">
              {_listCopyTrade.length} Copies
            </Box>
          </Trans>
        </Type.Caption>
      )}
      <StyledIconButton icon={<PencilSimpleLine size={18} />} onClick={() => handleOpenModal('edit')} />
      <StyledIconButton inline icon={<Stamp size={18} />} onClick={() => handleOpenModal('clone')} />
      <StyledIconButton inline icon={<Trash size={18} />} onClick={() => handleOpenModal('delete')} />
      <BulkCopyModifyModal type={modal} isOpen={!!modal} onDismiss={handleDismissModal} isDcp={isDcp} />
    </Flex>
  )
  if (!_listCopyTrade?.length) return null
  if (isAbsolutePosition) {
    return (
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, bg: 'neutral7', px: 3, ...wrapperSx }}>
        <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', gap: 3 }}>
          {!hiddenSelectAll && <SelectCopyTradeCheckbox type="all" data={undefined} label="Select All" />}
          {listAction}
          {!hiddenCancel && (
            <Button onClick={() => toggleSelectAll(false)} variant="outline" size="xs">
              <Trans>Cancel</Trans>
            </Button>
          )}
        </Flex>
      </Box>
    )
  }
  return listAction
}

const StyledIconButton = ({ sx, ...props }: ComponentProps<typeof IconButton>) => {
  return (
    <IconButton
      {...props}
      width="max-content"
      height="max-content"
      variant="ghost"
      inline
      sx={{
        p: 0,
        bg: 'transparent',
        ...sx,
      }}
    />
  )
}

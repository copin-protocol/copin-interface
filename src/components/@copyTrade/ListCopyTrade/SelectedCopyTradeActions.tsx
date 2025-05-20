import { Trans } from '@lingui/macro'
import { PencilSimpleLine, Stamp, Trash } from '@phosphor-icons/react'
import { ComponentProps, useState } from 'react'

import UpgradeButton from 'components/@subscription/UpgradeButton'
import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import useCopyTradePermission from 'hooks/features/subscription/useCopyTradePermission'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, Type } from 'theme/base'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

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
  const { userPermission, pagePermission } = useCopyTradePermission()
  const isEnableBulkAction = userPermission?.isEnableBulkAction
  const requiredPlan = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableBulkAction,
  })
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
    <Flex sx={{ alignItems: 'center', gap: 1 }}>
      {!hiddenSelectedText && (
        <Type.Caption color="neutral1">
          <Trans>
            Selected{' '}
            <Box as="span" color="neutral1">
              {_listCopyTrade.length} Copies
            </Box>
          </Trans>
        </Type.Caption>
      )}
      {isEnableBulkAction ? (
        <>
          <StyledIconButton icon={<PencilSimpleLine size={18} />} onClick={() => handleOpenModal('edit')} />
          <StyledIconButton inline icon={<Stamp size={18} />} onClick={() => handleOpenModal('clone')} />
          <StyledIconButton inline icon={<Trash size={18} />} onClick={() => handleOpenModal('delete')} />
          <BulkCopyModifyModal type={modal} isOpen={!!modal} onDismiss={handleDismissModal} isDcp={isDcp} />
        </>
      ) : (
        <Flex sx={{ gap: '2px', alignItems: 'center' }}>
          <Type.Caption mr={1} display={['none', 'block']}>
            -
          </Type.Caption>
          <UpgradeButton requiredPlan={requiredPlan} />
          <Type.Caption color="neutral1">
            <Trans>to enable bulk actions</Trans>
          </Type.Caption>
        </Flex>
      )}
    </Flex>
  )
  if (!_listCopyTrade?.length) return null
  if (isAbsolutePosition) {
    return (
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, bg: 'neutral7', px: 3, ...wrapperSx }}>
        <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', gap: 3 }}>
          {!hiddenSelectAll && isEnableBulkAction && (
            <SelectCopyTradeCheckbox type="all" data={undefined} label="Select All" />
          )}
          {listAction}
          {!hiddenCancel && isEnableBulkAction && (
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

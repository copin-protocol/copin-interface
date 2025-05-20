import { Trans } from '@lingui/macro'
import { ArrowLeft, PencilSimpleLine } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { EditText } from 'react-edit-text'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import IconButton from 'theme/Buttons/IconButton'
import Input from 'theme/Input'
import Popconfirm from 'theme/Popconfirm'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { AlertCustomType } from 'utils/config/enums'

import { CustomHeaderProps } from './types'

/**
 * Header component with back button and title
 */
export const EditAlertHeader = ({
  isNew,
  hasChange,
  customType,
  name,
  description,
  total,
  limit,
  userNextPlan,
  setName,
  setDescription,
  onBack,
}: CustomHeaderProps) => {
  const [isEdit, setIsEdit] = useState(false)
  let defaultName = ''
  if (isNew) {
    switch (customType) {
      case AlertCustomType.TRADER_FILTER:
        defaultName = 'TRADER FILTER'
        break
      case AlertCustomType.TRADER_GROUP:
        defaultName = 'TRADER GROUP'
        break
    }
  }
  return (
    <Flex flexDirection="column" px={3} py={2} sx={{ gap: 2, borderBottom: 'small', borderColor: 'neutral4' }}>
      <Flex alignItems="center" justifyContent="space-between">
        {hasChange ? (
          <Popconfirm
            action={<IconButton icon={<ArrowLeft size={20} />} size={20} variant="ghost" sx={{ p: 0 }}></IconButton>}
            title="Discard changes?"
            description="You have unsaved changes. Are you sure to discard them?"
            onConfirm={onBack}
            cancelAfterHide={false}
            confirmButtonProps={{ variant: 'ghostDanger' }}
          />
        ) : (
          <IconButton
            icon={<ArrowLeft size={20} />}
            size={20}
            variant="ghost"
            type="button"
            onClick={onBack}
            sx={{ p: 0 }}
          ></IconButton>
        )}
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Body sx={{ textTransform: 'uppercase' }}>
            {isNew ? (
              defaultName
            ) : (
              <Box
                sx={{
                  lineHeight: 0,
                  '& button svg': { verticalAlign: 'middle' },
                  '& input': { outline: 'none', border: 'small', borderColor: 'neutral4', borderRadius: '2px' },
                  '& > *': { display: 'flex', alignItems: 'center' },
                }}
              >
                <EditText
                  value={name}
                  showEditButton
                  editButtonContent={<PencilSimpleLine size={18} />}
                  editButtonProps={{
                    style: {
                      backgroundColor: 'transparent',
                      color: themeColors.primary1,
                      position: 'relative',
                      flexShrink: 0,
                      padding: 0,
                    },
                  }}
                  style={{
                    margin: 0,
                    padding: '0px',
                    fontSize: '14px',
                    lineHeight: '25px',
                    backgroundColor: 'transparent',
                    borderColor: themeColors.neutral4,
                    borderWidth: '1px',
                    borderStyle: isEdit ? 'solid' : undefined,
                    minHeight: '25px',
                  }}
                  onChange={(e) => {
                    const value = e.target.value.trim()
                    if (value && value.length > 20) return
                    setName(e.target.value)
                  }}
                  onSave={({ value, previousValue }) => {
                    const trimValue = value.trim()
                    if (!!trimValue) {
                      setName(trimValue)
                    } else {
                      setName(previousValue)
                    }
                    setIsEdit(false)
                  }}
                  onBlur={() => setIsEdit(false)}
                  onEditMode={() => setIsEdit(true)}
                />
              </Box>
            )}
          </Type.Body>
          {total != null && (
            <BadgeWithLimit
              total={total}
              limit={limit}
              tooltipContent={
                userNextPlan && (
                  <PlanUpgradePrompt
                    requiredPlan={userNextPlan}
                    title={<Trans>You have exceeded your trader limit for the current plan.</Trans>}
                    confirmButtonVariant="textPrimary"
                    titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
                  />
                )
              }
              clickableTooltip
            />
          )}
        </Flex>
        <Box width={20} />
      </Flex>
      {!isNew && (
        <Input
          block
          value={description ?? ''}
          placeholder="Enter description"
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          sx={{ width: '100%' }}
        />
      )}
    </Flex>
  )
}

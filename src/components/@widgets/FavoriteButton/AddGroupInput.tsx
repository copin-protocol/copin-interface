import { Trans } from '@lingui/macro'
import { Check, X } from '@phosphor-icons/react'
import React, { useRef, useState } from 'react'

import { BotAlertData } from 'entities/alert'
import useCustomAlerts from 'hooks/features/alert/useCustomAlerts'
import IconButton from 'theme/Buttons/IconButton'
import InputField from 'theme/InputField'
import { Flex } from 'theme/base'
import { BOOKMARK_GROUP_NAME_MAX_LENGTH } from 'utils/config/constants'
import { AlertCustomType } from 'utils/config/enums'

const AddGroupInput = ({
  onCreated,
  showTitle = true,
  onCanceled,
}: {
  onCreated: (data: BotAlertData | undefined) => void
  showTitle?: boolean
  onCanceled?: () => void
}) => {
  const [newGroupName, setNewGroupName] = useState<string>()
  const newGroupNameRef = useRef<HTMLInputElement>(null)

  const { createCustomAlert, submittingCreate } = useCustomAlerts({
    onSuccess: (data) => {
      setNewGroupName(undefined)
      onCreated(data)
    },
    createSuccessMsg: <Trans>Group created successfully</Trans>,
  })
  return (
    <InputField
      block
      placeholder="Enter group name"
      autoFocus
      ref={newGroupNameRef}
      label={showTitle ? 'New Group' : undefined}
      suffix={
        <Flex sx={{ gap: 2 }}>
          <IconButton
            size={24}
            type="button"
            disabled={!newGroupName || submittingCreate}
            variant="ghostSuccess"
            icon={<Check size={16} />}
            onClick={() => {
              if (!newGroupName) return
              createCustomAlert({ name: newGroupName, type: AlertCustomType.TRADER_BOOKMARK })
            }}
          />
          <IconButton
            size={24}
            type="button"
            variant="ghost"
            icon={<X size={16} />}
            onClick={() => {
              onCanceled?.()
              setNewGroupName(undefined)
            }}
          />
        </Flex>
      }
      annotation={`${newGroupName?.length ?? 0}/${BOOKMARK_GROUP_NAME_MAX_LENGTH}`}
      onChange={(event) => {
        if (event.target.value.length <= BOOKMARK_GROUP_NAME_MAX_LENGTH) {
          setNewGroupName(event.target.value)
        } else {
          event.target.value = newGroupName || ''
        }
      }}
    />
  )
}

export default AddGroupInput

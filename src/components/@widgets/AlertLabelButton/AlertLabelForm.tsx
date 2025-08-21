import { Trans } from '@lingui/macro'
import { BellSimpleSlash, Check, PencilSimpleLine, X } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import { TraderAlertData } from 'entities/alert'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import InputField from 'theme/InputField'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

import { AlertLabel } from '../AlertLabel'
import { GroupAlertList } from '../GroupAlertList'

const LABEL_MAX_LENGTH = 30

interface AlertLabelFormProps {
  label: string
  setLabel: (label: string) => void
  isEditing: boolean
  editModeShowed: boolean
  currentLabel: string
  inputRef: React.RefObject<HTMLInputElement>
  submitting: boolean
  shouldShowCloseEdit: boolean
  shouldShowGroupAlert: boolean
  groupAlerts: any[]
  onSave: (e: React.FormEvent) => void
  onEditClick: () => void
  onEditCancel: (e: React.MouseEvent) => void
  onUnotify: (e: React.MouseEvent) => void
  currentAlert: TraderAlertData | undefined
}

export const AlertLabelForm: React.FC<AlertLabelFormProps> = ({
  label,
  setLabel,
  isEditing,
  editModeShowed,
  currentLabel,
  inputRef,
  submitting,
  shouldShowCloseEdit,
  shouldShowGroupAlert,
  groupAlerts,
  onSave,
  onEditClick,
  onEditCancel,
  onUnotify,
  currentAlert,
}: AlertLabelFormProps) => {
  const { md } = useResponsive()
  const hasGroupAlerts = groupAlerts.length > 0

  return (
    <form onSubmit={onSave}>
      <Box mt={'10px'} textAlign="right" width="100%">
        {!isEditing && currentAlert && !editModeShowed && (
          // Show "Add label" when a new alert is created without a label
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              cursor: 'pointer',
            }}
          >
            {currentLabel === '' ? (
              <ButtonWithIcon
                onClick={onEditClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  bg: 'neutral5',
                  color: 'neutral3',
                  borderRadius: 20,
                  width: 'fit-content',
                }}
                icon={<PencilSimpleLine weight="light" color={`${themeColors.primary1}`} size={16} />}
              >
                <Type.Caption>Add label</Type.Caption>
              </ButtonWithIcon>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  maxWidth: 150,
                }}
              >
                <AlertLabel alertLabel={currentLabel} sx={{ px: '8px', py: '3px', textAlign: 'left' }} />
                <PencilSimpleLine weight="light" color={`${themeColors.primary1}`} size={16} onClick={onEditClick} />
              </Box>
            )}
            <Flex alignItems="start" color={themeColors.red1} onClick={onUnotify} style={{ cursor: 'pointer' }}>
              <BellSimpleSlash size={16} />
              <Type.Caption ml={'2px'}>
                <Trans>REMOVE</Trans>
              </Type.Caption>
            </Flex>
          </Flex>
        )}
        {(isEditing || !currentAlert) && (
          <Box width={'100%'} mt="10px">
            <InputField
              autoFocus
              ref={inputRef}
              value={label}
              label={'Label (Optional)'}
              annotation={`${label?.length ?? 0}/${LABEL_MAX_LENGTH}`}
              block={true}
              inputSx={{
                px: 2,
                py: 1,
                border: 'neutral3',
                backgroundColor: 'neutral6',
                color: 'neutral1',
              }}
              onChange={(event) => {
                if (event.target.value.length <= LABEL_MAX_LENGTH) {
                  setLabel(event.target.value)
                }
              }}
              suffix={
                isEditing &&
                currentAlert && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size={24}
                      type="button"
                      variant="ghostSuccess"
                      icon={<Check size={16} />}
                      onClick={onSave}
                      disabled={label.trim() === (currentLabel || '').trim() || submitting}
                    />
                    {shouldShowCloseEdit && (
                      <X
                        size={16}
                        style={{
                          cursor: 'pointer',
                          color: themeColors.neutral3,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = themeColors.neutral2)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = themeColors.neutral3)}
                        onClick={onEditCancel}
                      />
                    )}
                  </Box>
                )
              }
            />
          </Box>
        )}
        {!currentAlert && (
          <Button
            type="submit"
            variant="ghostPrimary"
            size="sm"
            sx={{ fontWeight: 'bold', mt: 1 }}
            isLoading={submitting}
          >
            <Trans>NOTIFY</Trans>
          </Button>
        )}
        {hasGroupAlerts && shouldShowGroupAlert && (
          <Box mt={3}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Flex alignItems="center" width="100%" sx={{ position: 'relative' }}>
                {md ? (
                  <Type.Caption textAlign="left" color="neutral3" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                    <Trans>Group ALerts</Trans>
                  </Type.Caption>
                ) : (
                  <Type.BodyBold textAlign="left" color="neutral3" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                    <Trans>Group ALerts</Trans>
                  </Type.BodyBold>
                )}
                <Box
                  sx={{
                    flex: 1,
                    height: '0.1px',
                    backgroundColor: 'neutral4',
                  }}
                />
              </Flex>
            </Flex>
            <GroupAlertList groupAlerts={groupAlerts} />
          </Box>
        )}
      </Box>
    </form>
  )
}

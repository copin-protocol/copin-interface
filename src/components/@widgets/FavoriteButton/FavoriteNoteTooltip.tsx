import { Trans } from '@lingui/macro'
import { Plus, Trash } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import UpgradeModal from 'components/@subscription/UpgradeModal'
import KeyListener from 'components/@ui/KeyListener'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import Popconfirm from 'theme/Popconfirm'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { BOOKMARK_NO_GROUP_KEY } from 'utils/config/constants'
import { AlertCustomType, KeyNameEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'
import { addressShorten } from 'utils/helpers/format'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import AddGroupInput from './AddGroupInput'

const NOTE_MAX_LENGTH = 36

const SELECT_PADDING = 12

const SELECT_MAX_HEIGHT = 200

// // Create root level element for react-tooltips
// const domNode = document.createElement('reach-portal')
// document.body.appendChild(domNode)
// domNode.style.zIndex = '10001'
// domNode.style.position = 'fixed'

// // Wrapper component to portal react-tooltips
// function BodyPortal({ children }: { children: ReactNode }) {
//   const domNode = document.getElementsByTagName('reach-portal')
//   console.log('domNode', domNode)
//   return domNode && domNode.length ? ReactDOM.createPortal(children, domNode[0]) : <div>{children}</div>
// }
const FavoriteNoteTooltip = () => {
  const {
    submitting,
    setTraderFavorite,
    tooltipAddress: address,
    tooltipProtocol: protocol,
    tooltipPosition: position,
    isEdit,
    isEditInGroup,
    bookmarks,
    setTooltip,
    unsetTraderFavorite,
  } = useTraderFavorites()
  const { myProfile } = useMyProfile()
  const [note, setNote] = useState<string | undefined>(bookmarks[`${address}-${protocol}`]?.note ?? undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastSelectedGroupsRef = useRef<string[]>([])

  const [isOpenUpgradeModal, setIsOpenUpgradeModal] = useState(false)
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    bookmarks[`${address}-${protocol}`]?.customAlertIds ?? []
  )
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [openingSelectGroup, setOpeningSelectGroup] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number
    left?: number
    right?: number
  }>({ top: 0 })
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const { searchParams } = useSearchParams()
  const removeEnabled = searchParams.groupId === BOOKMARK_NO_GROUP_KEY || !isEditInGroup

  const { bookmarkGroups } = useBotAlertContext()
  const { bookmarkGroupsQuota, maxBookmarkGroupsQuota } = useAlertPermission()
  const { md } = useResponsive()
  const isOpen = !!address && !!protocol

  const groupOptions = useMemo(() => {
    return bookmarkGroups
      ?.filter((alert) => alert.type === AlertCustomType.TRADER_BOOKMARK)
      .map((alert) => ({
        value: alert.id,
        label: alert.name,
      }))
  }, [bookmarkGroups])

  useEffect(() => {
    if (!!address) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    }
  }, [address])

  useEffect(() => {
    setNote(bookmarks[`${address}-${protocol}`]?.note ?? '')
    if (bookmarks[`${address}-${protocol}`]?.customAlertIds) {
      setSelectedGroups(bookmarks[`${address}-${protocol}`].customAlertIds ?? [])
    } else {
      setSelectedGroups(lastSelectedGroupsRef.current)
    }
  }, [address, protocol, bookmarks])

  // Calculate tooltip position to stay within viewport (only for desktop)
  useEffect(() => {
    if (position && tooltipRef.current && md) {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Tooltip dimensions (approximate)
      const tooltipWidth = 350 // Based on the width in sx
      const tooltipHeight = 252

      let calculatedTop = position.top

      // Adjust vertical position
      if (position.top + tooltipHeight + 28 > viewportHeight) {
        // Tooltip would go below viewport, position above
        calculatedTop = position.top - tooltipHeight - 16
      } else {
        // Position below with offset
        calculatedTop = position.top + 28
      }

      // Ensure tooltip doesn't go above viewport
      if (calculatedTop < 0) {
        calculatedTop = 10
      }

      // Adjust horizontal position
      const finalPosition: { top: number; left?: number; right?: number } = { top: calculatedTop }

      if (position.left + tooltipWidth > viewportWidth) {
        // Tooltip would go beyond right edge, use right positioning
        finalPosition.right = viewportWidth - position.left - 20
      } else if (position.left < tooltipWidth + 10) {
        // Tooltip would go beyond left edge, use left positioning with offset
        finalPosition.left = position.left
      } else {
        // Normal positioning
        finalPosition.left = position.left
      }

      setTooltipPosition(finalPosition)
    }
  }, [position, md])

  const logEventFavorite = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.FAVORITES,
      action,
    })
  }

  const reset = () => {
    setTooltip(undefined)
    setNote(undefined)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isOpen) return
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      if (!tooltipRef.current || !mousePosition || !isOpen || !md) return

      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      if (
        openingSelectGroup &&
        mousePosition.y <=
          tooltipRect.bottom +
            (Math.min(SELECT_MAX_HEIGHT, groupOptions?.length ? groupOptions.length * 34 : 48) - 48) &&
        mousePosition.x >= tooltipRect.left + SELECT_PADDING &&
        mousePosition.x <= tooltipRect.right - SELECT_PADDING
      ) {
        return
      }

      // Check if mouse is outside the tooltip bounds
      const isMouseOutside =
        mousePosition.x < tooltipRect.left ||
        mousePosition.x > tooltipRect.right ||
        mousePosition.y < tooltipRect.top ||
        mousePosition.y > tooltipRect.bottom

      if (isMouseOutside) {
        setTooltip(undefined)
      }
    }

    const handleResize = () => {
      setTooltip(undefined)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    window.addEventListener('wheel', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('wheel', handleScroll)
    }
  }, [mousePosition, isOpen, setTooltip, openingSelectGroup, groupOptions, md])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (!!address) {
        setTooltip(undefined)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setTooltip, address])

  const renderContent = () => {
    if (!address || !protocol) return null

    return (
      <>
        <Flex alignItems="center">
          <Type.BodyBold textAlign="left" sx={{ mb: 2 }} flex="1">
            {isEdit ? <Trans>Edit Bookmark</Trans> : <Trans>Bookmark</Trans>} {addressShorten(address)}
          </Type.BodyBold>
          {isEdit && removeEnabled && (
            <Popconfirm
              action={
                <ButtonWithIcon icon={<Trash size={16} />} variant="ghostDanger" size="sm" sx={{ px: 0 }}>
                  <Trans>Remove</Trans>
                </ButtonWithIcon>
              }
              title="Are you sure you want to remove this trader from all bookmarks?"
              onConfirm={() => {
                unsetTraderFavorite({ protocol, address })
                setTooltip(undefined)
              }}
              confirmButtonProps={{ variant: 'ghostDanger' }}
            />
          )}
        </Flex>
        <KeyListener keyName={KeyNameEnum.ESCAPE} onFire={() => setTooltip(undefined)} />
        <form
          onSubmit={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setTraderFavorite({ address, protocol, note, isEdit, customAlertIds: selectedGroups })
            lastSelectedGroupsRef.current = selectedGroups
            reset()
            logEventFavorite(
              !!note
                ? EVENT_ACTIONS[EventCategory.FAVORITES].ADD_FAVORITE_WITH_NOTE
                : EVENT_ACTIONS[EventCategory.FAVORITES].ADD_FAVORITE_WITHOUT_NOTE
            )
          }}
        >
          <Box mt={1} textAlign="right">
            <InputField
              ref={inputRef}
              value={note}
              label="Note (optional)"
              annotation={`${note?.length ?? 0}/${NOTE_MAX_LENGTH}`}
              block
              inputSx={{
                px: 2,
                py: 1,
              }}
              onChange={(event) => {
                if (event.target.value.length <= NOTE_MAX_LENGTH) {
                  setNote(event.target.value)
                } else {
                  event.target.value = note || ''
                }
              }}
            />
            <Box mt={20} textAlign="left">
              {!creatingGroup && (
                <Flex alignItems="center" justifyContent="space-between" mb={2}>
                  <Type.Caption color="neutral2">
                    <Trans>Groups (optional)</Trans>
                  </Type.Caption>

                  <ButtonWithIcon
                    icon={<Plus />}
                    size="xs"
                    variant="outline"
                    sx={{ mb: 0 }}
                    onClick={() => {
                      if (groupOptions && groupOptions.length >= bookmarkGroupsQuota) {
                        setIsOpenUpgradeModal(true)
                        return
                      }
                      setCreatingGroup(true)
                    }}
                  >
                    <Trans>New Group</Trans>
                  </ButtonWithIcon>
                </Flex>
              )}

              {creatingGroup ? (
                <Box sx={{ mb: '48px' }}>
                  <AddGroupInput
                    onCreated={(data) => {
                      setCreatingGroup(false)
                      if (data?.id) setSelectedGroups((prev) => [...prev, data.id])
                    }}
                    onCanceled={() => {
                      setCreatingGroup(false)
                    }}
                  />
                </Box>
              ) : groupOptions ? (
                <Select
                  minMenuHeight={SELECT_MAX_HEIGHT}
                  maxMenuHeight={SELECT_MAX_HEIGHT}
                  className="select-container pad-right-0"
                  closeMenuOnSelect={false}
                  onMenuOpen={() => setOpeningSelectGroup(true)}
                  onMenuClose={() => setOpeningSelectGroup(false)}
                  options={groupOptions}
                  value={groupOptions?.filter?.((option) => selectedGroups.includes(option.value))}
                  onChange={(newValue: any) => {
                    setSelectedGroups(newValue?.map((data: any) => data.value))
                  }}
                  placeholder="Select groups"
                  components={{
                    DropdownIndicator: () => <div></div>,
                  }}
                  isSearchable
                  menuPosition="fixed"
                  menuIsOpen={groupOptions.length === selectedGroups?.length ? false : undefined}
                  menuPlacement={md ? 'auto' : 'top'}
                  isMulti
                />
              ) : (
                <div></div>
              )}
            </Box>
            {!creatingGroup && (
              <Flex sx={{ gap: 2, mt: 12, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="ghost"
                  mr={3}
                  size="sm"
                  sx={{ px: 0, transition: 'none', fontWeight: 'normal' }}
                  disabled={creatingGroup}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    reset()
                    logEventFavorite(EVENT_ACTIONS[EventCategory.FAVORITES].CANCEL_FAVORITE)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="ghostPrimary"
                  size="sm"
                  disabled={creatingGroup}
                  sx={{ px: 0, transition: 'none' }}
                  isLoading={submitting}
                >
                  Done
                </Button>
              </Flex>
            )}
          </Box>
        </form>
        {!!maxBookmarkGroupsQuota && isOpenUpgradeModal && (
          <UpgradeModal
            isOpen={isOpenUpgradeModal}
            onDismiss={() => {
              setIsOpenUpgradeModal(false)
            }}
            title={<Trans>You&apos;ve hit your bookmark groups limit</Trans>}
            description={
              <Trans>
                You&apos;re reach the maximum of Bookmark Groups for your current plan. Upgrade your plan to unlock
                access up to {maxBookmarkGroupsQuota} bookmark groups
              </Trans>
            }
          />
        )}
      </>
    )
  }

  // For mobile (below md), use bottom sheet modal
  if (!md) {
    return (
      <Modal isOpen={isOpen} onDismiss={reset} zIndex={Z_INDEX.TOASTIFY + 1}>
        <Box p={3}>{renderContent()}</Box>
      </Modal>
    )
  }

  // For desktop (md and above), use the original tooltip
  return (
    <OutsideClickHandler
      onOutsideClick={(e) => {
        if (isOpenUpgradeModal) return
        setTooltip(undefined)
      }}
    >
      <Box
        ref={tooltipRef}
        tabIndex={0}
        sx={{
          position: 'fixed',
          zIndex: Z_INDEX.TOASTIFY + 1,
          top: tooltipPosition.top,
          left: tooltipPosition.left ?? 32,
          width: '350px',
          maxWidth: '350px',
          bg: 'neutral7',
          border: 'small',
          borderColor: 'neutral4',
          boxShadow: '0px 0px 12px -3px rgba(255, 255, 255, 0.1)',
          p: SELECT_PADDING,
          borderRadius: 'xs',
          transition: 'opacity 0.1s ease-in-out',
          transitionDelay: '0.1s',
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0,
        }}
      >
        {isOpen && renderContent()}
      </Box>
    </OutsideClickHandler>
  )
}

export default FavoriteNoteTooltip

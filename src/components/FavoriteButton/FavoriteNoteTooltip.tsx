import { useResponsive } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import KeyListener from 'components/@ui/KeyListener'
import useMyProfile from 'hooks/store/useMyProfile'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import { Box, Type } from 'theme/base'
import { KeyNameEnum } from 'utils/config/enums'
import { addressShorten } from 'utils/helpers/format'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const NOTE_MAX_LENGTH = 36

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
    tooltipPosition: position,
    setTooltip,
  } = useTraderFavorites()
  const { myProfile } = useMyProfile()
  const [note, setNote] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!!address) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    }
  }, [address])

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

  const { sm } = useResponsive()

  return (
    <>
      <Box
        tabIndex={0}
        sx={{
          display: !!address ? 'block' : 'none',
          position: 'fixed',
          zIndex: 10005,
          top: position?.top ?? 0,
          left: position && sm ? position.left : 32,
          width: sm ? 'auto' : 'calc(100% - 64px)',
          bg: 'neutral7',
          border: 'small',
          borderColor: 'neutral4',
          boxShadow: '0px 0px 12px -3px rgba(255, 255, 255, 0.1)',
          p: 12,
          borderRadius: 'xs',
          transform: position && position?.top > 200 ? 'translateY(calc(-100% - 4px))' : 'translateY(28px)',
        }}
      >
        {!!address && (
          <OutsideClickHandler
            onOutsideClick={(e) => {
              e.stopPropagation()
              reset()
            }}
          >
            <Type.CaptionBold textAlign="left" width="100%">
              Add {addressShorten(address)} to favorite list
            </Type.CaptionBold>
            <KeyListener keyName={KeyNameEnum.ESCAPE} onFire={() => setTooltip(undefined)} />
            <form
              onSubmit={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setTraderFavorite(address, note)
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
                  defaultValue={note}
                  label="Take Note"
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
                <Button
                  type="button"
                  variant="ghost"
                  mr={3}
                  size="xs"
                  sx={{ px: 0, mt: 2, transition: 'none', fontWeight: 'normal' }}
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
                  size="xs"
                  sx={{ px: 0, mt: 2, transition: 'none' }}
                  isLoading={submitting}
                >
                  Done
                </Button>
              </Box>
            </form>
          </OutsideClickHandler>
        )}
      </Box>
    </>
  )
}

export default FavoriteNoteTooltip

import { Star } from '@phosphor-icons/react'
import { useEffect } from 'react'

import { useClickLoginButton } from 'components/LoginAction'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { IconBox } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

export default function FavoriteButton({
  source,
  address,
  size = 24,
  color = 'primary1',
  hoverColor = 'primary2',
  activeColor = 'primary1',
}: {
  address: string
  size?: number
  color?: string
  hoverColor?: string
  activeColor?: string
  source?: EventSource
}) {
  const {
    traderFavorites,
    submitting: favoriteSubmitting,
    setTraderFavorite,
    unsetTraderFavorite,
    tooltipAddress,
    setTooltip,
  } = useTraderFavorites()
  const { isAuthenticated, profile } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const hasFavorite = traderFavorites.includes(address)

  const logEventFavorite = (action: string) => {
    logEvent({
      label: getUserForTracking(profile?.username),
      category: EventCategory.FAVORITES,
      action,
    })
  }

  const handleAddFavorite = (e: any, note?: string) => {
    e.stopPropagation()

    if (hasFavorite) {
      unsetTraderFavorite(address)

      logEventFavorite(
        source === EventSource.HOME
          ? EVENT_ACTIONS[EventCategory.FAVORITES].HOME_CANCEL_FAVORITE
          : EVENT_ACTIONS[EventCategory.FAVORITES].REMOVE_FAVORITE
      )
      return
    }
    setTraderFavorite(address, note)
    setTooltip(undefined)

    logEventFavorite(
      source === EventSource.HOME
        ? EVENT_ACTIONS[EventCategory.FAVORITES].HOME_OPEN_FAVORITES
        : EVENT_ACTIONS[EventCategory.FAVORITES].OPEN_FAVORITES
    )
  }
  useEffect(() => {
    if (!tooltipAddress) return
    const dom = document.getElementById('trader-table')
    const handleScroll = () => {
      if (tooltipAddress) setTooltip(undefined)
    }
    dom?.addEventListener('scroll', handleScroll)
    return () => dom?.removeEventListener('scroll', handleScroll)
  }, [setTooltip, tooltipAddress])
  return (
    <div className="favorite-btn">
      <IconBox
        // data-tip="React-tooltip"
        // data-tooltip-id={`tt_favorite_note_${address}`}
        // data-tooltip-delay-hide={240}
        role="button"
        variant="ghost"
        onClick={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          if (hasFavorite) {
            handleAddFavorite(e)
          } else {
            if (!isAuthenticated) {
              handleClickLogin()
              return
            }
            setTooltip(address, e.currentTarget.getBoundingClientRect())
          }
        }}
        disabled={favoriteSubmitting}
        className={hasFavorite ? '' : 'hiding-btn'}
        icon={<Star weight={hasFavorite ? 'fill' : 'regular'} size={size} />}
        sx={{
          color: hasFavorite ? activeColor : color,
          '&:hover:not([disabled])': {
            color: hoverColor,
          },
        }}
        // onClick={handleAddFavorite}
      />
    </div>
  )
}

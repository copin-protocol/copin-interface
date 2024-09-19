import { Star } from '@phosphor-icons/react'
import { useEffect } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import useTraderFavorites, { getTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { IconBox } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

export default function FavoriteButton({
  source,
  address,
  protocol,
  size = 24,
  color = 'neutral3',
  hoverColor = 'primary1',
  activeColor = 'primary1',
  sx = {},
}: {
  address: string
  protocol: ProtocolEnum
  size?: number
  color?: string
  hoverColor?: string
  activeColor?: string
  source?: EventSource
  sx?: any
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
  const traderFavorite = getTraderFavoriteValue({ address, protocol })
  const hasFavorite = traderFavorites.includes(traderFavorite)

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
      unsetTraderFavorite({ address, protocol })

      logEventFavorite(
        source === EventSource.HOME
          ? EVENT_ACTIONS[EventCategory.FAVORITES].HOME_CANCEL_FAVORITE
          : EVENT_ACTIONS[EventCategory.FAVORITES].REMOVE_FAVORITE
      )
      return
    }
    setTraderFavorite({ address, protocol, note })
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
            setTooltip({ address, protocol, position: e.currentTarget.getBoundingClientRect() })
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
          ...sx,
        }}
        // onClick={handleAddFavorite}
      />
    </div>
  )
}

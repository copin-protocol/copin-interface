import { Star } from '@phosphor-icons/react'
import { useEffect } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import useTraderFavorites, { getTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import IconButton from 'theme/Buttons/IconButton'
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
      <IconButton
        type="button"
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
            console.log('gd')
            setTooltip({ address, protocol, position: e.currentTarget.getBoundingClientRect() })
          }
        }}
        disabled={favoriteSubmitting}
        className={hasFavorite ? '' : 'hiding-btn'}
        icon={<Star weight={hasFavorite ? 'fill' : 'regular'} size={size} />}
        size={size}
        sx={{
          p: 0,
          color: hasFavorite ? activeColor : color,
          ...sx,
        }}
        // onClick={handleAddFavorite}
      />
    </div>
  )
}

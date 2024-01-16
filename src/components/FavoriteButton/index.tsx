import { Star } from '@phosphor-icons/react'
import { useEffect } from 'react'

import { useClickLoginButton } from 'components/LoginAction'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import IconButton from 'theme/Buttons/IconButton'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function FavoriteButton({
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
  const handleAddFavorite = (e: any, note?: string) => {
    e.stopPropagation()

    if (hasFavorite) {
      unsetTraderFavorite(address)
      logEvent({
        label: getUserForTracking(profile?.username),
        category: EventCategory.FAVORITES,
        action: EVENT_ACTIONS[EventCategory.FAVORITES].REMOVE_FAVORITE,
      })
      return
    }
    setTraderFavorite(address, note)
    setTooltip(undefined)
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
        // data-tip="React-tooltip"
        // data-tooltip-id={`tt_favorite_note_${address}`}
        // data-tooltip-delay-hide={240}
        type="button"
        size={size}
        variant="ghost"
        onClick={(e) => {
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

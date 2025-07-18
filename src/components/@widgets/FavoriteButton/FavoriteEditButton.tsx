import { Pencil } from '@phosphor-icons/react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import useTraderFavorites, { getTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import IconButton from 'theme/Buttons/IconButton'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

export default function FavoriteEditButton({
  source,
  address,
  protocol,
  size = 24,
  sx = {},
  isEditInGroup,
}: {
  address: string
  protocol: ProtocolEnum
  size?: number
  source?: EventSource
  sx?: any
  isEditInGroup?: boolean
}) {
  const {
    traderFavorites,
    submitting: favoriteSubmitting,
    setTraderFavorite,
    unsetTraderFavorite,
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

  return (
    <div className="favorite-btn">
      <IconButton
        type="button"
        variant="ghostInactive"
        onClick={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isAuthenticated) {
            handleClickLogin()
            return
          }
          setTooltip({
            address,
            protocol,
            position: e.currentTarget.getBoundingClientRect(),
            isEdit: true,
            isEditInGroup,
          })
        }}
        disabled={favoriteSubmitting}
        className="hiding-btn"
        icon={<Pencil size={size} />}
        size={size}
        sx={{
          p: 0,
          ...sx,
        }}
        // onClick={handleAddFavorite}
      />
    </div>
  )
}

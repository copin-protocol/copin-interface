import { Trash } from '@phosphor-icons/react'

import useSearchParams from 'hooks/router/useSearchParams'
import useTraderFavorites, { getTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import IconButton from 'theme/Buttons/IconButton'
import Popconfirm from 'theme/Popconfirm'
import { ProtocolEnum } from 'utils/config/enums'

export default function FavoriteRemoveButton({
  address,
  protocol,
  size = 24,
  sx = {},
}: {
  address: string
  protocol: ProtocolEnum
  size?: number
  sx?: any
}) {
  const { searchParams } = useSearchParams()
  const { bookmarks, setTraderFavorite, unsetTraderFavorite } = useTraderFavorites()

  const key = getTraderFavoriteValue({
    address,
    protocol,
  })

  const customAlertIds = bookmarks[key]?.customAlertIds
  if (!searchParams.groupId || !customAlertIds) return null

  return (
    <div className="favorite-btn">
      <Popconfirm
        action={
          <IconButton
            type="button"
            variant="ghostInactive"
            className="hiding-btn"
            icon={<Trash size={size} />}
            size={size}
            sx={{
              p: 0,

              ...sx,
            }}
            // onClick={handleAddFavorite}
          />
        }
        title={`Are you sure you want to remove this trader from ${
          customAlertIds?.length <= 1 ? 'bookmark' : 'this group'
        }?`}
        onConfirm={() => {
          if (customAlertIds?.length <= 1) {
            unsetTraderFavorite({ address, protocol })
          } else {
            setTraderFavorite({
              address,
              protocol,
              isEdit: true,
              customAlertIds: customAlertIds.filter((id) => id !== searchParams.groupId),
            })
          }
        }}
        confirmButtonProps={{ variant: 'ghostDanger' }}
      />
    </div>
  )
}

import requester from 'apis'

import { FavoritedTrader } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'

const SERVICE = 'favorites'

export async function getFavoritesByProtocolApi(protocol: ProtocolEnum): Promise<FavoritedTrader[]> {
  return requester
    .get(`${protocol}/${SERVICE}/page`, {
      params: {
        limit: 100,
        offset: 0,
      },
    })
    .then((res: any) => res.data?.data as FavoritedTrader[])
}

export async function getAllFavoritesApi(): Promise<FavoritedTrader[]> {
  return requester.get(`${SERVICE}/list`).then((res: any) => res.data as FavoritedTrader[])
}

export async function postFavoritesApi({
  protocol,
  account,
  note,
  customAlertIds,
}: {
  protocol: ProtocolEnum
  account: string
  note?: string
  customAlertIds?: string[]
}) {
  return requester
    .post(SERVICE, { note, account, protocol, customAlertIds })
    .then((res: any) => res.data?.data as FavoritedTrader)
}

export async function putFavoritesApi({
  protocol,
  account,
  note,
  customAlertIds,
}: {
  protocol: ProtocolEnum
  account: string
  note?: string
  customAlertIds?: string[]
}) {
  return requester
    .put(SERVICE, { note, account, protocol, customAlertIds })
    .then((res: any) => res.data?.data as FavoritedTrader)
}

export async function deleteFavoritesApi({ protocol, account }: { protocol: ProtocolEnum; account: string }) {
  return requester
    .delete(SERVICE, {
      data: {
        protocol,
        account,
      },
    })
    .then((res: any) => res.data)
}

export async function deleteFavoriteApi(id: string) {
  return requester.delete(`${SERVICE}/${id}`).then((res: any) => res.data)
}

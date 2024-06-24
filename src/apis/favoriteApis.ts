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
  return requester
    .get(`${SERVICE}/page`, {
      params: {
        limit: 1000,
        offset: 0,
      },
    })
    .then((res: any) => res.data?.data as FavoritedTrader[])
}

export async function postFavoritesApi({
  protocol,
  account,
  note,
}: {
  protocol: ProtocolEnum
  account: string
  note?: string
}) {
  return requester
    .post(`${protocol}/${SERVICE}/${account}`, { note })
    .then((res: any) => res.data?.data as FavoritedTrader)
}

export async function deleteFavoritesApi({ protocol, account }: { protocol: ProtocolEnum; account: string }) {
  return requester.delete(`${protocol}/${SERVICE}/${account}`, {}).then((res: any) => res.data)
}

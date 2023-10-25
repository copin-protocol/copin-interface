import { ImageData } from 'entities/image'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'

import requester from './index'

const SERVICE = 'storage'

export async function shareTraderApi({
  protocol,
  traderAddress,
  time,
  imageBlob,
}: {
  protocol: ProtocolEnum
  traderAddress: string
  time: TimeFrameEnum
  imageBlob: Blob
}) {
  const formData = new FormData()
  formData.append('image', imageBlob, `address_${traderAddress}_protocol${protocol}_time_${time}.png`)
  return requester
    .post(`${SERVICE}/share-trader/${protocol}/${traderAddress}/${time}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res: any) => res.data as ImageData)
}

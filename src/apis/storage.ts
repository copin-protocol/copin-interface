import { ImageData } from 'entities/image'
import { PositionData } from 'entities/trader'
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

export async function sharePositionApi({
  isOpening,
  position,
  imageBlob,
}: {
  isOpening: boolean
  position: PositionData
  imageBlob: Blob
}) {
  const formData = new FormData()
  if (isOpening) {
    formData.append(
      'image',
      imageBlob,
      `share_opening_${position.protocol}_${position.key}_${position.blockNumber}.png`
    )
    return requester
      .post(
        `${SERVICE}/share-position/opening/${position.protocol}/${position.key}/${position.blockNumber}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      .then((res: any) => res.data as ImageData)
  } else {
    formData.append('image', imageBlob, `share_closed_${position.protocol}_${position.id}.png`)
    return requester
      .post(`${SERVICE}/share-position/closed/${position.protocol}/${position.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res: any) => res.data as ImageData)
  }
}

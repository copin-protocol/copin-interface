import { configs } from './configs.js'
import { renderHTML } from './utils.js'
import apiRequest from "./apiRequest.js";

const getEventDetails = async (req, res) => {
  const { id } = req.params
  const isSlug = id?.includes('-')

  let eventDetails
  try {
    const result = await apiRequest.get(isSlug ? `/public/trading-event/slug?slug=${id}` : `/public/trading-event/${id}`)
    eventDetails = result?.data
  } catch {}

  const title = `${eventDetails?.title ?? 'On-chain Copy-Trading to share $50,000 & Merchs rewards'} | Copin Analyzer`
  const thumbnail = eventDetails?.thumbUrl ? `${configs.apiUrl}/storage${eventDetails?.thumbnailUrl}`: `${configs.baseUrl}/images/cover/default-event-details-cover.png?${new Date().getTime()}`
  const url = `${configs.baseUrl}/event/${id}`
  const description = eventDetails?.description ?? 'Participate in the competition to copy trades from 300K+ on-chain traders on 20+ perpetual DEXs for a chance to receive a total prize of up to $50K and merchs. The larger the copy volume, the higher your reward!'

  try {
    renderHTML({
      req,
      res,
      params: {
        title,
        thumbnail,
        description,
        url,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getEventDetails }

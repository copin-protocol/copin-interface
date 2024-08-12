import apiRequest from './apiRequest.js'
import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getEventDetails = async (req, res) => {
  const { id } = req.params
  const isSlug = id?.includes('-')

  let eventDetails
  try {
    eventDetails = await apiRequest.get(
      isSlug ? `/public/trading-event/slug?slug=${id}` : `/public/trading-event/${id}`
    )
  } catch {}

  const title = `${eventDetails?.title ?? 'Explore Exciting Crypto Events and Competitions on Copin | Copin Analyzer'}`
  const thumbnail = eventDetails?.thumbUrl
    ? `${configs.apiUrl}/storage${eventDetails?.thumbUrl}?${new Date().getTime()}`
    : `${configs.baseUrl}/images/cover/events-cover.png?${new Date().getTime()}`
  const url = `${configs.baseUrl}/event/${id}`
  const description =
    eventDetails?.description ??
    'Discover upcoming events now and join the Copin community to maximize your copy-trading journey!'

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

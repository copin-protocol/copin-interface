import { configs } from './configs.js'
import { generateProtocolName, renderHTML } from './utils.js'

const getTopOpenings = async (req, res) => {
  const { protocol } = req.params

  const thumbnail = `${configs.apiUrl}/storage/image/cover__top-opening-${protocol}-cover`

  const protocolName = generateProtocolName(protocol)

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Top Opening Positions on ${protocolName} | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/top-openings`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getTopOpenings }

import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getTopOpenings = async (req, res) => {
  const { protocol } = req.params

  const thumbnail = `${configs.baseUrl}/images/cover/top-opening-${protocol}-cover.png`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Top Opening Positions on ${protocol}`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/top-openings`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getTopOpenings }

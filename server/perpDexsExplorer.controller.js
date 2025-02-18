import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getPerpDexsExplorer = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__perp-explorer-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Perp Explorer | Copin Analyzer`,
        description: 'Compare top perpetual DEXs with 30+ metrics to find the best platform for your trading needs.',
        thumbnail,
        url: `${configs.baseUrl}/perp-explorer`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getPerpDexsExplorer }

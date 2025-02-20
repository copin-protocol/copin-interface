import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getReferralProgram = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__referral-program-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Copin Referral Program | Copin Analyzer`,
        description: `Earn rewards with Copin's Referral Program! Get 5% fee rebates on your trades and up to 45% commissions from F1 and F2 referrals. Start sharing and earning now!`,
        thumbnail,
        url: `${configs.baseUrl}/referral`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getReferralProgram }

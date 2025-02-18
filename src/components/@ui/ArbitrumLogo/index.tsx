import { Image } from 'theme/base'
import { parseChainImage } from 'utils/helpers/transform'

const ArbitrumLogo = ({ size = 32 }: { size?: number }) => {
  return <Image src={parseChainImage('ARB')} width={size} alt="arbitrum" />
}

export default ArbitrumLogo

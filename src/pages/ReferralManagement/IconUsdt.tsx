import { Image } from 'theme/base'
import { parseCollateralColorImage } from 'utils/helpers/transform'

export default function IconUsdt({ size = 20, sx }: { size?: number; sx?: any }) {
  return <Image src={parseCollateralColorImage('USDT')} width={`${size}px`} height={`${size}px`} sx={sx} />
}

import { Image } from 'theme/base'
import { parsePerpdexImage } from 'utils/helpers/transform'

export default function PerpDexLogo({ perpDex, size = 18 }: { perpDex: string; size?: number }) {
  return <Image src={parsePerpdexImage(perpDex.toUpperCase())} width={size} height={size} sx={{ flexShrink: '0' }} />
}

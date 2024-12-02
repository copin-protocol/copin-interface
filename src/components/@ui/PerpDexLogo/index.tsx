import { Image } from 'theme/base'

export default function PerpDexLogo({ perpDex, size = 18 }: { perpDex: string; size?: number }) {
  return (
    <Image src={`/images/perpDex/${perpDex.toUpperCase()}.png`} width={size} height={size} sx={{ flexShrink: '0' }} />
  )
}

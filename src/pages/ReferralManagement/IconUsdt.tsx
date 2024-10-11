import { Image } from 'theme/base'

export default function IconUsdt({ size = 20, sx }: { size?: number; sx?: any }) {
  return <Image src="/images/collaterals/USDT-color.png" width={`${size}px`} height={`${size}px`} sx={sx} />
}

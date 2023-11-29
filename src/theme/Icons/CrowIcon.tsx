import crowIconGold from 'assets/icons/crow-icon-gold.png'
import crowIconSilver from 'assets/icons/crow-icon-silver.png'
import { Image } from 'theme/base'

export function CrowIconGold({ size = 22 }: { size?: number }) {
  return <Image src={crowIconGold} width={size} height="auto" alt="crow" />
}
export function CrowIconSilver({ size = 22 }: { size?: number }) {
  return <Image src={crowIconSilver} width={size} height="auto" alt="crow" />
}

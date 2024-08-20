import { Flex, Image } from 'theme/base'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { parseRewardImage } from 'utils/helpers/transform'

export default function RewardWithSymbol({
  value,
  maxDigit,
  minDigit,
  size = 16,
  rewardSymbol,
  isCompact,
  sx,
}: {
  value?: number
  maxDigit?: number
  minDigit?: number
  size?: number
  rewardSymbol?: string
  isCompact?: boolean
  sx?: any
}) {
  const isUsd = !rewardSymbol || rewardSymbol === 'USD'
  if (!value) return <>--</>
  return (
    <Flex
      sx={{
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {`${isUsd ? '$' : ''}${isCompact ? compactNumber(value, maxDigit) : formatNumber(value, maxDigit, minDigit)}`}
      {!isUsd && <Image src={parseRewardImage(rewardSymbol)} sx={{ width: size, height: size }} alt={rewardSymbol} />}
    </Flex>
  )
}

import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const CheckWithRemoveIcon = ({ size = 24, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect width={size} height={size} rx="4" fill="#4EAEFD" />
      <path d="M4 8L12 8" stroke="#0B0E18" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )
}

export default CheckWithRemoveIcon

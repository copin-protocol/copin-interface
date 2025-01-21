import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

export default function VerticalArrow({
  width = 6,
  height = 40,
  ...props
}: { width?: number; variant?: 'Outline' | 'Bold' } & SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 6 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 40L5.88675 35L0.113247 35L3 40ZM2.5 -2.18557e-08L2.5 35.5L3.5 35.5L3.5 2.18557e-08L2.5 -2.18557e-08Z"
        fill="#777E90"
      />
    </Svg>
  )
}

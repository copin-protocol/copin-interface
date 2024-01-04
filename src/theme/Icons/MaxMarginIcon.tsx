import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const MaxMarginIcon = ({ size = 16, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M2 13H14V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M1.92188 12.7397L4.84033 7.311L6.85375 9.49924L10.5603 3.00269H14.0004"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0015 3L2 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 2"
      />
    </Svg>
  )
}

export default MaxMarginIcon

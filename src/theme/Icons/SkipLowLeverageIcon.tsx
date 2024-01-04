import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const SkipLowLeverageIcon = ({ size = 16, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M7.75 2.75H3C2.86193 2.75 2.75 2.97386 2.75 3.25V12.75C2.75 13.0261 2.86193 13.25 3 13.25H7.75C7.88807 13.25 8 13.0261 8 12.75V3.25C8 2.97386 7.88807 2.75 7.75 2.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6.85181H8.25C8.11193 6.85181 8 6.98821 8 7.15648V12.9453C8 13.1136 8.11193 13.25 8.25 13.25H13C13.1381 13.25 13.25 13.1136 13.25 12.9453V7.15648C13.25 6.98821 13.1381 6.85181 13 6.85181Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 8.5L12 11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8.5L9.5 11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M13.6377 2.75H3.1875"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 2"
      />
    </Svg>
  )
}

export default SkipLowLeverageIcon

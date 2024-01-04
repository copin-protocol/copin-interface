import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const MarginProtectionIcon = ({ size = 16, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M2.5 6.66667V3C2.5 2.86739 2.55268 2.74021 2.64645 2.64645C2.74021 2.55268 2.86739 2.5 3 2.5H13C13.1326 2.5 13.2598 2.55268 13.3536 2.64645C13.4473 2.74021 13.5 2.86739 13.5 3V6.66667C13.5 11.9176 9.04338 13.6573 8.15351 13.9523C8.05403 13.9866 7.94597 13.9866 7.84649 13.9523C6.95663 13.6573 2.5 11.9176 2.5 6.66667Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7.47534C9.51878 7.47534 10.75 6.80377 10.75 5.97534C10.75 5.14691 9.51878 4.47534 8 4.47534C6.48122 4.47534 5.25 5.14691 5.25 5.97534C5.25 6.80377 6.48122 7.47534 8 7.47534Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 5.97534V7.47534C5.25 8.30377 6.48122 8.97534 8 8.97534C9.51878 8.97534 10.75 8.30377 10.75 7.47534V5.97534"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 7.47534V8.97534C5.25 9.80377 6.48122 10.4753 8 10.4753C9.51878 10.4753 10.75 9.80377 10.75 8.97534V7.47534"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default MarginProtectionIcon

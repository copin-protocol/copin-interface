import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const SkipLowCollateralIcon = ({ size = 16, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M14 2.5C14 2.63261 13.9473 2.75979 13.8536 2.85355C13.7598 2.94732 13.6326 3 13.5 3H2.5C2.36739 3 2.24021 2.94732 2.14645 2.85355C2.05268 2.75979 2 2.63261 2 2.5C2 2.36739 2.05268 2.24021 2.14645 2.14645C2.24021 2.05268 2.36739 2 2.5 2H13.5C13.6326 2 13.7598 2.05268 13.8536 2.14645C13.9473 2.24021 14 2.36739 14 2.5ZM12 6C11.8674 6 11.7402 6.05268 11.6464 6.14645C11.5527 6.24021 11.5 6.36739 11.5 6.5V11.2931L5.35375 5.14625C5.25993 5.05243 5.13268 4.99972 5 4.99972C4.86732 4.99972 4.74007 5.05243 4.64625 5.14625C4.55243 5.24007 4.49972 5.36732 4.49972 5.5C4.49972 5.63268 4.55243 5.75993 4.64625 5.85375L10.7931 12H6C5.86739 12 5.74021 12.0527 5.64645 12.1464C5.55268 12.2402 5.5 12.3674 5.5 12.5C5.5 12.6326 5.55268 12.7598 5.64645 12.8536C5.74021 12.9473 5.86739 13 6 13H12C12.1326 13 12.2598 12.9473 12.3536 12.8536C12.4473 12.7598 12.5 12.6326 12.5 12.5V6.5C12.5 6.36739 12.4473 6.24021 12.3536 6.14645C12.2598 6.05268 12.1326 6 12 6Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export default SkipLowCollateralIcon
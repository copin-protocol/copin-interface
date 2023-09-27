import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const EthereumIcon = ({ size = 24, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M12.6667 24.5C19.2942 24.5 24.6667 19.1274 24.6667 12.5C24.6667 5.87258 19.2942 0.5 12.6667 0.5C6.03933 0.5 0.666748 5.87258 0.666748 12.5C0.666748 19.1274 6.03933 24.5 12.6667 24.5Z"
        fill="#627EEA"
      />
      <path d="M13.0403 3.5V10.1525L18.663 12.665L13.0403 3.5Z" fill="white" fillOpacity="0.602" />
      <path d="M13.0402 3.5L7.41675 12.665L13.0402 10.1525V3.5Z" fill="white" />
      <path d="M13.0403 16.9762V21.4964L18.6668 13.7122L13.0403 16.9762Z" fill="white" fillOpacity="0.602" />
      <path d="M13.0402 21.4964V16.9754L7.41675 13.7122L13.0402 21.4964Z" fill="white" />
      <path d="M13.0403 15.9298L18.663 12.6651L13.0403 10.1541V15.9298Z" fill="white" fillOpacity="0.2" />
      <path d="M7.41675 12.6651L13.0402 15.9298V10.1541L7.41675 12.6651Z" fill="white" fillOpacity="0.602" />
    </Svg>
  )
}

export default EthereumIcon

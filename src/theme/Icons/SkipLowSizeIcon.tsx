import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const SkipLowSizeIcon = ({ size = 16, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M16.5 5.5H26C26.2761 5.5 26.5 5.94772 26.5 6.5V25.5C26.5 26.0523 26.2761 26.5 26 26.5H16.5C16.2239 26.5 16 26.0523 16 25.5V6.5C16 5.94772 16.2239 5.5 16.5 5.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13.7036H15.5C15.7761 13.7036 16 13.9764 16 14.313V25.8906C16 26.2272 15.7761 26.5 15.5 26.5H6C5.72386 26.5 5.5 26.2272 5.5 25.8906V14.313C5.5 13.9764 5.72386 13.7036 6 13.7036Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.9004 5.5H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
      />
      <path
        d="M12.696 19.87L8.43031 17.2632C8.38744 17.237 8.33836 17.2227 8.28812 17.2217C8.23788 17.2208 8.1883 17.2332 8.14448 17.2578C8.10066 17.2824 8.06417 17.3182 8.03878 17.3616C8.01339 17.4049 8 17.4543 8 17.5045V22.7181C8 22.7684 8.01339 22.8177 8.03878 22.8611C8.06417 22.9044 8.10066 22.9402 8.14448 22.9648C8.1883 22.9894 8.23788 23.0019 8.28812 23.0009C8.33836 23 8.38744 22.9857 8.43031 22.9595L12.696 20.3527C12.7373 20.3274 12.7715 20.2919 12.7952 20.2497C12.8189 20.2074 12.8313 20.1598 12.8313 20.1113C12.8313 20.0629 12.8189 20.0152 12.7952 19.973C12.7715 19.9307 12.7373 19.8953 12.696 19.87V19.87Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SkipLowSizeIcon

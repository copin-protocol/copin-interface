import { Box, Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const HyperLiquidIcon = ({ size = 25, ...props }: { size?: number } & SvgProps) => {
  return (
    <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Svg {...props} width={size} height={size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12.7207" cy="12.3652" r="9.47461" fill="#777E90" />
        <path
          d="M18.8101 12.3206C18.8212 13.3652 18.6119 14.3633 18.2008 15.317C17.6137 16.675 16.2062 17.7854 14.9209 16.6034C13.8727 15.6401 13.6783 13.6844 12.1078 13.3981C10.0299 13.135 9.97985 15.6517 8.62234 15.936C7.10927 16.2572 6.60738 13.5992 6.62961 12.3921C6.65183 11.185 6.95926 9.48853 8.27417 9.48853C9.78724 9.48853 9.8891 11.8814 11.8096 11.7518C13.7116 11.6164 13.7449 9.12679 14.9876 8.06091C16.0599 7.14011 17.3211 7.81524 17.9526 8.92367C18.5379 9.94893 18.7953 11.1522 18.8082 12.3206H18.8101Z"
          fill="#1F2232"
        />
      </Svg>
    </Box>
  )
}

export default HyperLiquidIcon

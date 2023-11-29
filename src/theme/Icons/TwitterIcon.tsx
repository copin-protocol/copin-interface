import { Box, Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const TwitterIcon = ({
  size = 24,
  variant = 'Outline',
  ...props
}: { size?: number; variant?: 'Bold' | 'Outline' } & SvgProps) => {
  return (
    <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        {...props}
        width={size * 0.8125}
        height={(24 * size * 0.8125) / 29}
        viewBox="0 0 28 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6146 12.7681L0.5 0H8.51151L14.7552 7.89154L21.4256 0.0355317H25.8379L16.8886 10.588L27.5 24H19.5124L12.7518 15.4658L5.5341 23.9763H1.09787L10.6146 12.7681ZM20.6766 21.6343L5.41239 2.3657H7.34636L22.5914 21.6343H20.6766Z"
          fill="currentColor"
        />
      </Svg>
    </Box>
  )
}

export default TwitterIcon

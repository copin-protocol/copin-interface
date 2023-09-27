import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const CheckIcon = ({ size = 24, ...rest }: { size?: number } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M9.72686 18C9.4067 18 9.10255 17.8661 8.87844 17.6317L4.34817 12.8936C3.88394 12.4081 3.88394 11.6045 4.34817 11.1189C4.81241 10.6334 5.58079 10.6334 6.04502 11.1189L9.72686 14.9697L17.955 6.36414C18.4192 5.87862 19.1876 5.87862 19.6518 6.36414C20.1161 6.84967 20.1161 7.6533 19.6518 8.13882L10.5753 17.6317C10.3512 17.8661 10.047 18 9.72686 18Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export default CheckIcon

import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

export default function ArkhamIcon({
  width = 15,
  height = 15,
  ...props
}: { width?: number; variant?: 'Outline' | 'Bold' } & SvgProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 28 28" fill="none" {...props}>
      <circle cx="14" cy="14" r="13.5" stroke="#313856" />
      <path
        d="M16.4131 21.3418L14.002 23L7.00977 18.208V18.2041L7.93262 15.5225L16.4131 21.3418ZM24 16.1221L17.0137 20.9238L14.5986 19.2686L14.6006 19.2666L23.0752 13.4404L24 16.1221ZM16.4092 17.1992L13.998 18.8574L11.1758 16.9199L12.0928 14.2441L16.4092 17.1992ZM6.41504 17.7803L4 16.125L6.66602 8.35938V8.36133L9.64844 8.35742L6.41504 17.7803ZM19.8398 14.835V14.8389L17.0225 16.7725L14.6074 15.1191L18.916 12.1533L19.8398 14.835ZM12.2256 11.707L10.582 16.4961L8.16797 14.8408L9.24316 11.707H12.2256ZM22.8535 12.7656L20.4424 14.4238L17.1973 5.00391L20.1807 5H20.1816L22.8535 12.7656ZM18.6865 11.4834L16.2754 13.1416L14.623 8.35254H17.6094L18.6865 11.4834ZM14.8008 11.0342L9.4707 11.0381L10.3936 8.35645H13.8779L14.8008 11.0342ZM17.3789 7.68555L6.89648 7.69336L7.81543 5.01074L16.458 5.00391L17.3789 7.68555Z"
        fill="url(#paint0_linear_22010_47679)"
      />
      <defs>
        <linearGradient id="paint0_linear_22010_47679" x1="14" y1="5" x2="14" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DBDBDB" />
          <stop offset="1" stopColor="#989898" />
        </linearGradient>
      </defs>
    </Svg>
  )
}

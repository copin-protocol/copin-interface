import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

export default function DebankIcon({
  width = 17,
  height = 17,
  ...props
}: { width?: number; variant?: 'Outline' | 'Bold' } & SvgProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="13.5" stroke="#313856" />
      <path
        opacity="0.8"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.3694 19.2303C23.3694 22.1252 20.9875 24.4719 18.0493 24.4719H8V20.9775H18.0493C19.0286 20.9775 19.8227 20.1953 19.8227 19.2303C19.8227 18.2654 19.0286 17.4831 18.0493 17.4831H14.5025V13.9887H18.0493C19.0286 13.9887 19.8227 13.2065 19.8227 12.2416C19.8227 11.2766 19.0286 10.4944 18.0493 10.4944H8V7H18.0493C20.9875 7 23.3694 9.34673 23.3694 12.2416C23.3694 13.584 22.8572 14.8086 22.0148 15.7359C22.8572 16.6633 23.3694 17.8878 23.3694 19.2303Z"
        fill="#C7D2D4"
      />
      <path
        opacity="0.12"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00001 10.4944H16.6313C14.7979 8.37251 11.8789 7 8.59114 7C8.39271 7 8.1956 7.005 8.00001 7.01486V10.4944ZM18.4394 17.4831H15.0936V13.9887H18.4394C18.5712 14.5533 18.6404 15.1376 18.6404 15.7359C18.6404 16.3343 18.5712 16.9186 18.4394 17.4831ZM8 20.9775H16.6312C14.7979 23.0994 11.8789 24.4719 8.59113 24.4719C8.39269 24.4719 8.19559 24.4669 8 24.457V20.9775Z"
        fill="black"
      />
      <path
        d="M8 7C12.8971 7 16.867 10.9112 16.867 15.7359C16.867 20.5607 12.8971 24.4719 8 24.4719V20.9775C10.9383 20.9775 13.3202 18.6308 13.3202 15.7359C13.3202 12.8411 10.9383 10.4944 8 10.4944V7Z"
        fill="url(#paint0_linear_22010_47552)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_22010_47552"
          x1="12.4335"
          y1="7"
          x2="12.4335"
          y2="24.4719"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DBDBDB" />
          <stop offset="1" stopColor="#989898" />
        </linearGradient>
      </defs>
    </Svg>
  )
}

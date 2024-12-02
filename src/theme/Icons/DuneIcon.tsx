import React from 'react'

import { Svg } from 'theme/base'
import { SvgProps } from 'theme/types'

const DuneIcon = ({
  size = 24,
  variant = 'Outline',
  ...props
}: { size?: number; variant?: 'Outline' | 'Bold' } & SvgProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="7.9987" cy="8.00016" r="6.66667" fill="#C0C0C9" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.61084 11.9273C3.82335 13.5878 5.78496 14.6667 7.99855 14.6667C11.6248 14.6667 14.5748 11.7715 14.6632 8.1665L2.61084 11.9273Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export default DuneIcon

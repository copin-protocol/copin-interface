import { ComponentProps } from 'react'

import actionSuccess from 'assets/images/success-img.png'
import { Image } from 'theme/base'

export default function SuccessImage(props: ComponentProps<typeof Image>) {
  return <Image {...props} src={actionSuccess} />
}

import { ReactNode } from 'react'

export type UpgradeBenefitConfig = {
  title: ReactNode
  description: ReactNode
  modalMaxWidth?: number
  listBenefitConfig: {
    title: ReactNode
    description: ReactNode
    imageSrc: string
  }[]
}

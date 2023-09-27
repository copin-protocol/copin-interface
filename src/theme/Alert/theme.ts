import { variants } from './types'

export const styleVariants = {
  [variants.PRIMARY]: {
    color: 'primary2',
    borderColor: 'primary2',
  },
  [variants.INFO]: {
    color: 'neutral4',
    borderColor: 'neutral4',
  },
  [variants.WARNING]: {
    color: 'orange2',
    borderColor: 'orange2',
  },
  [variants.SUCCESS]: {
    color: 'green2',
    borderColor: 'green2',
  },
  [variants.DANGER]: {
    color: 'red2',
    borderColor: 'red2',
  },
  [variants.OUTLINE]: {
    color: 'neutral1',
    bg: 'transparent',
    border: 'normal',
    borderColor: 'transparent',
  },
  [variants.CARD]: {
    color: 'neutral2',
    bg: 'neutral5',
    border: 'none',
  },
}

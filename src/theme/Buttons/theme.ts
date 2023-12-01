import { sizes, variants } from './types'

export const styleVariants = {
  [variants.PRIMARY]: {
    color: 'neutral8',
    bg: 'primary1',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'primary2',
    },
    '&:before': {
      borderColor: 'rgba(0,0,0,0.2)',
      borderTopColor: 'neutral8',
    },
  },
  [variants.WHITE]: {
    color: 'neutral7',
    bg: 'neutral1',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'neutral2',
    },
  },
  [variants.INFO]: {
    color: 'neutral7',
    bg: 'neutral5',
    border: 'small',
    borderColor: 'neutral4',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'neutral4',
    },
  },
  [variants.WARNING]: {
    color: 'white',
    bg: 'warning1',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'warning2',
    },
  },
  [variants.SUCCESS]: {
    color: 'white',
    bg: 'success1',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'success2',
    },
  },
  [variants.DANGER]: {
    color: 'white',
    bg: 'red2',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'danger2',
    },
  },
  [variants.OUTLINE]: {
    color: 'neutral1',
    bg: 'transparent',
    border: 'small',
    borderColor: 'neutral3',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      borderColor: 'neutral1',
    },
  },

  [variants.OUTLINE_DANGER]: {
    color: 'red2',
    bg: 'transparent',
    border: 'small',
    borderColor: 'neutral3',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      borderColor: 'red2',
      color: 'red2',
    },
  },
  [variants.OUTLINE_PRIMARY]: {
    color: 'primary1',
    bg: 'transparent',
    border: 'small',
    borderColor: 'primary1',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      borderColor: 'primary2',
      color: 'primary2',
    },
  },
  [variants.OUTLINE_ACTIVE]: {
    color: 'neutral1',
    bg: 'transparent',
    border: 'small',
    borderColor: 'neutral3',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      borderColor: 'neutral2',
      color: 'neutral1',
    },
  },
  [variants.OUTLINE_INACTIVE]: {
    color: 'neutral2',
    bg: 'transparent',
    border: 'small',
    borderColor: 'neutral4',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      borderColor: 'neutral3',
      color: 'neutral2',
    },
  },
  [variants.GHOST]: {
    color: 'neutral1',
    bg: 'transparent',
    border: 'none',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      color: 'neutral2',
    },
  },
  [variants.GHOST_ACTIVE]: {
    color: 'neutral1',
    bg: 'transparent',
    border: 'none',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'neutral5',
      color: 'neutral1',
    },
  },
  [variants.GHOST_INACTIVE]: {
    color: 'neutral3',
    bg: 'transparent',
    border: 'none',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      bg: 'neutral5',
      color: 'neutral1',
    },
  },
  [variants.GHOST_PRIMARY]: {
    color: 'primary1',
    bg: 'transparent',
    border: 'none',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      color: 'primary2',
    },
  },
  [variants.GHOST_WARNING]: {
    color: 'orange1',
    bg: 'transparent',
    border: 'none',
    p: 0,
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      color: 'orange2',
    },
  },
  [variants.GHOST_SUCCESS]: {
    color: 'green1',
    bg: 'transparent',
    border: 'none',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      color: 'green2',
    },
  },
  [variants.GHOST_DANGER]: {
    color: 'red2',
    bg: 'transparent',
    border: 'none',
    '&:hover:not(:disabled),&:active:not(:disabled)': {
      color: 'red1',
    },
  },
}

export const sizeVariants = {
  [sizes.ICON]: {
    p: 1,
    borderRadius: '50%',
    lineHeight: 'calc(100% - 4px)',
  },
  [sizes.XS]: {
    px: '8px',
    py: '4px',
    fontSize: '14px',
    borderRadius: '24px',
  },
  [sizes.SM]: {
    px: '12px',
    py: 2,
  },
  [sizes.MD]: {
    px: 3,
    py: 3,
  },
  [sizes.LG]: {
    px: '12px',
    py: 3,
    lineHeight: '16px',
    fontSize: '16px',
  },
}

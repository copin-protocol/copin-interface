export const styleVariants = {
  ghost: {
    '& .select__control': {
      border: 'none',
      borderColor: 'transparent',
      borderRadius: 0,
      bg: 'transparent !important',
      color: 'neutral1',
      '& .select__value-container': {
        px: 2,
      },
      '&:hover:not([disabled]), &--is-hovered': {
        boxShadow: 'none',
        color: 'neutral2',
        '& .select__indicators': {
          color: 'primary1',
        },
      },
    },
  },
}

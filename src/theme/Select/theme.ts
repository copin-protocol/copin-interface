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
  outlinedSecondary: {
    '& .select__control': {
      minHeight: 'fit-content',
      bg: 'neutral7',
      borderColor: 'neutral4',
      '& .select__value-container': {
        px: 2,
        py: '5px',
        '& .select__single-value': {
          fontWeight: '600',
        },
      },
      '& .select__indicators': {
        pr: 2,
        color: 'neutral2',
        cursor: 'pointer',
        '& .select__indicator-separator': {
          bg: 'neutral6',
        },
      },
    },
  },
}

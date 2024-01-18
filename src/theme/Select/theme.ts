const ghostStyle = ({
  color,
  hoverColor,
  indicatorColor,
  indicatorHoverColor,
}: {
  color: string
  hoverColor: string
  indicatorColor: string
  indicatorHoverColor: string
}) => ({
  '& .select__control': {
    border: 'none',
    borderColor: 'transparent',
    borderRadius: 0,
    bg: 'transparent !important',
    color,
    '& .select__value-container': {
      px: 0,
    },
    '& .select__indicators': {
      color: indicatorColor,
    },
    '&:hover:not([disabled]), &--is-hovered': {
      boxShadow: 'none',
      color: hoverColor,
      '& .select__indicators': {
        color: indicatorHoverColor,
      },
    },
  },
})

export const styleVariants = {
  ghost: {
    ...ghostStyle({
      color: 'neutral1',
      hoverColor: 'neutral2',
      indicatorColor: 'neutral1',
      indicatorHoverColor: 'primary1',
    }),
  },
  ghostPrimary: {
    ...ghostStyle({
      color: 'primary1',
      hoverColor: 'primary2',
      indicatorColor: 'primary1',
      indicatorHoverColor: 'primary1',
    }),
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

// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { CaretDown, X } from '@phosphor-icons/react'
import css from '@styled-system/css'
import { CSSProperties } from 'react'
import ReactSelect, { ClearIndicatorProps, MultiValueRemoveProps, Props } from 'react-select'
import styled from 'styled-components/macro'
import { variant } from 'styled-system'

import { IconBox } from 'theme/base'
import { SxProps, VariantProps } from 'theme/types'
import { FONT_FAMILY } from 'utils/config/constants'

import { styleVariants } from './theme'

export type SelectProps = { error?: any; sx?: any; width?: number | string; height?: number } & VariantProps & SxProps

const StyledSelect = styled(ReactSelect)<SelectProps>(
  ({ error, width, height }) =>
    css({
      input: {
        fontSize: '16px !important',
      },
      border: 'none',
      width: width ?? '100%',

      '& .select__control': {
        minHeight: height ? 'auto' : 42,
        height: height ?? 'auto',
        alignItems: 'center',
        position: 'relative',
        border: 'small',
        borderColor: error ? 'red1' : 'neutral3',
        borderRadius: 'sm',
        bg: 'neutral5',
        '&:hover:not([disabled]), &--is-hovered': {
          bg: 'neutral7',
          borderColor: error ? 'red1' : 'neutral3',
          boxShadow: 'none',
        },
        '&:focus-within:not([disabled]), &--is-focused': {
          borderColor: 'neutral2',
          boxShadow: 'none',
        },
        '& .select__value-container': {
          pl: 12,
          pr: 12,
          py: '5px',
          color: 'inherit',
          cursor: 'pointer',
          fontFamily: `${FONT_FAMILY}`,
          fontSize: '13px',
          lineHeight: '20px !important',
          '& .select__input-container': {
            margin: '0',
            padding: '0',
            color: 'inherit',
          },
          '& .select__single-value': {
            color: 'inherit',
          },
        },

        '& .select__indicators': {
          color: 'neutral2',
          cursor: 'pointer',
          '& .select__indicator-separator': {
            bg: 'neutral6',
          },
        },
      },
      '&.pad-right-0': {
        '& .select__value-container': {
          pr: 0,
        },
        '& .select__indicators': {
          pr: 1,
        },
      },
      '& .select__control--is-disabled': {
        borderColor: 'neutral4',
        color: 'neutral3',
      },
      '& .select__menu-portal': {
        zIndex: 102,
      },
      '& .select__menu': {
        fontSize: 13,
        borderRadius: 'sm',
        border: 'small',
        borderColor: 'neutral4',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        mt: 1,
        p: 0,
        overflow: 'hidden',
        bg: 'neutral7',
        '&-list': {
          mr: '-1px',
          p: 0,
          borderRadius: 0,
          color: 'neutral2',
          overflow: 'hidden scroll',
          '& .select__option': {
            borderRadius: 0,
            py: 1,
            px: 2,
            cursor: 'pointer',
            '&--is-focused:not([disabled])': {
              bg: 'neutral5',
              // bg: '#23262F',
            },
            '&--is-selected:not([disabled])': {
              bg: 'neutral4',
              color: 'neutral1',
            },
          },
          '.select__option--is-disabled': {
            cursor: 'not-allowed',
            filter: 'grayscale(100%)',
            opacity: '0.5',
          },
        },
      },
      '& .select__multi-value': {
        width: 64,
        height: 26,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'neutral4',
        '.select__multi-value__label': {
          color: 'neutral1',
        },
        '.select__multi-value__remove': {
          color: 'neutral3',
          '&:hover': {
            color: 'neutral2',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    }),
  variant({ variants: styleVariants })
)

const DropdownIndicator = () => {
  return <CaretDown weight="bold" size={16} />
}
// const ClearIndicator = () =>
const ClearIndicator = (props: ClearIndicatorProps<any>) => {
  const {
    children = (
      <IconBox icon={<X size={16} />} sx={{ color: 'neutral2', bg: 'transparent', '&:hover': { color: 'neutral1' } }} />
    ),
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props
  return (
    <div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props) as CSSProperties}>
      <div style={{ padding: '0px' }}>{children}</div>
    </div>
  )
}

const MultiValueRemove = (props: MultiValueRemoveProps<any>) => {
  return (
    <IconBox
      icon={<X size={12} />}
      sx={{ p: 1, color: 'neutral2', bg: 'transparent', '&:hover': { color: 'neutral1' } }}
      {...props.innerProps}
    />
  )
}
const SelectStyles = {
  indicatorSeparator: () => ({ display: 'none' }),
  indicatorsContainer: (providedStyled: any) => ({ ...providedStyled, paddingRight: '16px' }),
  singleValue: (providedStyled: any) => ({ ...providedStyled, fontWeight: 400 }),
  multiValue: (providedStyled: any) => ({ ...providedStyled, fontWeight: 400, fontSize: '15px' }),
}

const Select = ({ components, ...props }: Omit<Props, 'theme'> & SelectProps) => {
  return (
    <StyledSelect
      isSearchable
      maxMenuHeight={250}
      noOptionsMessage={() => t`No Data Found`}
      className="select-container"
      classNamePrefix="select"
      styles={SelectStyles}
      components={{ DropdownIndicator, ClearIndicator, MultiValueRemove, ...(components || {}) }}
      {...props}
      // menuIsOpen
    />
  )
}

export default Select

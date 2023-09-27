// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { CaretDown } from '@phosphor-icons/react'
import css from '@styled-system/css'
import ReactSelect, { Props } from 'react-select'
import styled from 'styled-components/macro'
import { variant } from 'styled-system'

import { VariantProps } from 'theme/types'
import { FONT_FAMILY } from 'utils/config/constants'

import { styleVariants } from './theme'

export type SelectProps = { error?: any } & VariantProps

const StyledSelect = styled(ReactSelect)<SelectProps>(
  ({ error }) =>
    css({
      border: 'none',
      width: '100%',
      '& .select__control': {
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
          px: 3,
          py: '8px',
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
          color: 'neutral4',
          cursor: 'pointer',
          '& .select__indicator-separator': {
            bg: 'neutral6',
          },
        },
      },
      '& .select__control--is-disabled': {
        borderColor: 'neutral4',
        color: 'neutral3',
      },
      '& .select__menu-portal': {
        zIndex: 10,
      },
      '& .select__menu': {
        fontSize: 13,
        borderRadius: 'sm',
        border: 'small',
        borderColor: 'neutral4',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer !important',
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
            cursor: 'pointer !important',
            '&--is-focused:not([disabled])': {
              bg: 'neutral5',
              // bg: '#23262F',
            },
            '&--is-selected:not([disabled])': {
              bg: 'neutral4',
              color: 'neutral1',
            },
          },
        },
      },
    }),
  variant({ variants: styleVariants })
)

const SelectDropdownIndicator = () => {
  return <CaretDown weight="bold" size={16} />
}
const SelectStyles = {
  indicatorSeparator: () => ({ display: 'none' }),
  indicatorsContainer: (providedStyled: any) => ({ ...providedStyled, paddingRight: '16px' }),
  singleValue: (providedStyled: any) => ({ ...providedStyled, fontWeight: 400 }),
}

const Select = (props: Omit<Props, 'theme'> & SelectProps) => {
  return (
    <StyledSelect
      isSearchable
      maxMenuHeight={250}
      noOptionsMessage={() => t`No Data Found`}
      className="select-container"
      classNamePrefix="select"
      styles={SelectStyles}
      components={{ ...(props.components || {}), DropdownIndicator: SelectDropdownIndicator }}
      {...props}
      // menuIsOpen
    />
  )
}

export default Select

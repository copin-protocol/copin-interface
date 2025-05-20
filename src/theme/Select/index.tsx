// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { CaretDown, X } from '@phosphor-icons/react'
import css from '@styled-system/css'
import { CSSProperties } from 'react'
import ReactSelect, { ClearIndicatorProps, MultiValueRemoveProps, Props } from 'react-select'
import styled from 'styled-components/macro'
import { variant } from 'styled-system'

import { isIphone } from 'hooks/helpers/useIsIphone'
import { IconBox } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SxProps, VariantProps } from 'theme/types'
import { FONT_FAMILY } from 'utils/config/constants'

import { styleVariants } from './theme'

export type SelectProps = {
  error?: any
  sx?: any
  width?: number | string
  height?: number
  maxHeightSelectContainer?: string
  customClassName?: string
} & VariantProps &
  SxProps

const StyledSelect = styled(ReactSelect)<SelectProps>(
  ({ error, width, height, maxHeightSelectContainer }) =>
    css({
      input: {
        fontSize: '12px !important',
      },
      border: 'none',
      width: width ?? '100%',
      '&.no-disabled-style .select__option--is-disabled': {
        cursor: 'unset!important',
        filter: 'none!important',
        opacity: '1!important',
      },

      '& .select__control': {
        paddingLeft: '4px',
        minHeight: height ? 'auto' : 40,
        height: height ?? 'auto',
        alignItems: 'center',
        position: 'relative',
        border: 'small',
        borderColor: error ? 'red1' : 'neutral4',
        borderRadius: 'xs',
        bg: 'neutral7',
        maxHeight: maxHeightSelectContainer ?? 'none',
        overflow: 'auto',
        '&:hover:not([disabled]), &--is-hovered': {
          bg: 'neutral7',
          borderColor: error ? 'red1' : 'neutral4',
          boxShadow: 'none',
        },
        '&:focus-within:not([disabled]), &--is-focused': {
          borderColor: 'neutral4',
          boxShadow: 'none',
        },
        '& .select__value-container': {
          pl: '4px',
          pr: '4px',
          py: '4px',
          color: 'inherit',
          cursor: 'pointer',
          fontFamily: `${FONT_FAMILY}`,
          fontSize: '12px',

          lineHeight: '18px !important',
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
      '&.warning': {
        '& .select__multi-value': {
          backgroundColor: `${themeColors.red1}25`,
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
        fontSize: 12,
        borderRadius: 'xs',
        border: 'small',
        borderColor: 'neutral4',
        boxShadow: '1',
        cursor: 'pointer',
        mt: 1,
        p: 0,
        overflow: 'hidden auto',
        bg: 'neutral7',
        '&-list': {
          mr: '-1px',
          p: 0,
          borderRadius: 0,
          color: 'neutral2',
          '& .select__option': {
            borderRadius: 0,
            py: 2,
            px: 2,
            cursor: 'pointer',
            '&--is-focused:not([disabled])': {
              // color: 'primary1',
              bg: 'neutral5',
              // bg: '#23262F',
            },
            '&:active:not([disabled])': {
              // color: 'primary1',
              bg: 'neutral5',
              // bg: '#23262F',
            },
            '&--is-selected:not([disabled])': {
              color: 'primary1',
              bg: 'inherit',
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
        // minWidth: 64,
        height: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '24px',
        backgroundColor: 'neutral4',
        '.select__multi-value__label': {
          color: 'neutral1',
        },
        '.select__multi-value__remove': {
          color: 'neutral3',
          borderRadius: '24px',
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
  return <CaretDown size={12} />
}
// const ClearIndicator = () =>
const ClearIndicator = (props: ClearIndicatorProps<any>) => {
  const {
    children = (
      <IconBox icon={<X size={12} />} sx={{ color: 'neutral2', bg: 'transparent', '&:hover': { color: 'neutral1' } }} />
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
  indicatorsContainer: (providedStyled: any) => ({ ...providedStyled, paddingRight: '12px' }),
  singleValue: (providedStyled: any) => ({ ...providedStyled, fontWeight: 400 }),
  multiValue: (providedStyled: any) => ({ ...providedStyled, fontWeight: 400, fontSize: '15px' }),
}

const Select = ({
  components,
  maxHeightSelectContainer,
  customClassName,
  ...props
}: Omit<Props, 'theme'> & SelectProps & { maxHeightSelectContainer?: string }) => {
  return (
    <StyledSelect
      isSearchable
      maxMenuHeight={250}
      noOptionsMessage={() => t`No Data Found`}
      className={`select-container${customClassName ? ` ${customClassName}` : ''}`}
      classNamePrefix="select"
      styles={SelectStyles}
      components={{ DropdownIndicator, ClearIndicator, MultiValueRemove, ...(components || {}) }}
      {...props}
      maxHeightSelectContainer={maxHeightSelectContainer}
      onFocus={() => {
        if (window.visualViewport && isIphone) {
          window.visualViewport.addEventListener('resize', () => {
            document.body.style.height = `${window.visualViewport?.height}px`
            document.body.scrollIntoView({ behavior: 'smooth' })
          })
        }
      }}
      // menuIsOpen
    />
  )
}

export default Select

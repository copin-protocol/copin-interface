/* eslint-disable react/display-name */
import { Eye, EyeSlash, MagnifyingGlass, X } from '@phosphor-icons/react'
import css from '@styled-system/css'
import { ForwardedRef, TextareaHTMLAttributes, forwardRef, useState } from 'react'
import styled from 'styled-components/macro'
import { variant } from 'styled-system'

import { Button } from 'theme/Buttons'
import { Box, Flex, sx } from 'theme/base'
import { SxProps } from 'theme/types'

import { InputProps, InputSearchProps, InputWrapperProps, TextareaProps } from './types'

const ZOOM_INPUT_RATIO = 1.3333 // 16/12
const SCALE_INPUT_RATIO = 0.75 // 12/16

export const StyledInput = styled.input`
  background: transparent !important;
  padding: 0;
  border: none;
  font-size: 13px;
  line-height: 24px;
  width: 100%;

  @media screen and (max-width: 768px) {
    font-size: 16px;
    width: calc(100% * ${ZOOM_INPUT_RATIO});
    transform: scale(${SCALE_INPUT_RATIO});
    transform-origin: 0 50%;
    margin-right: -12.5%;
  }
`

const StyledTextarea = styled.textarea`
  background: transparent !important;
  padding: 0;
  border: none;
  width: 100%;
`

export const StyledPrefix = styled.div`
  padding-right: 16px;
  height: fit-content;
`

export const StyledSuffix = styled.div`
  padding-left: 8px;
  height: fit-content;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.neutral3};
`

export const InputWrapper = styled(Flex)<InputWrapperProps>(
  (props: InputWrapperProps) =>
    css({
      width: props.block ? '100%' : 'fit-content',
      alignItems: 'center',
      bg: 'neutral7',
      position: 'relative',
      border: props.border ?? 'small',
      borderColor: 'neutral4',
      borderRadius: 'xs',
      fontSize: 12,
      lineHeight: '24px',
      px: '12px',
      py: '7px',
      color: 'inherit',
      cursor: 'pointer',
      '&:focus-within:not([disabled])': {
        borderColor: 'neutral3',
        bg: 'neutral7',
      },
      '&:hover:not([disabled]),&:focus:not([disabled])': {
        borderColor: 'neutral3',
        bg: 'neutral7',
      },
      '&[disabled]': {
        bg: 'neutral7',
        borderColor: 'neutral5',
        color: 'neutral3',
        cursor: 'not-allowed',
      },
    }),
  variant({
    variants: {
      error: {
        borderColor: 'red1',
        '&:hover:not([disabled])': {
          borderColor: 'red1',
        },
        '&:focus-within:not([disabled])': {
          borderColor: 'red1',
        },
      },
    },
  }),
  sx
)

const Input = forwardRef(
  (
    { affix, suffix, border = 'small', block, sx, variant, error, ...props }: InputProps & SxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <InputWrapper
      disabled={props.disabled}
      variant={error ? 'error' : variant}
      block={block}
      sx={sx}
      border={border}
      onClick={({ target }: { target: HTMLDivElement }) => {
        if (target?.querySelector('input')) {
          target?.querySelector('input')?.focus()
        }
      }}
    >
      {!!affix && <StyledPrefix>{affix}</StyledPrefix>}
      <StyledInput {...props} ref={ref}></StyledInput>
      {!!suffix && <StyledSuffix>{suffix}</StyledSuffix>}
    </InputWrapper>
  )
)

export const Textarea = forwardRef(
  (
    { block, sx, variant, ...props }: TextareaProps & SxProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => (
    <InputWrapper
      disabled={props.disabled}
      variant={variant}
      block={block}
      sx={sx}
      onClick={({ target }: { target: HTMLDivElement }) => {
        if (target?.querySelector('input')) {
          target?.querySelector('input')?.focus()
        }
      }}
    >
      <StyledTextarea {...props} ref={ref}></StyledTextarea>
    </InputWrapper>
  )
)

export const InputPassword = forwardRef(
  (
    { sx, block, variant, allowShowPassword, ...props }: InputProps & SxProps & { allowShowPassword?: boolean },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [showing, show] = useState(allowShowPassword)
    return (
      <InputWrapper
        variant={variant}
        disabled={props.disabled}
        block={block}
        sx={sx}
        onClick={({ target }: { target: HTMLDivElement }) => {
          if (target?.querySelector('input')) {
            target?.querySelector('input')?.focus()
          }
        }}
      >
        <StyledInput {...props} type={showing ? 'text' : 'password'} ref={ref}></StyledInput>
        <Button
          type="button"
          variant="ghost"
          p={0}
          sx={{
            lineHeight: '20px',
            '&>svg': {
              verticalAlign: 'middle',
            },
            '&:hover, &:focus': {
              color: 'inherit !important',
            },
            color: 'neutral4',
          }}
          disabled={props.disabled && !allowShowPassword}
          onClick={() => show((showing) => !showing)}
        >
          {showing ? <EyeSlash weight="bold" size={16} /> : <Eye weight="bold" size={16} />}
        </Button>
      </InputWrapper>
    )
  }
)

export const InputSearch = forwardRef(
  (
    { sx, block, variant, iconSize = 20, onClear, ...props }: InputSearchProps & SxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <InputWrapper
        variant={variant}
        disabled={props.disabled}
        block={block}
        sx={{
          '& button.search-btn--clear': {
            visibility: 'hidden',
            transition: 'none',
          },
          ...(props.value
            ? {
                '& button.search-btn--clear': {
                  visibility: 'visible',
                },
              }
            : {}),
          ...sx,
        }}
        onClick={({ target }: { target: HTMLDivElement }) => {
          if (target?.querySelector('input')) {
            target?.querySelector('input')?.focus()
          }
        }}
      >
        <Box
          color="neutral3"
          sx={{
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <MagnifyingGlass size={iconSize} />
        </Box>
        <StyledInput {...props} ref={ref} style={{ marginLeft: 8 }} />
        <Button
          type="button"
          variant="ghost"
          color="neutral3"
          className="search-btn--clear"
          p={0}
          pl={3}
          sx={{
            flexShrink: 0,
            minWidth: '20px',
            height: '20px',
            '&>svg': {
              verticalAlign: 'middle',
            },
            color: 'neutral3',
            '&:hover, &:focus': {
              color: 'inherit !important',
            },
          }}
          onClick={onClear}
        >
          <X size={16} />
        </Button>
        {props.suffix ? props.suffix : null}
      </InputWrapper>
    )
  }
)

export default Input

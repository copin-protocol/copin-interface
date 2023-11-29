/* eslint-disable react/display-name */
import { CaretDown, CaretUp } from '@phosphor-icons/react'
import css, { SystemStyleObject } from '@styled-system/css'
import RcDropdown from 'rc-dropdown'
import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import styled from 'styled-components/macro'
import { GridProps, LayoutProps } from 'styled-system'

import { Button } from 'theme/Buttons'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { BoxProps, Colors } from 'theme/types'

type Direction = 'left' | 'right'

type DropdownProps = {
  visible?: boolean
  setVisible?: Dispatch<SetStateAction<boolean>>
  children: ReactNode
  menu: ReactNode
  upIcon?: ReactNode
  downIcon?: ReactNode
  menuSx?: any
  disabled?: boolean
  hasArrow?: boolean
  hoveringMode?: boolean
  dismissible?: boolean
  button?: any
  sx?: SystemStyleObject & GridProps
  buttonSx?: SystemStyleObject & GridProps
  buttonVariant?: string
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  handleScroll?: (e: any) => void
  onSubmit?: () => void
  onReset?: () => void
  iconColor?: keyof Colors
  menuPosition?: 'top' | 'bottom'
  iconSize?: number
  menuDismissible?: boolean
}
const ToggleButton = styled(Button)(({ sx }: { sx: SystemStyleObject & GridProps }) =>
  css({
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'inherit',
    // bg: 'transparent',
    // border: 'normal',
    border: 'small',
    borderColor: 'neutral4',
    color: 'neutral1',
    py: '6px',
    px: '14px',
    lineHeight: 'inherit',
    borderRadius: 'sm',
    '&:hover:not([disabled])': {
      borderColor: 'neutral3',
      color: 'neutral2',
    },
    '&[disabled]': {
      bg: 'transparent !important',
      borderColor: 'neutral2',
      color: 'neutral4',
      cursor: 'not-allowed',
    },
    ...sx,
  })
)

const Menu = styled(Box)<BoxProps>(({ sx }: BoxProps) =>
  css({
    minWidth: '120px',
    borderRadius: 'xs',
    bg: 'neutral7',
    boxShadow: 3,
    border: 'small',
    borderColor: 'neutral4',
    ...sx,
  })
)

const Dropdown: React.FC<LayoutProps & DropdownProps> = ({
  visible,
  setVisible,
  children,
  menu,
  disabled,
  hoveringMode = false,
  hasArrow = true,
  dismissible = true,
  handleScroll,
  placement,
  width,
  sx = {},
  menuSx = {},
  buttonSx = {},
  buttonVariant = 'outline',
  iconColor = 'neutral2',
  iconSize = 16,
  upIcon = <CaretUp weight="bold" size={iconSize} />,
  downIcon = <CaretDown weight="bold" size={iconSize} />,
  menuPosition = 'bottom',
  onSubmit,
  onReset,
  menuDismissible = false,
}) => {
  const [_showing, _show] = useState(false)
  const showing = visible ?? _showing
  const show = setVisible ?? _show

  return (
    <Box sx={sx}>
      <RcDropdown
        placement={placement}
        onOverlayClick={(e: any) => {
          e.stopPropagation()
          if (!dismissible) return
          show(false)
        }}
        onVisibleChange={!dismissible ? undefined : show}
        trigger={hoveringMode ? ['hover', 'click'] : ['click']}
        visible={showing}
        overlay={
          <Menu
            width={width}
            sx={{ ...(menuPosition === 'top' ? { bottom: '4px' } : { top: '4px' }), overflow: 'hidden', ...menuSx }}
            {...(!!handleScroll && { onScroll: handleScroll })}
          >
            <Box
              sx={
                menuSx?.maxHeight
                  ? {
                      margin: '-8px -8px -8px 0',
                      maxHeight: menuSx.maxHeight,
                      overflow: 'hidden scroll',
                    }
                  : {}
              }
            >
              {menuDismissible ? (
                <OutsideClickHandler onOutsideClick={() => show(false)}>{menu}</OutsideClickHandler>
              ) : (
                menu
              )}
            </Box>
            <Flex alignItems="center" justifyContent="end">
              {onReset && (
                <Button
                  mr={1}
                  variant="ghost"
                  onClick={() => {
                    onReset()
                    show(false)
                  }}
                >
                  <Type.Caption color="neutral1">Reset</Type.Caption>
                </Button>
              )}
              {onSubmit && (
                <Button
                  variant="ghostPrimary"
                  onClick={() => {
                    onSubmit()
                    show(false)
                  }}
                >
                  Apply
                </Button>
              )}
            </Flex>
          </Menu>
        }
      >
        <ToggleButton
          variant={buttonVariant}
          type="button"
          disabled={disabled}
          key={dismissible ? undefined : showing.toString()}
          onClick={() => {
            if (!dismissible && !showing) show(true)
          }}
          width={width}
          sx={{
            borderRadius: 'sm',
            ...buttonSx,
          }}
        >
          <Type.CaptionBold flex="1 1 auto" textAlign="left">
            {children}
          </Type.CaptionBold>
          {hasArrow && <IconBox color={iconColor} ml={1} icon={showing ? upIcon : downIcon} />}
        </ToggleButton>
      </RcDropdown>
    </Box>
  )
}

export const DropdownItem = styled(Button)<{ isActive?: boolean }>((props) =>
  css({
    maxWidth: '100%',
    height: 'auto',
    py: '6px',
    px: 12,
    width: '100%',
    textAlign: 'left',
    borderRadius: 0,
    border: 'none',
    fontWeight: 'normal',
    lineHeight: '24px',
    color: props.isActive ? 'primary1' : 'neutral1',
    bg: props.isActive ? 'neutral7' : 'transparent',
    '&:hover': {
      bg: 'neutral5',
    },
  })
)

export const CheckableDropdownItem = ({
  onClick,
  selected,
  text,
  iconSx,
  iconSize,
  textSx,
  disabled,
}: {
  onClick: any
  selected: boolean
  text: React.ReactNode
  iconSx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
  iconSize?: number
  disabled?: boolean
}) => {
  return (
    <DropdownItem disabled={disabled} onClick={onClick}>
      {/* <Flex alignItems="center" justifyContent="space-between"> */}
      <Box color={selected ? 'primary1' : 'neutral1'} sx={{ ...textSx }}>
        {text}
      </Box>
      {/* {selected && (
          <IconBox
            color="primary1"
            ml={2}
            sx={{ ...iconSx }}
            icon={<CheckCircle size={iconSize || 16} weight="bold" />}
          />
        )} */}
      {/* </Flex> */}
    </DropdownItem>
  )
}

export default Dropdown

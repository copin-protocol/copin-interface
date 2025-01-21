import { Trans } from '@lingui/macro'
import { ComponentType, Fragment, ReactNode, useCallback, useState } from 'react'

import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'

import UncontrolledInputSearch, { useUncontrolledInputSearchHandler } from '../UncontrolledInputSearch'

export default function SelectWithCheckbox<T>({
  options,
  value,
  onChangeValue,
  onToggleSelectAll,
  filterOptionsBySearchFn,
  optionItemKeyFn,
  optionItemSelectedFn,
  renderOptionLabel,
  disabled,
  isSelectedAll,
  menuSx,
  buttonSx,
  children,
  placement = 'bottomLeft',
  menuWrapperElement: Wrapper = Fragment,
  selectAllLabel,
  hasArrow = true,
  notMatchSearchMessage,
}: {
  options: T[]
  value: T[]
  onChangeValue: (value: T) => void
  onToggleSelectAll: (isSelectedAll: boolean) => void
  filterOptionsBySearchFn: (args: { searchText: string; option: T }) => boolean
  optionItemKeyFn: (option: T) => string
  optionItemSelectedFn: (option: T) => boolean
  renderOptionLabel: (option: T) => ReactNode
  menuWrapperElement?: ComponentType<any>
  isSelectedAll?: boolean // some case selected all value !== options.length
  disabled?: boolean
  menuSx?: any
  buttonSx?: any
  children: ReactNode
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  selectAllLabel?: ReactNode
  hasArrow?: boolean
  notMatchSearchMessage?: ReactNode
}) {
  const [searchText, setSearchText] = useState<string>('')

  const onChangeSearch = useCallback((searchText: string | undefined) => {
    setSearchText(searchText || '')
  }, [])
  const onClearSearch = useCallback(() => {
    setSearchText('')
  }, [])

  const { inputRef, showClearSearchButtonRef, handleChangeSearch, handleClearSearch } =
    useUncontrolledInputSearchHandler({ onChange: onChangeSearch, onClear: onClearSearch })

  const _options = options.filter((option) => filterOptionsBySearchFn({ option, searchText }))

  const _isSelectedAll = isSelectedAll ?? options.length === value.length

  return (
    <Dropdown
      menuSx={{
        width: [350, 400],
        height: 350,
        overflow: 'auto',
        p: 2,
        ...(menuSx ?? {}),
      }}
      dismissible={false}
      menuDismissible
      hasArrow={hasArrow}
      menu={
        <Wrapper>
          <Flex sx={{ gap: 1, alignItems: 'center' }}>
            <SwitchInput checked={_isSelectedAll} onChange={(e) => onToggleSelectAll(e.target.checked)} />

            <Type.CaptionBold color="neutral3">{selectAllLabel ?? <Trans>Select all</Trans>}</Type.CaptionBold>
          </Flex>
          <Divider my={2} />
          <UncontrolledInputSearch
            block
            inputRef={inputRef}
            showClearSearchButtonRef={showClearSearchButtonRef}
            onChange={handleChangeSearch}
            onClear={handleClearSearch}
          />
          {!!_options.length && (
            <>
              <Divider mt={2} />
              <Grid
                sx={{
                  gridTemplateColumns: '1fr 1fr',
                  columnGap: 3,
                  rowGap: 2,
                }}
              >
                {_options.map((option) => {
                  const key = optionItemKeyFn(option)
                  if (key == null) return <></>
                  const isChecked = optionItemSelectedFn(option)
                  return (
                    <Box py={2} key={key.toString()}>
                      <ControlledCheckbox
                        checked={isChecked}
                        label={renderOptionLabel(option)}
                        size={16}
                        onChange={() => onChangeValue(option)}
                      />
                    </Box>
                  )
                })}
              </Grid>
            </>
          )}
          {!!searchText && !_options?.length && <NoDataFound message={notMatchSearchMessage} />}
        </Wrapper>
      }
      buttonSx={{
        border: 'none',
        alignItems: 'start',
        '.icon_dropdown': { pt: '3px' },
        p: 0, // TODO: Button sx cannot modify this
        ...(buttonSx || {}),
      }}
      disabled={disabled}
      placement={placement}
    >
      {children}
    </Dropdown>
  )
}

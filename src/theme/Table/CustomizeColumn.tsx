import { Trans } from '@lingui/macro'
import { Gear } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GridProps } from 'styled-system'

import UncontrolledInputSearch, { useUncontrolledInputSearchHandler } from 'components/@widgets/UncontrolledInputSearch'
import { Button, ButtonVariant } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'

import { ColumnData } from './types'

function CustomizeColumn<T, K>({
  defaultColumns,
  currentColumnKeys,
  handleToggleColumn,
  onApply,
  onClear,
  menuSx = {},
  placement = 'topRight',
  disabledItemFn,
  buttonSx = {},
  buttonVariant = 'ghost',
  label,
  titleFactory,
  defaultKeys,
  hasLabels = true,
}: {
  defaultColumns: Partial<ColumnData<T, K>>[] // all column
  currentColumnKeys: (keyof T)[]
  defaultKeys?: (keyof T)[]
  onApply?: (keys: (keyof T)[]) => void
  onClear?: () => void
  handleToggleColumn?: (key: keyof T) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  disabledItemFn?: (key: keyof T | undefined) => boolean
  buttonSx?: any
  buttonVariant?: ButtonVariant
  label?: ReactNode
  hasLabels?: boolean
  titleFactory?: (columnData: Partial<ColumnData<T, K>>) => any
}) {
  const allColumns = useMemo(() => {
    return defaultColumns.filter((v) => !!v.key)
  }, [defaultColumns])
  const allKeys = useMemo(() => {
    return allColumns.map((v) => v.key as keyof T)
  }, [allColumns])
  const [selectedKeys, setKeys] = useState(currentColumnKeys)
  const allKeysString = [...allKeys].sort().join()
  const prevKeysString = [...currentColumnKeys].sort().join()
  const selectedKeysString = [...selectedKeys].sort().join()
  const defaultKeysString = defaultKeys ? [...defaultKeys].sort().join() : ''
  const prevKeysStringRef = useRef(prevKeysString)
  useEffect(() => {
    if (prevKeysString !== prevKeysStringRef.current) {
      setKeys(currentColumnKeys)
      prevKeysStringRef.current = prevKeysString
    }
  }, [prevKeysString])
  const disabledApply = prevKeysString === selectedKeysString
  const disabledClear = defaultKeysString === selectedKeysString
  const _handleToggleColumn = (key: keyof T) => {
    if (handleToggleColumn) {
      handleToggleColumn(key)
    } else {
      setKeys((prev) => {
        if (prev.includes(key)) {
          return prev.filter((v) => v !== key)
        } else {
          return [...prev, key]
        }
      })
    }
  }

  const [_defaultColumns, setColumns] = useState(allColumns)
  const onChangeSearch = useCallback(
    (searchText: string | undefined) => {
      setColumns(
        searchText
          ? allColumns.filter((v) => {
              let source: (string | string[])[] = []
              if (v.key) source.push(v.key.toString())
              if (v.searchText) source.push(v.searchText)
              if (!source.length) return false
              source = source.flat(1)
              return (source as string[]).some((sourceText) => {
                if (v.key) {
                  return sourceText.toUpperCase().includes(searchText.toUpperCase())
                } else if (v.searchText) {
                  return sourceText.includes(searchText.toUpperCase())
                }
                return false
              })
            })
          : allColumns
      )
    },
    [allColumns]
  )
  const onClearSearch = useCallback(() => {
    setColumns(allColumns)
  }, [allColumns])

  const { inputRef, showClearSearchButtonRef, handleChangeSearch, handleClearSearch } =
    useUncontrolledInputSearchHandler({ onChange: onChangeSearch, onClear: onClearSearch })

  const [visible, setVisible] = useState(false)
  const _handleApply = () => {
    onApply?.(selectedKeys)
    setVisible(false)
  }
  const _handleClear = () => {
    !!defaultKeys?.length && setKeys(defaultKeys)
    handleClearSearch()
    onClear?.()
  }
  const isChecked = allKeysString === selectedKeysString
  const hasClear = !isChecked && !!selectedKeys.filter((key) => !disabledItemFn?.(key)).length

  const _handleSelectAll = () => {
    if (!!hasClear || isChecked) {
      //@ts-ignore
      setKeys(allKeys.filter((key) => disabledItemFn?.(key)))
    } else {
      setKeys(allKeys)
    }
  }
  return (
    <Dropdown
      buttonVariant={buttonVariant}
      inline
      visible={visible}
      setVisible={setVisible}
      menuSx={{
        width: [250, 320],
        p: 2,
        height: [280, 376],
        '& > *': {
          height: '100%',
          '& > *': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        },
        '.item__wrapper': {
          flex: '1 0 0',
          overflow: 'auto',
        },
        ...menuSx,
      }}
      buttonSx={buttonSx}
      hasArrow={false}
      dismissible={false}
      menuDismissible
      menu={
        <>
          <Flex mb={2}>
            <UncontrolledInputSearch
              inputRef={inputRef}
              showClearSearchButtonRef={showClearSearchButtonRef}
              onChange={handleChangeSearch}
              onClear={handleClearSearch}
              placeHolder="SEARCH METRIC"
            />
          </Flex>
          <Box className="item__wrapper">
            {_defaultColumns
              .filter((v) => hasLabels || (v.key !== 'labels' && v.key !== 'ifLabels'))
              .map((item, index) => {
                const isDisable: boolean = disabledItemFn ? disabledItemFn(item.key) : index < 1
                const key = item.key
                if (key == null) return <></>
                const isChecked = selectedKeys.includes(key)
                return (
                  <Box py={1} key={key.toString()}>
                    <ControlledCheckbox
                      disabled={isDisable}
                      checked={isChecked}
                      label={titleFactory?.(item) ?? item.title}
                      // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                      size={16}
                      onChange={() => _handleToggleColumn(key)}
                    />
                  </Box>
                )
              })}
            {!_defaultColumns.length && (
              <Type.Caption color="neutral2" sx={{ textAlign: 'center', display: 'block', mt: 3 }}>
                <Trans>No Metric Match</Trans>
              </Type.Caption>
            )}
          </Box>
          {!!onApply && (
            <Flex
              sx={{
                bottom: 0,
                width: '100%',
                position: 'sticky',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'neutral7',
                borderTop: 'small',
                borderColor: 'neutral4',
                gap: 3,
                pt: 2,
                pr: 2,
                zIndex: 1000,
              }}
            >
              <Flex flex="1" alignItems={'center'} sx={{ gap: 1 }}>
                <Checkbox
                  hasClear={hasClear}
                  checked={isChecked}
                  onClick={_handleSelectAll}
                  wrapperSx={{ height: 'auto' }}
                >
                  <Type.Caption color="neutral1" mr={1}>
                    <Trans>Selected:</Trans>
                  </Type.Caption>
                  <Type.Caption color="neutral3">
                    {selectedKeys.length}/{allColumns.length}
                  </Type.Caption>
                </Checkbox>
              </Flex>
              <Button variant="ghost" onClick={_handleClear} sx={{ fontWeight: 400, p: 0 }} disabled={disabledClear}>
                Reset Default
              </Button>
              <Button
                variant="ghostPrimary"
                onClick={_handleApply}
                sx={{ fontWeight: 400, p: 0 }}
                disabled={disabledApply}
              >
                Apply
              </Button>
            </Flex>
          )}
        </>
      }
      sx={{ justifyContent: 'center', alignItems: 'center' }}
      placement={placement}
    >
      <Flex alignItems="center" sx={{ gap: 1 }}>
        <IconBox icon={<Gear size={16} />} />
        {!!label && label}
      </Flex>
    </Dropdown>
  )
}

export default CustomizeColumn

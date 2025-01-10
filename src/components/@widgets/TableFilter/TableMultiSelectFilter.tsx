import { Funnel } from '@phosphor-icons/react'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { Button } from 'theme/Buttons'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Flex, IconBox } from 'theme/base'

export type MultiSelectOption = { value: string; label: ReactNode }
type Props = {
  options: MultiSelectOption[]
  currentFilter: MultiSelectOption['value'][] | undefined
  onApply: (filter: MultiSelectOption['value'][] | undefined) => void
  onReset: () => void
}
type InnerProps = {
  options: MultiSelectOption[]
  currentFilter: MultiSelectOption['value'][] | undefined
  changeFilter: (filter: MultiSelectOption['value'][] | undefined) => void
}

export function TableMultiSelectFilterIcon(props: Props) {
  const hasFilter = !!props.currentFilter && props.currentFilter.length !== props.options.length

  const [_currentFilter, _changeFilter] = useState(props.currentFilter)

  const [visible, setVisible] = useState(false)
  const _onApply = () => {
    setVisible(false)
    props.onApply((_currentFilter?.length ?? 0) === props.options.length ? undefined : _currentFilter)
  }
  const _onReset = () => {
    setVisible(false)
    props.onReset()
  }

  const loaded = useRef(false)
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true
      return
    }
    _changeFilter(props.currentFilter)
  }, [props.currentFilter, visible])

  return (
    <Dropdown
      buttonVariant="ghostInactive"
      inline
      hasArrow={false}
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={setVisible}
      menu={
        <Flex sx={{ flexDirection: 'column', bg: 'neutral7', p: 2 }}>
          <Flex sx={{ flexDirection: 'column', gap: 12 }}>
            <TableCustomMultiSelectListItem
              options={props.options}
              currentFilter={_currentFilter}
              changeFilter={_changeFilter}
            />
          </Flex>
          <Flex
            mt={2}
            sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', '& *': { fontWeight: 400 } }}
          >
            <Button variant="ghost" onClick={_onReset} sx={{ p: 0 }}>
              Reset
            </Button>
            <Button variant="ghostPrimary" onClick={_onApply} sx={{ p: 0 }} disabled={!_currentFilter?.length}>
              Apply
            </Button>
          </Flex>
        </Flex>
      }
    >
      <IconBox
        icon={<Funnel size={16} weight={hasFilter ? 'fill' : 'regular'} />}
        sx={{
          transform: 'translateY(-1.5px)',
        }}
      />
    </Dropdown>
  )
}

export function TableCustomMultiSelectListItem({ options, currentFilter, changeFilter }: InnerProps) {
  const isSelectedAll = currentFilter?.length === options.length
  const handleToggleAll = () => {
    if (isSelectedAll) {
      changeFilter(undefined)
    } else {
      changeFilter(options.map((v) => v.value))
    }
  }
  const handleToggleItem = ({ value, isActive }: { value: string; isActive: boolean }) => {
    if (isActive) {
      changeFilter(currentFilter?.filter((v) => v !== value))
    } else {
      changeFilter([...(currentFilter ?? []), value])
    }
  }
  return (
    <>
      <ControlledCheckbox checked={isSelectedAll} label={'All'} onChange={handleToggleAll} />
      {options.map((config) => {
        const isActive = !!currentFilter?.includes(config.value)
        return (
          // <Flex
          //   role="button"
          //   key={`${config.label}`}
          //   sx={{
          //     width: '100%',
          //   }}
          //   onClick={() => changeFilter(config.value)}
          // >
          <ControlledCheckbox
            key={config.value}
            checked={isActive}
            label={config.label}
            onChange={() => handleToggleItem({ value: config.value, isActive })}
            wrapperSx={{ height: '16px' }}
          />
          // </Flex>
        )
      })}
    </>
  )
}

export function TableMultiSelectFilter(props: Props & { children: ReactNode }) {
  const hasFilter = !!props.currentFilter && props.currentFilter.length !== props.options.length

  const [_currentFilter, _changeFilter] = useState(props.currentFilter)

  const [visible, setVisible] = useState(false)
  const _onApply = () => {
    setVisible(false)
    props.onApply((_currentFilter?.length ?? 0) === props.options.length ? undefined : _currentFilter)
  }
  const _onReset = () => {
    setVisible(false)
    props.onReset()
  }

  const loaded = useRef(false)
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true
      return
    }
    _changeFilter(props.currentFilter)
  }, [props.currentFilter, visible])

  return (
    <Dropdown
      buttonSx={{ p: 0, border: 'none' }}
      hasArrow={false}
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={setVisible}
      menu={
        <Flex sx={{ flexDirection: 'column', bg: 'neutral7', p: 2 }}>
          <Flex sx={{ flexDirection: 'column', gap: 12 }}>
            <TableCustomMultiSelectListItem
              options={props.options}
              currentFilter={_currentFilter}
              changeFilter={_changeFilter}
            />
          </Flex>
          <Flex
            mt={2}
            sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', '& *': { fontWeight: 400 } }}
          >
            <Button variant="ghost" onClick={_onReset} sx={{ p: 0 }}>
              Reset
            </Button>
            <Button variant="ghostPrimary" onClick={_onApply} sx={{ p: 0 }} disabled={!_currentFilter?.length}>
              Apply
            </Button>
          </Flex>
        </Flex>
      }
    >
      {props.children}
    </Dropdown>
  )
}

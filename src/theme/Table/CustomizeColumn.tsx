import { Gear } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { ReactNode } from 'react'
import { GridProps } from 'styled-system'

import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box } from 'theme/base'

function CustomizeColumn<T, K>({
  defaultColumns,
  currentColumnKeys,
  handleToggleColumn,
  menuSx = {},
  placement = 'topRight',
}: {
  defaultColumns: { key: keyof T | undefined; title: ReactNode }[]
  currentColumnKeys: (keyof T)[]
  handleToggleColumn: (key: keyof T) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}) {
  return (
    <Dropdown
      menuSx={{
        width: 300,
        p: 2,
        ...menuSx,
      }}
      hasArrow={false}
      dismissible={false}
      menuDismissible
      menu={
        <>
          {defaultColumns.map((item, index) => {
            const isDisable: boolean = index < 1
            const key = item.key
            if (key == null) return <></>
            const isChecked = currentColumnKeys.includes(key)
            return (
              <Box py={1} key={key.toString()}>
                <ControlledCheckbox
                  disabled={isDisable}
                  checked={isChecked}
                  label={item.title}
                  // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                  size={16}
                  onChange={() => handleToggleColumn(key)}
                />
              </Box>
            )
          })}
        </>
      }
      sx={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
      buttonSx={{
        border: 'none',
        height: '100%',
        p: 0,
        lineHeight: 0,
        color: 'neutral3',
        '&:hover': {
          color: 'neutral2',
        },
      }}
      placement={placement}
    >
      <Gear size={18} />
    </Dropdown>
  )
}

export default CustomizeColumn

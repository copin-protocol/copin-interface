import { Gear } from '@phosphor-icons/react'

import { useTraderExplorerTableColumns } from 'hooks/store/useTraderCustomizeColumns'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'

import { tableSettings } from './configs'

const REQUIRED_FIELDS = ['account', 'pnl', 'avgRoi', 'winRate']

// TODO: @toanla use the same as perps explorer
const CustomizeColumn = ({ hasTitle, menuSx = {} }: { hasTitle?: boolean; menuSx?: any }) => {
  const { columnKeys: visibleColumns, setColumnKeys: setVisibleColumns } = useTraderExplorerTableColumns()
  const onChange = (index: number) => {
    const id = tableSettings[index].id
    if (id) {
      // setUserTraderList(new Set(userTraderList).add(tableSettings[index].id))
      setVisibleColumns(visibleColumns.includes(id) ? visibleColumns.filter((e) => e !== id) : [...visibleColumns, id])
    }
  }

  return (
    <Dropdown
      buttonVariant="ghost"
      menuPosition="top"
      inline
      menuSx={{
        width: 220,
        p: 2,
        maxHeight: 400,
        ...menuSx,
      }}
      hasArrow={false}
      dismissible={false}
      menuDismissible
      menu={
        <>
          {tableSettings.map((item, index) => {
            const isDisable = REQUIRED_FIELDS.includes(item.id)
            return (
              <Box mb={2} key={index} pt={index === 0 ? 2 : 0} sx={{ '.label *': { p: 0 } }}>
                <ControlledCheckbox
                  disabled={isDisable}
                  checked={visibleColumns.includes(item.id)}
                  label={item.label}
                  // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                  size={16}
                  onChange={() => onChange(index)}
                />
              </Box>
            )
          })}
        </>
      }
      sx={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
      placement="topRight"
    >
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <IconBox icon={<Gear size={18} />} color="neutral3" />
        {hasTitle && <Type.Caption>Customize Column</Type.Caption>}
      </Flex>
    </Dropdown>
  )
}

export default CustomizeColumn

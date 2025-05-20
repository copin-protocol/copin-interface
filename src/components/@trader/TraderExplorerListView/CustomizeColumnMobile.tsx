import { Gear } from '@phosphor-icons/react'

import { mobileTableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { useTraderExplorerListColumns } from 'hooks/store/useTraderCustomizeColumns'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox } from 'theme/base'

const REQUIRED_FIELDS = ['account', 'pnl', 'winRate']

//Note: using different component because local storage conflict
export default function CustomizeColumnMobile() {
  const { columnKeys, setColumnKeys } = useTraderExplorerListColumns()
  const { userPermission } = useExplorerPermission()
  const filteredTableSettings = mobileTableSettings.filter((item) => userPermission?.fieldsAllowed?.includes(item.id))
  const onChange = (key: string) => {
    setColumnKeys(columnKeys.includes(key) ? columnKeys.filter((e) => e !== key) : [...columnKeys, key])
  }

  return (
    <Dropdown
      menuPosition="top"
      menuSx={{ width: 220, p: 2, maxHeight: 400 }}
      hasArrow={false}
      dismissible={false}
      menuDismissible
      inline
      buttonVariant="ghost"
      menu={
        <>
          {filteredTableSettings.map((item, index) => {
            const isDisable = REQUIRED_FIELDS.includes(item.id)
            return (
              <Box mb={2} key={index}>
                <ControlledCheckbox
                  disabled={isDisable}
                  checked={columnKeys.includes(item.id)}
                  label={item.label}
                  // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                  size={16}
                  onChange={() => onChange(item.id)}
                />
              </Box>
            )
          })}
        </>
      }
      sx={{ justifyContent: 'center', alignItems: 'center' }}
      placement="topRight"
    >
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <IconBox icon={<Gear size={18} />} color="neutral3" />
      </Flex>
    </Dropdown>
  )
}

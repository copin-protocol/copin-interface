import { Gear } from '@phosphor-icons/react'

import { mobileTableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox } from 'theme/base'

import { useExplorerColumnsMobile } from './useExplorerColumnsMobile'

const REQUIRED_FIELDS = ['account', 'pnl', 'avgRoi', 'winRate']

//Note: using different component because local storage conflict
export default function CustomizeColumnMobile() {
  const { columnKeys, setColumnKeys } = useExplorerColumnsMobile()
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
      menu={
        <>
          {mobileTableSettings.map((item, index) => {
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
      sx={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
      buttonSx={{
        border: 'none',
        height: '100%',
        p: 0,
        color: 'neutral2',
        '&:hover:not([disabled])': {
          color: 'neutral1',
          svg: {
            color: 'neutral1',
          },
        },
      }}
      placement="topRight"
    >
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <IconBox icon={<Gear size={18} />} color="neutral3" />
      </Flex>
    </Dropdown>
  )
}

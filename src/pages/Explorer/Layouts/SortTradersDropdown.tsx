import { ArrowsDownUp } from '@phosphor-icons/react'
import { useState } from 'react'

import { TraderListSortProps, mobileTableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader'
import { Button } from 'theme/Buttons'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'

const DEFAULT_SORT: TraderListSortProps<TraderData> = { sortBy: 'pnl', sortType: SortTypeEnum.DESC }
export default function SortTradersDropdown({
  currentSort,
  changeCurrentSort,
}: {
  currentSort: TraderListSortProps<TraderData> | undefined
  changeCurrentSort: (sort: TraderListSortProps<TraderData> | undefined) => void
}) {
  const [tempSort, setTempSort] = useState(currentSort ?? DEFAULT_SORT)
  const [visible, setVisible] = useState(false)
  const onReset = () => {
    changeCurrentSort(DEFAULT_SORT)
    setTempSort(DEFAULT_SORT)
    setVisible(false)
  }
  const onApply = () => {
    changeCurrentSort(tempSort)
    setVisible(false)
  }
  return (
    <Dropdown
      visible={visible}
      setVisible={setVisible}
      hasArrow={false}
      dismissible={false}
      menuDismissible
      menu={
        <Box width={200}>
          <Box pt={2} sx={{ maxHeight: 280, overflow: 'auto' }}>
            <Box px={2}>
              <Type.Caption mb={2}>
                <IconBox as="span" color="neutral2" icon={<ArrowsDownUp size={20} />} /> Sort Type
              </Type.Caption>
              {Object.values(SortTypeEnum)
                .reverse()
                .map((type) => {
                  const isSelected = tempSort?.sortType === type
                  return (
                    <Box key={type} mb={2}>
                      <ControlledCheckbox
                        checked={isSelected}
                        onClick={() => setTempSort({ ...(tempSort || ({} as any)), sortType: type })}
                        label={SORT_TYPE_TEXT_MAPPING[type]}
                      />
                    </Box>
                  )
                })}
            </Box>
            <Box mt={12}>
              <Type.Caption color="neutral3" mb={2} px={2}>
                Stats
              </Type.Caption>
              <Box sx={{ px: 2 }}>
                {mobileTableSettings.map((setting) => {
                  if (!setting.sortBy) return null
                  const isSelected = tempSort?.sortBy === setting.sortBy
                  return (
                    <Box key={setting.sortBy} mb={2}>
                      <ControlledCheckbox
                        checked={isSelected}
                        //@ts-ignore
                        onClick={() => setTempSort({ ...(tempSort || ({} as any)), sortBy: setting.sortBy })}
                        label={setting.text}
                      />
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
          <Flex
            sx={{
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 2,
              width: '100%',
              '& > *': { flex: 1 },
              borderTop: 'small',
              borderTopColor: 'neutral4',
            }}
          >
            <Button variant="ghost" onClick={onReset} sx={{ fontWeight: 400, p: 0 }}>
              Reset Default
            </Button>
            <Button variant="ghostPrimary" onClick={onApply} sx={{ fontWeight: 400, p: 0 }}>
              Apply & Save
            </Button>
          </Flex>
        </Box>
      }
      buttonSx={{ border: 'none', px: 10, py: 0 }}
    >
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <IconBox icon={<ArrowsDownUp size={20} />} color="neutral2" />
      </Flex>
    </Dropdown>
  )
}

const SORT_TYPE_TEXT_MAPPING = {
  [SortTypeEnum.ASC]: 'Low-High',
  [SortTypeEnum.DESC]: 'High-Low',
}

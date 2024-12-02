import { ArrowsDownUp } from '@phosphor-icons/react'
import { useState } from 'react'

import { Button } from 'theme/Buttons'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'

export default function TableSortMobileButton<T, K>({
  currentSort,
  changeCurrentSort,
  tableColumnsData,
  defaultSort,
}: {
  currentSort: TableSortProps<T> | undefined
  changeCurrentSort: (sort: TableSortProps<T> | undefined) => void
  tableColumnsData: ColumnData<T, K>[]
  defaultSort: TableSortProps<T>
}) {
  const [tempSort, setTempSort] = useState(currentSort ?? defaultSort)
  const [visible, setVisible] = useState(false)
  const onReset = () => {
    changeCurrentSort(defaultSort)
    setTempSort(defaultSort)
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
                {tableColumnsData
                  .filter((_data) => !!_data.sortBy)
                  .map((setting) => {
                    const isSelected = tempSort?.sortBy === setting.sortBy
                    return (
                      <Box key={setting.sortBy as any} mb={2}>
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

import { useResponsive } from 'ahooks'

import { TraderData } from 'entities/trader.d'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { useTraderExplorerListColumns, useTraderExplorerTableColumns } from 'hooks/store/useTraderCustomizeColumns'
import CustomizeColumn from 'theme/Table/CustomizeColumn'
import { themeColors } from 'theme/colors'

import { tableSettings } from '../TraderExplorerTableView/configs'

export function CustomizeColumnWithState() {
  const { columnKeys: visibleColumns, setColumnKeys: setVisibleColumns } = useTraderExplorerTableColumns()
  const { columnKeys: visibleColumnsList, setColumnKeys: setVisibleColumnsList } = useTraderExplorerListColumns()
  const { md } = useResponsive()
  const { userPermission } = useExplorerPermission()
  const filteredTableSettings = tableSettings.filter((item) => userPermission?.fieldsAllowed?.includes(item.id))
  const preservedTableSettings = tableSettings.filter((item) => !userPermission?.fieldsAllowed?.includes(item.id))
  const preservedKeys = preservedTableSettings.map((item) => item.id)

  return (
    <CustomizeColumn
      key={filteredTableSettings.map((item) => item.id).join(',')}
      keys={(item) => item.id as keyof TraderData | undefined}
      defaultColumns={filteredTableSettings}
      currentColumnKeys={md ? (visibleColumns as (keyof TraderData)[]) : (visibleColumnsList as (keyof TraderData)[])}
      //@ts-ignore
      titleFactory={(item) => item.label ?? item.text}
      onApply={(keys) => {
        const newKeys = [...preservedKeys, ...keys]
        if (md) {
          setVisibleColumns(newKeys)
        } else {
          setVisibleColumnsList(newKeys)
        }
      }}
      disabledItemFn={(key) => !key || ['account', 'pnl', 'winRate'].includes(key)}
      label={''}
      isResetDefault={false}
      menuSx={{ width: [250, 280] }}
      iconColor={themeColors.neutral3}
    />
  )
}

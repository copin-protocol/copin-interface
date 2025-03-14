import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderVolumeCopy } from 'apis/copyTradeApis'
import CopyTradeModals from 'components/@copyTrade/CopyTradeModals'
import { CopyTradeWithCheckingData, LayoutType } from 'components/@copyTrade/types'
import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { getMaxVolumeCopy, useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { TableSortProps } from 'theme/Table/types'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { TraderCopyCountWarning } from '../TraderCopyCountWarning'
import SelectCopyTradeModifier from './SelectCopyTradeModifier'
import { CopyTable, ListCopyCEX } from './View'
import { ExternalResource, ListCopyTradeType } from './types'
import useListCopyTradeConfigs from './useListCopyTradeConfig'

export default function ListCopyTrade({
  expanded,
  type,
  copyTrades,
  isLoadingCopyTrades,
  onCloneCopyTradeSuccess,
  activeWallet,
  layoutType,
  listTraderAddresses,
  excludingColumnKeys,
  externalSource,
  tableBg,
}: {
  expanded?: boolean
  type: ListCopyTradeType
  copyTrades: CopyTradeData[] | undefined
  isLoadingCopyTrades: boolean
  activeWallet: CopyWalletData | null
  onCloneCopyTradeSuccess?: (address: string) => void
  layoutType?: LayoutType
  listTraderAddresses?: string[]
  excludingColumnKeys?: (keyof CopyTradeWithCheckingData)[]
  externalSource?: ExternalResource
  tableBg?: string
}) {
  const myProfile = useMyProfileStore((_s) => _s.myProfile)

  const { columns, isMutating, renderProps, copyTradeModalConfigs } = useListCopyTradeConfigs({
    type,
    isExpanded: expanded,
    excludingColumnKeys,
  })

  const { data: volumeCopies } = useQuery(
    [QUERY_KEYS.GET_TRADER_VOLUME_COPY, activeWallet?.id],
    () => getTraderVolumeCopy({ exchange: activeWallet?.exchange }),
    { enabled: !!activeWallet?.id }
  )

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyTradeWithCheckingData> | undefined>({
    sortBy: 'status',
    sortType: SortTypeEnum.ASC,
  })
  const changeCurrentSort = (sort: TableSortProps<CopyTradeWithCheckingData> | undefined) => {
    setCurrentSort(sort)
  }
  const systemVolumeLimit = useSystemConfigStore()
  const sortedData = useMemo(() => {
    let _sortedData: CopyTradeWithCheckingData[] | undefined = Array.isArray(copyTrades) ? [] : undefined
    if (copyTrades?.length) {
      _sortedData = [...copyTrades]
      if (_sortedData && _sortedData.length > 0 && !!currentSort) {
        _sortedData.sort((a, b) => {
          const x = a?.[currentSort.sortBy] as any
          const y = b?.[currentSort.sortBy] as any
          if (currentSort.sortType === SortTypeEnum.ASC) {
            return x < y ? -1 : x > y ? 1 : 0
          } else {
            return x < y ? 1 : x > y ? -1 : 0
          }
        })
      }
    }
    const isRef = !!activeWallet?.isReferral
    _sortedData = _sortedData?.map((_d) => ({
      ..._d,
      isRef,
      maxVolume: getMaxVolumeCopy({ plan: myProfile?.plan, isRef, volumeLimitData: systemVolumeLimit.volumeLimit }),
      copyVolume:
        volumeCopies?.find((_v) => _v.account === _d.account && _v.protocol === _d.protocol)?.totalVolume ?? 0,
      plan: myProfile?.plan,
    }))
    return _sortedData
  }, [activeWallet?.isReferral, copyTrades, currentSort, myProfile?.plan, systemVolumeLimit.volumeLimit, volumeCopies])

  const { sm } = useResponsive()

  return (
    <>
      <SelectCopyTradeModifier data={copyTrades} />
      <TraderCopyCountWarning allCopyTrades={copyTrades} traderAddresses={listTraderAddresses} />
      {(layoutType != null ? layoutType === 'GRID' : !sm) && (
        <ListCopyCEX sortedData={sortedData} isLoading={isLoadingCopyTrades} renderProps={renderProps} />
      )}
      {(layoutType != null ? layoutType === 'LIST' : sm) && (
        <CopyTable
          sortedData={sortedData}
          columns={columns}
          isLoading={isLoadingCopyTrades}
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          externalSource={externalSource}
          bg={tableBg}
        />
      )}
      <CopyTradeModals
        {...copyTradeModalConfigs}
        onCloneCopyTradeSuccess={(data) => {
          onCloneCopyTradeSuccess?.(data?.account ?? '')
        }}
        isUpdatingCopyTrade={isMutating}
      />
    </>
  )
}

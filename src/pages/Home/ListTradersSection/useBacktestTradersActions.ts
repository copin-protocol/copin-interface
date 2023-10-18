import { useMemo } from 'react'

import { ApiListResponse } from 'apis/api'
import { WarningType } from 'components/BacktestModal/WarningModal'
import { TraderData } from 'entities/trader'
import useBacktestWarningModal from 'hooks/store/useBacktestWarningModal'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'

export default function useBacktestTradersActions({
  tradersData,
  isLoading,
}: {
  tradersData: ApiListResponse<TraderData> | undefined
  isLoading: boolean
}) {
  const {
    getCommonData,
    currentHomeInstanceId,
    addTraderToHomeInstance,
    removeTraderFromHomeInstance,
    updateHomeInstance,
  } = useSelectBacktestTraders()
  const { openModal, dismissModal } = useBacktestWarningModal()
  const listTraderData = tradersData?.data ?? []
  const listAddress = listTraderData.map((trader) => trader.account)
  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  const listAddressSelected = currentHomeInstance?.tradersByIds ?? []
  const isSelectedAll = useMemo(() => {
    if (!currentHomeInstance || !listAddress.length || isLoading) return false
    return listAddress.every((address) => listAddressSelected.includes(address))
  }, [currentHomeInstance, listAddress, listAddressSelected])
  const handleSelectAll = (isSelectedAll: boolean) => {
    if (!listTraderData.length) return
    if (!isSelectedAll) {
      addTraderToHomeInstance(listTraderData)
    } else {
      if (
        listAddressSelected.length === listAddress.length &&
        listAddressSelected.every((address) => listAddress.includes(address)) &&
        !!currentHomeInstance?.isTested
      ) {
        openModal({
          type: WarningType.CLEAR_GROUP,
          confirmFunction: () => {
            removeTraderFromHomeInstance(listTraderData)
            dismissModal()
          },
        })
        return
      }
      removeTraderFromHomeInstance(listTraderData)
    }
  }

  const checkIsSelected = (data: TraderData) => {
    const isSelected = !!currentHomeInstance?.tradersByIds?.includes(data.account)
    return isSelected
  }
  const handleSelect = ({ isSelected, data }: { isSelected: boolean; data: TraderData }) => {
    if (isSelected) {
      if (currentHomeInstance?.isTested && !currentHomeInstance?.isShowedWarningDeleteTrader) {
        openModal({
          type: WarningType.REMOVE_TRADER,
          confirmFunction: () => {
            updateHomeInstance({ homeId: currentHomeInstance.id ?? '', data: { isShowedWarningDeleteTrader: true } })
            removeTraderFromHomeInstance(data)
            dismissModal()
          },
        })
        return
      }
      if (currentHomeInstance?.tradersByIds.length === 0 && currentHomeInstance?.isTested) {
        openModal({
          type: WarningType.REMOVE_LAST_TRADER,
          confirmFunction: () => {
            removeTraderFromHomeInstance(data)
            dismissModal()
          },
        })
        return
      }
      removeTraderFromHomeInstance(data)
      return
    }
    addTraderToHomeInstance(data)
  }
  return { isSelectedAll, handleSelectAll, checkIsSelected, handleSelect }
}

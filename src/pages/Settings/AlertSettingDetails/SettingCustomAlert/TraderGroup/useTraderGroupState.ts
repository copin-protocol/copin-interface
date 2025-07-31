import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { ApiListResponse } from 'apis/api'
import { TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { AlertCustomType } from 'utils/config/enums'
import { getPaginationDataFromList, goToPreviousPage } from 'utils/helpers/transform'

import { CustomAlertFormValues } from '../types'
import { traderGroupReducer } from './reducer'

interface UseTraderGroupStateProps {
  customType: AlertCustomType
  defaultValues?: CustomAlertFormValues
  groupTraders?: ApiListResponse<TraderAlertData>
  onApply: (filters: CustomAlertFormValues) => void
  setMatchingTraderCount: (value: number) => void
}

/**
 * Custom hook for managing TraderGroup state and operations
 */
export const useTraderGroupState = ({
  customType,
  defaultValues,
  groupTraders,
  onApply,
  setMatchingTraderCount,
}: UseTraderGroupStateProps) => {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const protocolOptionsMapping = useGetProtocolOptionsMapping()

  // Use reducer for trader group state management
  const [state, dispatch] = useReducer(traderGroupReducer, {
    name: defaultValues?.name,
    description: defaultValues?.description,
    traderGroupAdd: defaultValues?.traderGroupAdd,
    traderGroupUpdate: defaultValues?.traderGroupUpdate,
    traderGroupRemove: defaultValues?.traderGroupRemove,
  })

  const { name, description, traderGroupAdd, traderGroupUpdate, traderGroupRemove } = state

  useEffect(() => {
    setCurrentPage(1)
  }, [searchText])

  // Check if there are unsaved changes
  const hasChange = useMemo(() => {
    return (
      !isEqual(defaultValues?.name, name) ||
      !isEqual(defaultValues?.description, description) ||
      !isEqual(defaultValues?.traderGroupAdd, traderGroupAdd) ||
      !isEqual(defaultValues?.traderGroupUpdate, traderGroupUpdate) ||
      !isEqual(defaultValues?.traderGroupRemove, traderGroupRemove)
    )
  }, [
    defaultValues?.name,
    defaultValues?.description,
    defaultValues?.traderGroupAdd,
    defaultValues?.traderGroupRemove,
    defaultValues?.traderGroupUpdate,
    name,
    description,
    traderGroupAdd,
    traderGroupRemove,
    traderGroupUpdate,
  ])

  // Parse and process traders - combines groupTraders with added/removed/updated traders
  const parsedTraders = useMemo(() => {
    const base = [...(traderGroupAdd ?? []), ...(groupTraders?.data ?? [])]
    const filtered = base.filter(
      (e) => !traderGroupRemove?.some((v) => v.address === e.address && v.protocol === e.protocol)
    )
    const updated = filtered
      .map((item) => {
        const updatedItem = traderGroupUpdate?.find((u) => u.address === item.address && u.protocol === item.protocol)
        return updatedItem ? { ...item, enableAlert: updatedItem.enableAlert } : item
      })
      .sort((x, y) =>
        x.createdAt && y.createdAt ? (x.createdAt < y.createdAt ? 1 : x.createdAt > y.createdAt ? -1 : 0) : 0
      )
    return {
      data: updated,
      meta: {
        ...groupTraders?.meta,
      },
    } as ApiListResponse<TraderAlertData>
  }, [groupTraders?.data, groupTraders?.meta, traderGroupAdd, traderGroupRemove, traderGroupUpdate])

  const totalTrader = parsedTraders?.data?.length ?? 0
  const totalActiveTrader = parsedTraders?.data?.filter((e) => e.enableAlert)?.length ?? 0

  // Filter traders based on search text
  const filteredTraders = useMemo(() => {
    if (!searchText.trim()) return parsedTraders.data

    const searchLower = searchText.toLowerCase()
    return parsedTraders.data.filter(
      (e) =>
        e?.address?.toLowerCase().includes(searchLower) ||
        e?.protocol?.toLowerCase().includes(searchLower) ||
        protocolOptionsMapping[e.protocol]?.text?.toLowerCase().includes(searchLower) ||
        protocolOptionsMapping[e.protocol]?.label?.toLowerCase().includes(searchLower)
    )
  }, [parsedTraders.data, protocolOptionsMapping, searchText])

  // Handle pagination separately from filtering for better performance
  const paginatedTraders = useMemo(() => {
    const limit = 10
    const pagination = getPaginationDataFromList({ currentPage, limit, data: filteredTraders })
    const start = (currentPage - 1) * limit

    return {
      data: filteredTraders.slice(start, start + limit),
      meta: pagination?.meta,
    } as ApiListResponse<TraderAlertData>
  }, [currentPage, filteredTraders])

  // Create list of traders to exclude from search
  const ignoreSelectTraders = useMemo(
    () =>
      parsedTraders?.data?.map((e) => ({
        account: e.address,
        protocol: e.protocol,
      })) ?? [],
    [parsedTraders?.data]
  )

  // Action handlers
  const onAddWatchlist = useCallback((data: TraderData) => {
    dispatch({ type: 'ADD_TRADER', payload: data })
    setCurrentPage(1)
  }, [])

  const onUpdateWatchlist = useCallback((data: TraderAlertData) => {
    dispatch({ type: 'UPDATE_TRADER', payload: data })
  }, [])

  const onRemoveWatchlist = useCallback(
    (data: TraderAlertData) => {
      dispatch({ type: 'REMOVE_TRADER', payload: data })
      goToPreviousPage({
        total: totalTrader,
        limit: 10,
        currentPage,
        changeCurrentPage: setCurrentPage,
      })
    },
    [currentPage, totalTrader]
  )

  const onChangeName = useCallback((value?: string) => {
    dispatch({ type: 'SET_NAME', payload: value })
  }, [])

  const onChangeDescription = useCallback((value?: string) => {
    dispatch({ type: 'SET_DESCRIPTION', payload: value })
  }, [])

  const handleApply = useCallback(
    (form?: CustomAlertFormValues) => {
      onApply({
        traderGroupAdd,
        traderGroupUpdate,
        traderGroupRemove,
        name: form?.name ?? name,
        description: form?.description ?? description,
        customType,
      })
      setMatchingTraderCount(totalActiveTrader)
    },
    [
      onApply,
      name,
      description,
      traderGroupAdd,
      traderGroupUpdate,
      traderGroupRemove,
      setMatchingTraderCount,
      totalTrader,
      totalActiveTrader,
    ]
  )

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET', payload: defaultValues })
    setCurrentPage(1)
  }, [defaultValues])

  return {
    // State
    name,
    description,
    traderGroupAdd,
    traderGroupUpdate,
    traderGroupRemove,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    hasChange,
    totalTrader,
    totalActiveTrader,
    filteredTraders,
    paginatedTraders,
    ignoreSelectTraders,

    // Actions
    onChangeName,
    onChangeDescription,
    onAddWatchlist,
    onUpdateWatchlist,
    onRemoveWatchlist,
    handleApply,
    handleReset,
  }
}

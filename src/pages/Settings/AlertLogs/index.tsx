import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getAlertLogsApi } from 'apis/alertLogApis'
import { AlertLogData } from 'entities/alertLog'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { PaginationWithLimit } from 'theme/Pagination'
import { TabHeader } from 'theme/Tab'
import { TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { AlertTypeEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, TOOLTIP_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import CopyTradeLogs from './CopyTradeLogs'
import CustomLogs from './CustomLogs'
import WatchlistLogs from './WatchlistLogs'
import { copyLogColumns, customLogColumns, watchlistLogColumns } from './configs'

type AlertTypeProps<T = AlertTypeEnum> = {
  id: T
  text: ReactNode
  value: T
}
export const ALERT_TYPE_OPTIONS: AlertTypeProps[] = [
  {
    id: AlertTypeEnum.COPY_TRADE,
    text: <Trans>COPIED</Trans>,
    value: AlertTypeEnum.COPY_TRADE,
  },
  {
    id: AlertTypeEnum.TRADERS,
    text: <Trans>WATCHLIST</Trans>,
    value: AlertTypeEnum.TRADERS,
  },
  {
    id: AlertTypeEnum.CUSTOM,
    text: <Trans>CUSTOM</Trans>,
    value: AlertTypeEnum.CUSTOM,
  },
]
export default function AlertLogsPage() {
  const { md } = useResponsive()
  const { myProfile } = useMyProfileStore()
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: 'page',
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })
  const defaultSort = useMemo(() => {
    const initSortBy: TableSortProps<AlertLogData>['sortBy'] = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    return { sortBy: initSortBy, sortType: initSortType }
  }, [])
  const [currentSort, setCurrentSort] = useState<TableSortProps<AlertLogData> | undefined>(defaultSort)
  const changeCurrentSort = (sort: TableSortProps<AlertLogData> | undefined) => {
    setCurrentSort(sort)
    changeCurrentPage(1)
  }
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'type',
    options: ALERT_TYPE_OPTIONS,
    defaultOption: ALERT_TYPE_OPTIONS[0].id,
    callback: () => {
      changeCurrentPage(1)
      changeCurrentSort(defaultSort)
    },
  })

  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_USER_ALERT_LOGS, myProfile?.id, currentOption?.id, currentPage, currentLimit, currentSort],
    () =>
      getAlertLogsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        alertType: currentOption?.id,
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    { keepPreviousData: true, retry: 0, enabled: !!myProfile?.id }
  )

  const { LogComponent, columns } = useMemo(() => {
    switch (currentOption?.id) {
      case AlertTypeEnum.TRADERS:
        return { LogComponent: WatchlistLogs, columns: watchlistLogColumns }
      case AlertTypeEnum.CUSTOM:
        return { LogComponent: CustomLogs, columns: customLogColumns }
      case AlertTypeEnum.COPY_TRADE:
      default:
        return { LogComponent: CopyTradeLogs, columns: copyLogColumns }
    }
  }, [currentOption])

  return (
    <Flex height="100%" flexDirection="column">
      <TabHeader
        configs={ALERT_TYPE_OPTIONS.map((e) => {
          return {
            name: e.text,
            key: e.id,
          }
        })}
        hasLine
        isActiveFn={(config) => config.key === currentOption?.id}
        onClickItem={(key) =>
          changeCurrentOption(ALERT_TYPE_OPTIONS.find((e) => e.id === key) ?? ALERT_TYPE_OPTIONS[0])
        }
        fullWidth
        size="md"
        itemSx={{
          width: !md ? '100%' : 100,
        }}
      />
      <Flex flex={1} flexDirection="column" sx={{ overflow: 'hidden' }}>
        <LogComponent
          data={data}
          isLoading={isFetching}
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          columns={columns}
        />
      </Flex>
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={changeCurrentPage}
        onLimitChange={changeCurrentLimit}
        apiMeta={data?.meta}
        sx={{ py: 1, borderTop: 'small', borderColor: 'neutral4' }}
      />
      <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}>
        <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
          Reverse Copy
        </Type.Caption>
      </Tooltip>
    </Flex>
  )
}

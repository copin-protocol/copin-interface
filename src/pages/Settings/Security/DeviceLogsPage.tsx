import { DeviceMobile, Laptop, Shield } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React from 'react'
import { useQuery } from 'react-query'

import { getLogsApi } from 'apis/logApis'
import SectionTitle from 'components/@ui/SectionTitle'
import { DeviceLog } from 'entities/deviceLog'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatLocalDate } from 'utils/helpers/format'
import { pageToOffset } from 'utils/helpers/transform'

const columns: ColumnData<DeviceLog>[] = [
  {
    title: 'Device Login',
    key: 'device' as keyof DeviceLog,
    style: { minWidth: '300px', width: '300px', textAlign: 'left' },
    render: (item: DeviceLog) => (
      <Flex alignItems="center" sx={{ gap: 2, width: 'fit-content', alignItems: 'start' }}>
        <IconBox
          icon={item.deviceType === 'MOBILE' ? <DeviceMobile size={20} /> : <Laptop size={20} />}
          color="neutral2"
        />
        <Type.Caption flex="1" color="neutral1">
          {item.name ? `${item.name} (${item.os})` : item.os}
        </Type.Caption>
      </Flex>
    ),
  },
  {
    title: 'Last Login',
    key: 'lastLogin' as keyof DeviceLog,
    style: { minWidth: '150px', textAlign: 'left' },
    render: (item: DeviceLog) => (
      <Type.Caption color="neutral1">{formatLocalDate(item.lastLogin, DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
    ),
  },
  {
    title: 'Location',
    key: 'location' as keyof DeviceLog,
    style: { minWidth: '150px', textAlign: 'left' },
    render: (item: DeviceLog) => <Type.Caption color="neutral1">{item.location}</Type.Caption>,
  },
  {
    title: 'IP Address',
    key: 'ip' as keyof DeviceLog,
    style: { minWidth: '100px', textAlign: 'right', pr: 2 },
    render: (item: DeviceLog) => <Type.Caption color="neutral1">{item.ip}</Type.Caption>,
  },
]

const List = ({
  data,
  columns,
  isLoading,
}: {
  data: DeviceLog[]
  columns: ColumnData<DeviceLog>[]
  isLoading: boolean
}) => {
  if (isLoading) return <Loading />
  return (
    <Flex flexDirection="column" sx={{ width: '100%', flex: 1 }}>
      {data.map((item, index) => (
        <Box
          key={item.id ?? index}
          sx={{ width: '100%', flex: 1, borderBottom: 'small', borderColor: 'neutral4', py: 12 }}
        >
          {columns.map((column) =>
            column.key === 'deviceType' ? (
              <Type.Caption key={column.key} color="neutral1">
                {column.render?.(item)}
              </Type.Caption>
            ) : (
              <Flex key={column.key} sx={{ gap: 2, py: 1, pl: 28 }}>
                <Type.Caption width={100} color="neutral3">
                  {column.title}
                </Type.Caption>
                <Type.Caption flex="1" color="neutral1">
                  {column.render?.(item)}
                </Type.Caption>
              </Flex>
            )
          )}
        </Box>
      ))}
    </Flex>
  )
}

const DeviceLogsPage: React.FC = () => {
  const { currentPage, currentLimit, setCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: 'logs-page',
    limitName: 'logs-limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const { profile } = useAuthContext()
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_DEVICE_LOGS, profile?.id, currentPage, currentLimit],
    () =>
      getLogsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
      }),
    {
      enabled: !!profile?.id,
    }
  )

  const { md } = useResponsive()

  return (
    <Flex flexDirection="column" sx={{ width: '100%', height: '100%' }}>
      <SectionTitle
        icon={Shield}
        title="SECURITY"
        sx={{ borderBottom: 'small', borderColor: 'neutral4', px: 3, py: 12, width: '100%', mb: 0 }}
      />
      <Flex
        flexDirection="column"
        sx={{
          width: '100%',
          flex: 1,
          maxWidth: '1200px',
          mx: 'auto',
          borderRight: 'small',
          borderLeft: 'small',
          borderColor: 'neutral4',
        }}
      >
        <Box px={3} py={3}>
          <Type.Body color="neutral1">DEVICE HISTORY</Type.Body>
        </Box>
        <Box px={3} flex="1 0 0">
          {md ? (
            <Table data={data?.data ?? []} columns={columns} isLoading={isLoading} restrictHeight={false} />
          ) : (
            <List data={data?.data ?? []} columns={columns} isLoading={isLoading} />
          )}
        </Box>
        <Box sx={{ backgroundColor: 'neutral7', px: 3, py: 2 }}>
          <PaginationWithLimit
            currentLimit={currentLimit}
            onLimitChange={changeCurrentLimit}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            apiMeta={data?.meta}
            sx={{ width: '100%', justifyContent: 'end' }}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

export default DeviceLogsPage

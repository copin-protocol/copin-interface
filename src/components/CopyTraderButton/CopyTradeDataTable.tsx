import { useMemo } from 'react'

import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import Table from 'components/@ui/Table'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyTradeData } from 'entities/copyTrade.d'
import { renderTrader } from 'pages/MyProfile/renderProps'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { overflowEllipsis } from 'utils/helpers/css'
import { getProtocolDropdownImage } from 'utils/helpers/transform'

export default function CopyTradeDataTable({
  isLoading,
  data,
  onPick,
}: {
  isLoading: boolean
  data: CopyTradeData[]
  onPick: (data: CopyTradeData) => void
}) {
  const columns = useMemo(() => {
    const result: ColumnData<CopyTradeData>[] = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '140px' },
        render: (item) => (
          <Type.Caption color="neutral1" maxWidth={140} sx={{ ...overflowEllipsis() }}>
            {item.title}
          </Type.Caption>
        ),
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '150px' },
        render: (item) =>
          item.multipleCopy
            ? item.accounts && (
                <>
                  <Flex data-tooltip-id={item.id} sx={{ alignItems: 'center', gap: 2 }}>
                    <AvatarGroup addresses={item.accounts} size={24} />
                    <Type.Caption color="neutral4">|</Type.Caption>
                    <Image
                      src={getProtocolDropdownImage({ protocol: item.protocol, isActive: true })}
                      width={16}
                      height={16}
                      sx={{ flexShrink: 0 }}
                    />
                  </Flex>
                  <Tooltip id={item.id} clickable>
                    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                      {item.accounts.map((_a) => {
                        return renderTrader(_a, item.protocol, {
                          isLink: false,
                          textSx: {
                            color: item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3',
                          },
                          sx: {
                            filter: item.status === CopyTradeStatusEnum.RUNNING ? 'none' : 'grayscale(1)',
                          },
                          hasCopyAddress: true,
                        })
                      })}
                    </Flex>
                  </Tooltip>
                </>
              )
            : renderTrader(item.account, item.protocol, {
                isLink: false,
                textSx: {
                  color: item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3',
                },
                sx: {
                  filter: item.status === CopyTradeStatusEnum.RUNNING ? 'none' : 'grayscale(1)',
                },
              }),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '100px' },
        render: (item) => (
          <Type.Caption color={item.status === CopyTradeStatusEnum.STOPPED ? 'red2' : 'green1'}>
            {item.status}
          </Type.Caption>
        ),
      },
    ]
    return result
  }, [])

  return data && data.length > 0 ? (
    <Box mt={2} height="min(680px,calc(90vh - 160px))">
      <Table
        restrictHeight
        rowSx={{
          borderBottom: '4px solid',
          borderColor: 'neutral5',
        }}
        data={data}
        columns={columns}
        isLoading={isLoading}
        renderRowBackground={() => themeColors.neutral6}
        onClickRow={(data) => onPick(data)}
      />
    </Box>
  ) : (
    <></>
  )
}

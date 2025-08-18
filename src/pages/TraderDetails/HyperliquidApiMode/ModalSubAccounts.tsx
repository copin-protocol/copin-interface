import { Trans } from '@lingui/macro'
import React, { useMemo } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { HlAccountData, HlAccountSpotData, HlSubAccountData, HlTokenMappingData } from 'entities/hyperliquid'
import useHyperliquidSubAccounts from 'hooks/features/trader/useHyperliquidSubAccounts'
import CopyButton from 'theme/Buttons/CopyButton'
import Modal from 'theme/Modal'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

export default function ModalSubAccounts({
  data,
  spotData,
  subData,
  spotTokens,
  onDismiss,
}: {
  data?: HlAccountData
  spotData?: HlAccountSpotData[]
  subData?: HlSubAccountData[]
  spotTokens?: HlTokenMappingData[]
  onDismiss: () => void
}) {
  const subAccounts = useHyperliquidSubAccounts({ data: subData, spotTokens })
  const columns = useMemo(() => {
    const result: ColumnData<HlSubAccountData>[] = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        style: { minWidth: '120px' },
        render: (item: HlSubAccountData) => {
          return <Type.Caption>{item.name}</Type.Caption>
        },
      },
      {
        title: 'Address',
        dataIndex: 'subAccountUser',
        key: 'subAccountUser',
        style: { minWidth: '165px' },
        render: (item: HlSubAccountData) => {
          return (
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <AccountInfo
                address={isAddress(item.subAccountUser)}
                protocol={ProtocolEnum.HYPERLIQUID}
                avatarSize={24}
                linkTarget="_blank"
              />
              <CopyButton
                type="button"
                variant="ghost"
                value={isAddress(item.subAccountUser)}
                size="sm"
                sx={{ color: 'neutral3', p: 0 }}
                iconSize={14}
              ></CopyButton>
            </Flex>
          )
        },
      },
      {
        title: 'Perps Equity',
        dataIndex: 'perpEquity',
        key: 'perpEquity',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: HlSubAccountData) => {
          return <Type.Caption>${formatNumber(Number(item.perpEquity), 0)}</Type.Caption>
        },
      },
      {
        title: 'Spot Equity',
        dataIndex: 'spotEquity',
        key: 'spotEquity',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: HlSubAccountData) => {
          return <Type.Caption>${formatNumber(Number(item.spotEquity), 0)}</Type.Caption>
        },
      },
    ]
    return result
  }, [])
  return (
    <Modal isOpen maxWidth="550px" title={<Trans>SUB-ACCOUNTS</Trans>} onDismiss={() => onDismiss()} hasClose>
      <Box height={420}>
        <Table
          restrictHeight={true}
          data={subAccounts}
          columns={columns}
          isLoading={false}
          tableBodySx={{ color: 'neutral1' }}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child': {
                pr: 3,
              },
              '& td:last-child': {
                pr: 3,
              },
            },
          }}
        />
      </Box>
    </Modal>
  )
}

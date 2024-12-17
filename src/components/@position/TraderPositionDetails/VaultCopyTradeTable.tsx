import { Trans } from '@lingui/macro'
import { useMemo } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { updateCopyTradeApi } from 'apis/copyTradeApis'
import TextWithEdit, { parseInputValue } from 'components/@ui/TextWithEdit'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData } from 'entities/copyTrade.d'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { Button } from 'theme/Buttons'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { QUERY_KEYS } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function VaultTradeDataTable({
  isLoading,
  submitting,
  data,
  onPick,
}: {
  isLoading: boolean
  submitting: boolean
  data: CopyTradeData[]
  onPick: (data: CopyTradeData) => void
}) {
  const refetchQueries = useRefetchQueries()
  const { mutate: updateCopyTrade } = useMutation(updateCopyTradeApi, {
    onSuccess: async (data) => {
      toast.success(<ToastBody title="Success" message="Your update has been succeeded" />)
      refetchQueries([QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS])
    },
    onError: (err) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(err)} />)
    },
  })

  const updateNumberValue = ({
    copyTradeId,
    oldData,
    value,
    field,
  }: {
    copyTradeId: string
    oldData: CopyTradeData
    value: string
    field: keyof CopyTradeData
  }) => {
    if (typeof value !== 'string') return
    const numberValue = parseInputValue(value)
    updateCopyTrade({
      copyTradeId,
      data: {
        account: oldData.account,
        accounts: oldData.accounts,
        multipleCopy: oldData.multipleCopy,
        [field]: numberValue,
      },
    })
  }
  const validateNumberValue = ({
    oldData,
    value,
    field,
  }: {
    oldData: CopyTradeData
    value: string
    field: keyof CopyTradeData
  }) => {
    if (typeof value !== 'string') return
    const numberValue = parseInputValue(value)
    switch (field) {
      case 'volume':
        // if (DCP_EXCHANGES.includes(oldData.exchange) && numberValue < 60) {
        //   toast.error(<ToastBody title="Error" message="DCP Volume must be greater than or equal to $60" />)
        //   return
        // }
        if (numberValue > 100000) {
          toast.error(<ToastBody title="Error" message="Volume must be less than $100,000" />)
          return
        }
        return true
      case 'leverage':
        if (numberValue < 2) {
          toast.error(<ToastBody title="Error" message="Leverage must be greater than or equal to 2" />)
          return
        }
        if (numberValue > 50) {
          toast.error(<ToastBody title="Error" message="Leverage must be less than 50x" />)
          return
        }
        return true
    }
    return numberValue >= 0
  }

  const columns = useMemo(() => {
    const result: ColumnData<CopyTradeData>[] = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '100px' },
        render: (item) => (
          <Type.Caption color="neutral1" maxWidth={140} sx={{ ...overflowEllipsis() }}>
            {item.title}
          </Type.Caption>
        ),
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '65px', textAlign: 'right' },
        render: (item) => (
          <Flex
            color={'neutral1'}
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Type.Caption>$</Type.Caption>
            <TextWithEdit
              key={`volume_${item.id}_${item.volume}`}
              defaultValue={item.volume}
              onSave={(value) => updateNumberValue({ copyTradeId: item.id, oldData: item, value, field: 'volume' })}
              onValidate={(value) => validateNumberValue({ oldData: item, value, field: 'volume' })}
            />
          </Flex>
        ),
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '70px', textAlign: 'right' },
        render: (item) => (
          <Flex color={'neutral1'} sx={{ alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <Type.Caption>x</Type.Caption>
            <TextWithEdit
              key={`leverage_${item.id}_${item.leverage}`}
              defaultValue={item.leverage}
              onSave={(value) => updateNumberValue({ copyTradeId: item.id, oldData: item, value, field: 'leverage' })}
              onValidate={(value) => validateNumberValue({ oldData: item, value, field: 'leverage' })}
            />
          </Flex>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '50px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="flex-end" pr={2}>
            <Button
              type="button"
              variant="ghostPrimary"
              p={0}
              disabled={submitting}
              isLoading={submitting}
              onClick={(e) => {
                e.stopPropagation()
                onPick(item)
              }}
            >
              <Trans>Open</Trans>
            </Button>
          </Flex>
        ),
      },
    ]
    return result
  }, [])

  return data && data.length > 0 ? (
    <Box height="min(280px,calc(80vh - 160px))">
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
      />
    </Box>
  ) : (
    <></>
  )
}

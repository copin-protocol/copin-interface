import { Trans } from '@lingui/macro'
import { useState } from 'react'

import useCheckCopyTradeExchange from 'hooks/features/copyTrade/useCheckCopyExchange'
import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import { useBulkUpdateCopyTrade } from 'hooks/features/copyTrade/useUpdateCopyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Button } from 'theme/Buttons'
import Label from 'theme/InputField/Label'
import Select from 'theme/Select'
import { Box, Flex } from 'theme/base'
import { BulkUpdateActionEnum, CopyTradePlatformEnum } from 'utils/config/enums'

import Wallets from '../CopyTradeForm/Wallets'
import { dcpExchangeOptions, exchangeOptions } from '../configs'
import ListSelectedCopyTrade from './ListSelectedCopyTrade'
import ResponseContent from './ResponseContent'

export default function CloneContent({ onDismiss, onSuccess }: { onDismiss: () => void; onSuccess: () => void }) {
  const { mutate, isLoading, data, isSuccess } = useBulkUpdateCopyTrade()
  const { copyWallets } = useCopyWalletContext()
  const { listCopyTrade } = useSelectCopyTrade()
  const defaultWallet = copyWallets?.find((w) => w.exchange !== listCopyTrade[0]?.exchange)
  const [exchange, setExchange] = useState(defaultWallet?.exchange ?? CopyTradePlatformEnum.HYPERLIQUID)
  const [walletId, setWalletId] = useState(defaultWallet?.id)
  const { disabledExchanges } = useCheckCopyTradeExchange()
  const handleConfirmClone = () => {
    if (!walletId) return
    mutate(
      {
        copyTradeIds: listCopyTrade.map((v) => v.id),
        action: BulkUpdateActionEnum.CLONE,
        cloneWalletId: walletId,
      },
      { onSuccess }
    )
  }
  if (isSuccess) {
    return <ResponseContent onComplete={onDismiss} responseData={data} />
  }
  const allExchangeOptions = [...exchangeOptions, ...dcpExchangeOptions].filter(
    (v) => !disabledExchanges.includes(v.value)
  )
  return (
    <Box px={1} pb={3}>
      <Box px={3}>
        <Label label="To Wallet" />
      </Box>
      <Flex mb={3} px={3} sx={{ gap: 2, alignItems: ['start', 'end'] }}>
        <Box flex={1} sx={{ '&& .select__menu': { zIndex: 10 } }}>
          <Select
            options={allExchangeOptions}
            defaultMenuIsOpen={false}
            value={allExchangeOptions.find((option) => option.value === exchange)}
            onChange={(newValue: any) => {
              setExchange(newValue.value)
            }}
            isSearchable
          />
        </Box>

        <Box flex={1}>
          <Wallets
            disabledSelect={false}
            platform={exchange}
            currentWalletId={walletId ?? ''}
            onChangeWallet={(walletId) => setWalletId(walletId)}
          />
        </Box>
      </Flex>
      <ListSelectedCopyTrade onDismiss={onDismiss} />
      <Box px={3} mt={24}>
        <Button
          variant="primary"
          block
          onClick={handleConfirmClone}
          disabled={!walletId || isLoading}
          isLoading={isLoading}
        >
          <Trans>Confirm</Trans>
        </Button>
      </Box>
    </Box>
  )
}

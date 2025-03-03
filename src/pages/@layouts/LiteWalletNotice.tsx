import { Trans } from '@lingui/macro'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, useLocation } from 'react-router-dom'

import { getLiteTransactionsApi } from 'apis/liteApis'
import actionSuccess from 'assets/images/success-img.png'
import { LITE_ACTION_STATUS, LITE_TRANSACTION_TYPE, LiteTransactionData } from 'entities/lite'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useLiteClickDepositFund from 'hooks/helpers/useLiteClickDepositFund'
import useSearchParams from 'hooks/router/useSearchParams'
import useGlobalDialog from 'hooks/store/useGlobalDialog'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useStoredCopyTrades } from 'hooks/store/useTraderCopying'
import AlertBanner from 'theme/Alert/AlertBanner'
import { Button } from 'theme/Buttons'
import { Box, Flex, Image, Type } from 'theme/base'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatNumber } from 'utils/helpers/format'

const getTransactionText = (type: LITE_TRANSACTION_TYPE) => {
  switch (type) {
    case LITE_TRANSACTION_TYPE.DEPOSIT:
      return 'Deposit'
    case LITE_TRANSACTION_TYPE.WITHDRAW:
      return 'Withdrawal'
    default:
      return 'Transaction'
  }
}

const LiteWalletNotice = () => {
  const { pathname } = useLocation()
  const { myProfile } = useMyProfileStore()
  const disabledRouting = pathname.match(ROUTES.LITE.path)
  const allCopyTrades = useStoredCopyTrades()
  const { embeddedWalletInfo, embeddedWallet } = useCopyWalletContext()
  const lastTransactionRef = useRef<LiteTransactionData | undefined>()
  const { showDialog, hideDialog } = useGlobalDialog()
  const maxMargin = allCopyTrades
    ? Math.max(
        ...allCopyTrades
          .filter((cp) => cp.copyWalletId === embeddedWallet?.id && cp.status === CopyTradeStatusEnum.RUNNING)
          .map((cp) => cp.volume)
      )
    : undefined
  const currentMargin = embeddedWalletInfo ? Number(embeddedWalletInfo.marginSummary.accountValue) : undefined

  const [disabledInterval, setDisabledInterval] = useState(false)
  const { data: transactions } = useQuery(
    [QUERY_KEYS.EMBEDDED_WALLET_TRANSACTIONS, 1, 1, myProfile?.id],
    () =>
      getLiteTransactionsApi({
        limit: 1,
        offset: 0,
      }),
    {
      keepPreviousData: false,
      retry: 0,
      refetchInterval: 15000,
      enabled: !!myProfile?.id,
    }
  )

  useEffect(() => {
    const latestTransaction = transactions?.data[0]
    if (
      !latestTransaction ||
      (lastTransactionRef.current == null &&
        [LITE_ACTION_STATUS.SUCCESSFUL, LITE_ACTION_STATUS.WITHDRAWN, LITE_ACTION_STATUS.FAILURE].includes(
          latestTransaction.status
        ))
    )
      return
    if (lastTransactionRef.current && lastTransactionRef.current.createdAt !== latestTransaction.createdAt) {
      lastTransactionRef.current = latestTransaction
      setDisabledInterval(false)
      return
    }
    if (disabledInterval) return
    if (![LITE_ACTION_STATUS.SUCCESSFUL, LITE_ACTION_STATUS.WITHDRAWN].includes(latestTransaction.status)) return
    lastTransactionRef.current = latestTransaction
    setDisabledInterval(true)
    document.visibilityState === 'visible' &&
      showDialog({
        id: 'TRANSACTION_SUCCESS',
        // title: 'Deposit Success',
        body: (
          <Flex flexDirection="column" justifyContent="center" alignItems="center" minWidth={350}>
            <Image src={actionSuccess} height={200} />
            <Type.BodyBold mb={3}>
              {getTransactionText(latestTransaction.type)} of {formatNumber(latestTransaction.data.amount, 2, 2)} USDC
              was successful!
            </Type.BodyBold>
            <Button variant="primary" onClick={() => hideDialog()}>
              Done
            </Button>
          </Flex>
        ),
      })
  }, [transactions, disabledInterval])

  const { searchParams, setSearchParams } = useSearchParams()
  const handleClickDeposit = useLiteClickDepositFund()

  useEffect(() => {
    if (searchParams?.[URL_PARAM_KEYS.LITE_FORCE_SHAKE_DEPOSIT]) {
      handleClickDeposit()
      setSearchParams({ [URL_PARAM_KEYS.LITE_FORCE_SHAKE_DEPOSIT]: null })
    }
  }, [handleClickDeposit, searchParams, searchParams?.[URL_PARAM_KEYS.LITE_FORCE_SHAKE_DEPOSIT], setSearchParams])

  return (
    <div>
      {maxMargin != null && currentMargin != null && maxMargin > currentMargin && (
        <AlertBanner
          id="deposit-alert"
          type="warning"
          message={<Trans>Insufficient balance to complete the copy transaction.</Trans>}
          action={
            disabledRouting ? (
              <Type.Caption
                color="primary1"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary2' }, transition: '0.3s' }}
                onClick={handleClickDeposit}
              >
                {DEPOSIT_TEXT}
              </Type.Caption>
            ) : (
              <Box
                as={Link}
                to={`${ROUTES.LITE.path}?wallet=deposit&tab=wallet`}
                target="_blank"
                sx={{ lineHeight: '16px' }}
              >
                <Type.Caption>{DEPOSIT_TEXT}</Type.Caption>
              </Box>
            )
          }
          sx={{
            borderBottom: 'small',
            borderColor: 'neutral4',
          }}
        />
      )}
    </div>
  )
}
const DEPOSIT_TEXT = <Trans>Go To Deposit</Trans>

export default LiteWalletNotice

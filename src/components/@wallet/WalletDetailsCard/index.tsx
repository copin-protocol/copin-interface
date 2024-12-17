// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { useState } from 'react'
import { EditText } from 'react-edit-text'
// eslint-disable-next-line no-restricted-imports
import 'react-edit-text/dist/index.css'

import TitleWithIcon from 'components/@ui/TilleWithIcon'
import ReferralStatus from 'components/@wallet/WalletReferralStatus'
import { CopyWalletData } from 'entities/copyWallet'
import useCheckHyperliquidBuilderFees from 'hooks/features/useCheckHyperliquidBuilderFees'
import useWalletFund from 'hooks/features/useWalletFundSnxV2'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SxProps } from 'theme/types'
import { CEX_EXCHANGES, WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { getColorFromText } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'

import FundModal, { FundTab } from '../SmartWalletFundModal'
import SmartWalletActions from './SmartWalletActions'
import UpdateWalletAction from './UpdateWalletAction'
import WalletActions from './WalletActions'
import WalletInfo from './WalletInfo'

interface WalletDetailsProps {
  data: CopyWalletData
  reload: () => void
  hasBorderTop?: boolean
  hiddenBalance?: boolean
  handleUpdate: (params: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => void
}

export const SmartWalletInfo = ({
  data,
  hiddenBalance,
  showFund = true,
  sx,
}: { data: CopyWalletData; hiddenBalance?: boolean; showFund?: boolean } & SxProps) => {
  const { total, available } = useWalletFund({
    address: data.smartWalletAddress,
    platform: data.exchange,
    totalIncluded: true,
  })
  return (
    <WalletInfo
      sx={sx}
      hiddenBalance={hiddenBalance}
      showFund={showFund}
      data={{
        ...data,
        balance: total?.num ?? 0,
        availableBalance: available?.num ?? 0,
      }}
    />
  )
}

export default function WalletDetailsCard({ data, handleUpdate, reload, hiddenBalance }: WalletDetailsProps) {
  const [isEdit, setIsEdit] = useState(false)
  const [walletName, setWalletName] = useState(parseWalletName(data))
  const [fundingModal, setFundingModal] = useState<FundTab | null>(null)

  const Info = data.smartWalletAddress ? SmartWalletInfo : WalletInfo

  const { isValidFees } = useCheckHyperliquidBuilderFees({
    enable: data.exchange === CopyTradePlatformEnum.HYPERLIQUID,
    apiKey: data?.hyperliquid?.apiKey,
  })

  return (
    <Flex p={3} sx={{ flexDirection: 'column', gap: 2 }}>
      <Flex sx={{ width: '100%', gap: 20, justifyContent: 'space-between' }}>
        <Flex alignItems="center" sx={{ flex: 1, flexWrap: 'wrap', gap: 2 }}>
          {CEX_EXCHANGES.includes(data.exchange) && <ReferralStatus data={data} />}
          <Flex width={250} alignItems="center" sx={{ gap: 2 }}>
            <TitleWithIcon
              color={getColorFromText(data.id)}
              title={
                <EditText
                  value={walletName}
                  showEditButton
                  editButtonContent={<PencilSimpleLine size={20} />}
                  editButtonProps={{ style: { backgroundColor: 'transparent', color: themeColors.primary1 } }}
                  placeholder={'Enter wallet name'}
                  style={{
                    margin: 0,
                    padding: '0px',
                    fontSize: '13px',
                    lineHeight: '25px',
                    backgroundColor: 'transparent',
                    borderColor: themeColors.neutral4,
                    borderWidth: '1px',
                    borderStyle: isEdit ? 'solid' : undefined,
                    minHeight: '25px',
                  }}
                  onChange={(e) => {
                    const value = e.target.value.trim()
                    if (value && value.length > WALLET_NAME_MAX_LENGTH) return
                    setWalletName(e.target.value)
                  }}
                  onSave={({ value, previousValue }) => {
                    const trimValue = value.trim()
                    if (!!trimValue) {
                      handleUpdate({
                        copyWalletId: data.id,
                        name: value.trim(),
                        previousValue,
                        callback: setWalletName,
                      })
                    } else {
                      setWalletName(previousValue)
                    }
                    setIsEdit(false)
                  }}
                  onBlur={() => setIsEdit(false)}
                  onEditMode={() => setIsEdit(true)}
                />
              }
            />
          </Flex>
          {/* <WalletKey walletKey={walletKey} isSmartWallet={isSmartWallet} /> */}
          <Info sx={{ display: ['none', 'flex'] }} data={data} hiddenBalance={hiddenBalance} />
        </Flex>
        {data.exchange === CopyTradePlatformEnum.HYPERLIQUID && !isValidFees && <UpdateWalletAction data={data} />}
        {!data.smartWalletAddress ? (
          <WalletActions data={data} />
        ) : (
          <Flex alignItems="center" sx={{ gap: 20 }}>
            <Button type="button" variant="ghostPrimary" sx={{ p: 0 }} onClick={() => setFundingModal(FundTab.Deposit)}>
              <Trans>Deposit</Trans>
            </Button>
            <SmartWalletActions data={data} setFundingModal={setFundingModal} />
            {fundingModal && (
              <FundModal
                smartWallet={data.smartWalletAddress}
                platform={data.exchange}
                onDismiss={() => setFundingModal(null)}
              />
            )}
          </Flex>
        )}
      </Flex>
      <Info sx={{ display: ['flex', 'none'] }} data={data} hiddenBalance={hiddenBalance} />
    </Flex>
  )
}

function BalanceStats({
  balance,
  sx,
  hiddenBalance,
}: {
  balance: number | undefined
  sx?: any
  hiddenBalance?: boolean
}) {
  return (
    <Box sx={{ gap: 2, flexShrink: 0, '& *': { flexShrink: 0 }, ...(sx || {}) }}>
      <Type.Caption color="neutral3">Balance:</Type.Caption>
      <Type.CaptionBold color="neutral1">
        {hiddenBalance ? '*****' : `$${formatNumber(balance, 0, 0)}`}
      </Type.CaptionBold>
    </Box>
  )
}

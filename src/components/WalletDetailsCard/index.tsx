import { PencilSimpleLine } from '@phosphor-icons/react'
import React, { useMemo, useState } from 'react'
import { EditText } from 'react-edit-text'
// eslint-disable-next-line no-restricted-imports
import 'react-edit-text/dist/index.css'

import ExplorerLogo from 'components/@ui/ExplorerLogo'
import TitleWithIcon from 'components/@ui/TilleWithIcon'
import { CopyWalletData } from 'entities/copyWallet'
import useChain from 'hooks/web3/useChain'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'
import { getColorFromText } from 'utils/helpers/css'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { getExchangeKey, parseWalletName } from 'utils/helpers/transform'

import ReferralStatus from './ReferralStatus'
import WalletActions from './WalletActions'

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
export default function WalletDetailsCard({
  data,
  hasBorderTop,
  handleUpdate,
  reload,
  hiddenBalance,
}: WalletDetailsProps) {
  const walletKey = useMemo(
    () => data?.smartWalletAddress ?? data?.[getExchangeKey(data?.exchange)]?.apiKey ?? '',
    [data]
  )
  const isSmartWallet = !!data?.smartWalletAddress
  const [isEdit, setIsEdit] = useState(false)
  const [walletName, setWalletName] = useState(parseWalletName(data))
  // const [fundingModal, setFundingModal] = useState<FundTab | null>(null)

  // const { walletAccount } = useWeb3()
  const { chain } = useChain()

  return (
    <Flex p={3} sx={{ flexDirection: 'column', gap: 2 }}>
      <Flex sx={{ width: '100%', gap: 20, justifyContent: 'space-between' }}>
        <Flex alignItems="center" sx={{ flex: 1, flexWrap: 'wrap', gap: 2 }}>
          <ReferralStatus data={data} />
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

            {isSmartWallet && (
              <ExplorerLogo
                protocol={data.exchange}
                explorerUrl={`${chain.blockExplorerUrl}/address/${data.smartWalletAddress}`}
              />
            )}
          </Flex>
          <WalletKey walletKey={walletKey} isSmartWallet={isSmartWallet} />
          <BalanceStats sx={{ display: ['none', 'flex'] }} balance={data.balance} hiddenBalance={hiddenBalance} />
        </Flex>
        <WalletActions data={data} />
      </Flex>
      <BalanceStats sx={{ display: ['flex', 'none'] }} balance={data.balance} hiddenBalance={hiddenBalance} />
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

function WalletKey({ walletKey, isSmartWallet, sx }: { walletKey?: string; isSmartWallet?: boolean; sx?: any }) {
  return (
    <Flex width={250} sx={{ gap: 2, flexShrink: 0, '& *': { flexShrink: 0 }, ...(sx || {}) }}>
      <Type.Caption color="neutral3">{isSmartWallet ? 'Smart Wallet' : 'API Key'}:</Type.Caption>
      <Flex sx={{ gap: 2 }} alignItems="center">
        <Type.CaptionBold data-tip="React-tooltip" data-tooltip-id={`tt-${walletKey}`} data-tooltip-delay-show={360}>
          {walletKey ? addressShorten(walletKey, 4) : '--'}
        </Type.CaptionBold>
        {!!walletKey && (
          <CopyButton
            variant="ghost"
            size="xs"
            value={walletKey}
            iconSize={16}
            sx={{
              transition: 'none',
              p: 0,
            }}
          ></CopyButton>
        )}
        <Tooltip id={`tt-${walletKey}`} place="top" type="dark" effect="solid" clickable={false}>
          <Type.Small sx={{ maxWidth: [300, 400] }}>{walletKey}</Type.Small>
        </Tooltip>
      </Flex>
    </Flex>
  )
}

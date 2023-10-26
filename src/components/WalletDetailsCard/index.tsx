// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { PencilSimpleLine } from '@phosphor-icons/react'
import React, { useMemo, useState } from 'react'
import { EditText } from 'react-edit-text'
// eslint-disable-next-line no-restricted-imports
import 'react-edit-text/dist/index.css'

import ExplorerLogo from 'components/@ui/ExplorerLogo'
import TitleWithIcon from 'components/@ui/TilleWithIcon'
import { CopyWalletData } from 'entities/copyWallet'
import useChain from 'hooks/web3/useChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import Colors from 'theme/colors'
import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { getColorFromText } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

import FundModal from '../MockSmartWallet/FundModal'
import DeleteWalletAction from './DeleteWalletAction'
import WalletInfo from './WalletInfo'

interface WalletDetailsProps {
  data: CopyWalletData
  hasBorderTop?: boolean
  handleUpdate: ({
    copyWalletId,
    name,
    previousValue,
    callback,
  }: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => void
}
export default function WalletDetailsCard({ data, hasBorderTop, handleUpdate }: WalletDetailsProps) {
  const walletKey = data?.smartWalletAddress ?? data?.bingX?.apiKey ?? ''
  const isAPIKey = data.exchange === CopyTradePlatformEnum.BINGX
  const [isEdit, setIsEdit] = useState(false)
  const [walletName, setWalletName] = useState(parseWalletName(data))
  const [openDepositModal, setOenDepositModal] = useState(false)

  const { walletAccount } = useWeb3()
  const { chain } = useChain()
  const defaultChainProvider = useMemo(() => rpcProvider(DEFAULT_CHAIN_ID), [])

  return (
    <Flex
      p={3}
      flexDirection="column"
      sx={{ borderTop: hasBorderTop ? 'small' : 'none', borderBottom: 'small', borderColor: 'neutral4', gap: 20 }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Box data-tip="React-tooltip" data-tooltip-id={`tt-copy-wallet-${data.id}`}>
            <TitleWithIcon
              color={getColorFromText(data.id)}
              title={
                <EditText
                  value={walletName}
                  showEditButton
                  editButtonContent={<PencilSimpleLine size={20} />}
                  editButtonProps={{ style: { backgroundColor: 'transparent', color: Colors(true).primary1 } }}
                  placeholder={'Enter wallet name'}
                  style={{
                    margin: 0,
                    padding: '0px',
                    fontSize: '13px',
                    lineHeight: '25px',
                    backgroundColor: 'transparent',
                    borderColor: Colors(true).neutral4,
                    borderWidth: '1px',
                    borderStyle: isEdit ? 'solid' : undefined,
                    minHeight: '25px',
                  }}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value && value.length > WALLET_NAME_MAX_LENGTH) return
                    setWalletName(e.target.value)
                  }}
                  onSave={({ value, previousValue }) => {
                    if (!!value) {
                      handleUpdate({ copyWalletId: data.id, name: value, previousValue, callback: setWalletName })
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
          </Box>
          {data.exchange === CopyTradePlatformEnum.SYNTHETIX && (
            <ExplorerLogo
              protocol={data.exchange}
              explorerUrl={`${chain.blockExplorerUrl}/address/${data.smartWalletAddress}`}
            />
          )}
          <Tooltip id={`tt-copy-wallet-${data.id}`} place="top" type="dark" effect="solid" clickable>
            <div
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <CopyButton
                variant="ghost"
                size="xs"
                value={walletKey}
                iconSize={16}
                sx={{
                  transition: 'none',
                  p: 0,
                }}
              >
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  {walletKey}
                </Type.Caption>
              </CopyButton>
            </div>
          </Tooltip>
        </Flex>
        {isAPIKey ? (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <Type.CaptionBold>API Key:</Type.CaptionBold>
              <Type.Caption color="neutral3">{addressShorten(data?.bingX?.apiKey ?? '')}</Type.Caption>
            </Flex>
            <DeleteWalletAction data={data} />
          </Flex>
        ) : (
          <Flex alignItems="center" sx={{ gap: 20 }}>
            <Button type="button" variant="ghostPrimary" sx={{ p: 0 }} onClick={() => setOenDepositModal(true)}>
              <Trans>Deposit</Trans>
            </Button>
            <Button type="button" variant="ghostPrimary" sx={{ p: 0 }}>
              <Trans>Withdraw</Trans>
            </Button>
          </Flex>
        )}
      </Flex>
      <WalletInfo data={data} sx={{ width: '100%' }} />
      {openDepositModal && data.smartWalletAddress && walletAccount && (
        <FundModal
          account={walletAccount}
          smartAccount={data.smartWalletAddress}
          chainId={Number(chain.id)}
          defaultChainProvider={defaultChainProvider}
          isOpen={openDepositModal}
          onDismiss={() => setOenDepositModal(false)}
        />
      )}
    </Flex>
  )
}

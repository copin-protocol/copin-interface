import { Trans } from '@lingui/macro'
import { BookBookmark, Info, PresentationChart, SealQuestion } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useState } from 'react'
import { useParams } from 'react-router-dom'

import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import Logo from 'components/@ui/Logo'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import useVaultDetailsContext, { VaultDetailsProvider } from 'hooks/features/useVaultDetailsProvider'
import { VaultPositionProvider } from 'hooks/features/useVaultPositionProvider'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import CopyButton from 'theme/Buttons/CopyButton'
import { TabConfig, TabHeader } from 'theme/Tab'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

import VaultFundManagement from './VaultFundMangement'
import VaultInfo from './VaultInfo'
import VaultStats from './VaultStats'

export default function VaultDetails() {
  const { address: vaultAddress } = useParams<{ address: string }>()

  const { md } = useResponsive()

  return (
    <>
      <CustomPageTitle title={`Copin Vaults ${addressShorten(vaultAddress)}`} />
      <VaultDetailsProvider>
        {md ? <DesktopVersion vaultAddress={vaultAddress} /> : <MobileVersion vaultAddress={vaultAddress} />}
      </VaultDetailsProvider>
    </>
  )
}

function DesktopVersion({ vaultAddress }: { vaultAddress: string }) {
  return (
    <Container
      maxWidth={{ lg: 1512 }}
      height="100%"
      sx={{ borderLeft: 'small', borderRight: 'small', borderColor: 'neutral4' }}
    >
      <Flex width="100%" height="100%" flexDirection="column" sx={{ mx: 'auto', overflow: 'hidden' }}>
        <Overview vaultAddress={vaultAddress} />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            width: '100%',
            // maxWidth: 1512,
            mx: 'auto',
            overflow: 'hidden',
            borderTop: 'small',
            borderColor: 'neutral4',
          }}
        >
          <Box
            sx={{
              height: '100%',
              maxWidth: '368px',
              flex: '1 0 368px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <VaultFundManagement vaultAddress={vaultAddress} />
          </Box>
          <Flex
            sx={{
              height: '100%',
              flex: '1',
              backgroundColor: 'neutral5',
              borderLeft: 'small',
              borderColor: 'neutral4',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <VaultPositionProvider>
              <VaultInfo />
            </VaultPositionProvider>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

function MobileVersion({ vaultAddress }: { vaultAddress: string }) {
  const [currentTab, setTab] = useState(TabKeyEnum.COPIN_VAULT)
  return (
    <Flex sx={{ flexDirection: 'column', height: '100%' }}>
      <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          {currentTab === TabKeyEnum.COPIN_VAULT && (
            <Box>
              <Overview vaultAddress={vaultAddress} />
              <VaultPositionProvider>
                <VaultInfo />
              </VaultPositionProvider>
            </Box>
          )}
          {currentTab === TabKeyEnum.FUND_MANAGEMENT && (
            <Box>
              <VaultFundManagement vaultAddress={vaultAddress} />
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
      <TabHeader
        configs={tabConfigs}
        isActiveFn={(config) => config.key === currentTab}
        onClickItem={(key) => setTab(key as TabKeyEnum)}
        fullWidth
      />
    </Flex>
  )
}

function Overview({ vaultAddress }: { vaultAddress: string }) {
  const { vault } = useVaultDetailsContext()
  return (
    <Box p={3}>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Type.BodyBold>
          <Trans>Copin Vaults</Trans>
        </Type.BodyBold>
        <Flex alignItems="center" sx={{ gap: [2, 3] }}>
          <ButtonWithIcon
            as={'a'}
            href={LINKS.vaultQA}
            target="_blank"
            icon={<SealQuestion size={20} />}
            variant="ghostPrimary"
            block
            sx={{ p: 0 }}
          >
            <Type.Caption>
              <Trans>Q&A</Trans>
            </Type.Caption>
          </ButtonWithIcon>
          <ButtonWithIcon
            as={'a'}
            href={LINKS.vaultTerms}
            target="_blank"
            icon={<Info size={20} />}
            minWidth="max-content"
            variant="ghostPrimary"
            block
            sx={{ p: 0 }}
          >
            <Type.Caption>
              <Trans>Terms & Conditions</Trans>
            </Type.Caption>
          </ButtonWithIcon>
        </Flex>
      </Flex>
      <Flex mt={12} mb={24} alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
        <VaultWalletInfo label={<Trans>Vault Address</Trans>} address={vaultAddress} protocol={ProtocolEnum.GNS} />
        <VerticalDivider />
        <VaultWalletInfo
          label={<Trans>Smart Wallet Address</Trans>}
          address={vault?.copyWallet ?? '--'}
          protocol={ProtocolEnum.GNS}
          hasProfileUrl
        />
      </Flex>
      <VaultStats />
    </Box>
  )
}

function VaultWalletInfo({
  label,
  address,
  protocol,
  hasProfileUrl,
}: {
  label: ReactNode
  address: string
  protocol: ProtocolEnum
  hasProfileUrl?: boolean
}) {
  return (
    <Flex alignItems="center" sx={{ gap: 2 }}>
      <Type.Caption color="neutral3">{label}</Type.Caption>
      <Type.CaptionBold data-tip="React-tooltip" data-tooltip-id={`tt-${address}`} data-tooltip-delay-show={360}>
        {addressShorten(address)}
      </Type.CaptionBold>
      <CopyButton
        variant="ghost"
        size="xs"
        value={address}
        iconSize={16}
        sx={{
          transition: 'none',
          p: 0,
        }}
      />
      {protocol && (
        <ExplorerLogo
          size={20}
          protocol={protocol}
          explorerUrl={`${PROTOCOL_PROVIDER?.[protocol]?.explorerUrl}/address/${address}`}
        />
      )}
      {hasProfileUrl && (
        <IconBox
          as={'a'}
          href={generateTraderDetailsRoute(protocol, address)}
          target="_blank"
          icon={<Logo size={16} />}
        />
      )}
      <Tooltip id={`tt-${address}`} place="top" type="dark" effect="solid" clickable={false}>
        <Type.Small sx={{ maxWidth: [300, 400] }}>{address}</Type.Small>
      </Tooltip>
    </Flex>
  )
}

enum TabKeyEnum {
  COPIN_VAULT = 'vault',
  FUND_MANAGEMENT = 'fund',
}

const tabConfigs: TabConfig[] = [
  {
    name: 'Copin Vaults',
    activeIcon: <PresentationChart size={24} weight="fill" />,
    inactiveIcon: <PresentationChart size={24} />,
    key: TabKeyEnum.COPIN_VAULT,
  },
  {
    name: 'Fund Management',
    activeIcon: <BookBookmark size={24} weight="fill" />,
    inactiveIcon: <BookBookmark size={24} />,
    key: TabKeyEnum.FUND_MANAGEMENT,
  },
]

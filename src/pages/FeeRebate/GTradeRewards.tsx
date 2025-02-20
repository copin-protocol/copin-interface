import React, { ReactNode } from 'react'

import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { GradientText } from 'pages/@layouts/Navbar/EventButton'
import RebateIcon from 'theme/Icons/RebateIcon'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { parseProtocolImage } from 'utils/helpers/transform'

import WalletItem from './WalletItem'

export default function GTradeRewards() {
  return (
    <>
      <Overview />
      <RebateExample />
      <WalletList />
    </>
  )
}

function Overview() {
  return (
    <Box p={3}>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 3 }}>
        <Flex
          alignItems="center"
          sx={{ p: 1, backgroundColor: `${themeColors.primary1}40`, borderRadius: 'sm', gap: 2 }}
        >
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Image src={parseProtocolImage(ProtocolEnum.GNS)} width={16} alt="gTrade" />
            <Type.Small fontWeight={500}>gTrade</Type.Small>
          </Flex>
          <VerticalDivider sx={{ backgroundColor: themeColors.primary1 }} />
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <IconBox icon={<ArbitrumLogo size={16} />} />
            <Type.Small fontWeight={500}>Arbitrum</Type.Small>
          </Flex>
        </Flex>
      </Flex>
      <Type.H5 mt={2}>gTrade Rebate Program On Arbitrum</Type.H5>
      <Type.Body color="neutral3">
        Arbitrum has launched an 11-week promotional program where users can earn $ARB weekly by trading on gTrade.
        Notably, the rewards in the trading fees category are capped at 75% of the total protocol fees. Rewards are
        calculated weekly and can be claimed every Friday.{' '}
        <Box
          as="a"
          href={
            'https://gains-network.gitbook.io/docs-home/gtrade-leveraged-trading/arbitrum-stip-bridge-incentives/trading-incentives'
          }
          rel="noreferrer"
          target="_blank"
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Read more
        </Box>
      </Type.Body>
    </Box>
  )
}

function RebateExample() {
  return (
    <Box px={3} py={2}>
      <Flex mb={3} alignItems="center" sx={{ gap: 2 }}>
        <IconBox icon={<RebateIcon />} color="primary1" />
        <Type.BodyBold>Rebate example</Type.BodyBold>
      </Flex>
      <RewardDistribution />
    </Box>
  )
}

function WalletList() {
  const { copyWallets, loadingCopyWallets } = useCopyWalletContext()
  const gnsWallets = copyWallets?.filter((wallet) => wallet.exchange === CopyTradePlatformEnum.GNS_V8)

  return (
    <Flex mt={3} flexDirection="column">
      {loadingCopyWallets && <Loading />}
      <Flex
        px={3}
        flexDirection="column"
        sx={{
          overflowY: 'auto',
          '& > *': { borderTop: 'small', borderTopColor: 'neutral4' },
          '& > *:first-child': { borderTop: 'none' },
        }}
      >
        {gnsWallets?.map((wallet) => {
          return <WalletItem key={wallet.id} wallet={wallet} />
        })}
      </Flex>
    </Flex>
  )
}

function RewardDistribution() {
  return (
    <Box sx={{ borderLeft: 'small', borderRight: 'small', borderColor: 'neutral4' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr 1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr 1fr 1fr'],
        }}
      >
        <RewardWrapper label={'Collateral'} value={`$1,000`} hasBorder />
        <RewardWrapper label={'Leverage'} value={'10x'} hasBorder />
        <RewardWrapper label={'Fees (Open + Close)'} value={'$16'} hasBorder />
        <RewardWrapper label={'Est. Trading Rewards'} value={'$12'} hasBorder />
        <RewardWrapper label={'Est. Net Fees'} value={'$16 - $12 = $4'} hasBorder />
        <RewardWrapper label={'Est. ROI Cover Fees'} value={'+0.4%'} hasGradient />
      </Box>
    </Box>
  )
}

function RewardWrapper({
  label,
  value,
  hasBorder,
  hasGradient,
}: {
  label: ReactNode
  value: string | undefined
  hasBorder?: boolean
  hasGradient?: boolean
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRight: hasBorder ? 'small' : undefined,
        borderBottom: 'small',
        borderColor: 'neutral4',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          background: 'linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)',
        }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          top: '4px',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1,
          bg: 'neutral7',
        }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          borderTopLeftRadius: '4px 2px',
          borderTopRightRadius: '4px 2px',
          top: '4px',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 2,
          background: 'linear-gradient(180.26deg, #272C43 0.23%, rgba(11, 13, 23, 0) 85.39%)',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          py: 3,
          zIndex: 3,
        }}
      >
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
        >
          <Type.Caption mb="12px" display="block" sx={{ textAlign: 'center' }}>
            {label}
          </Type.Caption>
        </Flex>
        <Type.Caption mt={3} display="block" sx={{ textAlign: 'center' }}>
          {hasGradient ? <GradientText> {value ? `${value}` : '--'}</GradientText> : value ? `${value}` : '--'}
        </Type.Caption>
      </Box>
    </Box>
  )
}

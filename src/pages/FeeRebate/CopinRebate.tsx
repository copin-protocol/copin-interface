import { ArrowsHorizontal, ClockCounterClockwise, WarningCircle } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo } from 'react'
import { GridProps } from 'styled-system'

import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import Divider from 'components/@ui/Divider'
import Logo from 'components/@ui/Logo'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { EpochHistoryData } from 'entities/feeRebate'
import useFeeRebateContext from 'hooks/features/useFeeRebateProvider'
import { useAuthContext } from 'hooks/web3/useAuth'
import { GradientText } from 'pages/@layouts/Navbar/EventButton'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DATE_TEXT_FORMAT, LINKS } from 'utils/config/constants'
import { EpochStatusEnum } from 'utils/config/enums'
import { formatDate, formatNumber } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

import ClaimButton from './ClaimAction'
import ClaimEpochStatus from './ClaimEpochStatus'

export default function CopinRebate() {
  const { xl } = useResponsive()
  return (
    <Flex height="100%" flexDirection="column" flex="1 0 0">
      {xl ? <Overview /> : <MobileOverview />}
      <RewardDistribution />
      <Divider />
      <ClaimHistories />
      {xl && <Footer />}
    </Flex>
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
            <Image src="/images/protocols/GNS.png" width={16} alt="gTrade" />
            <Type.Small fontWeight={500}>gTrade</Type.Small>
          </Flex>
          <VerticalDivider sx={{ backgroundColor: themeColors.primary1 }} />
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <IconBox icon={<Logo size={12} />} />
            <Type.Small fontWeight={500}>Copin</Type.Small>
          </Flex>
        </Flex>
      </Flex>
      <Type.H5 mt={2}>10,000 ARB Incentives For Decentralized Copy-Trading Fee Rebates</Type.H5>
      <Type.Body color="neutral3">
        Let’s copy - trade through gTrade to get more profit and receive fee rebates from Copin
      </Type.Body>
    </Box>
  )
}

export function EpochStatus({ epochId, status }: { epochId?: number; status?: EpochStatusEnum }) {
  if (epochId == null) return <>--</>

  return (
    <Flex alignItems="center" sx={{ gap: 2 }}>
      <Type.Caption color="neutral1">#{formatNumber(epochId, 0)}</Type.Caption>
      <Tag status={status} sx={{ borderRadius: '2px' }} />
    </Flex>
  )
}

export function TraderReward({
  epochHistory,
  account,
  sx,
}: {
  epochHistory?: EpochHistoryData
  account?: string
  sx?: SystemStyleObject & GridProps
}) {
  if (!epochHistory || !account) return <>--</>
  const traderReward = epochHistory.rebateData.find((e) => e.trader?.toLowerCase() === account?.toLowerCase())

  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1, ...sx }}>
      <Type.Caption color="neutral1">{traderReward?.fee ? formatNumber(traderReward.fee, 2) : '--'}</Type.Caption>
      {traderReward?.fee && <ArbitrumLogo size={16} />}
    </Flex>
  )
}

function MobileOverview() {
  const { totalOngoingRewards, info, format } = useFeeRebateContext()
  return (
    <Box p={3}>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 3 }}>
        <Flex
          alignItems="center"
          sx={{ p: 1, backgroundColor: `${themeColors.primary1}40`, borderRadius: 'sm', gap: 2 }}
        >
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Image src="/images/protocols/GNS.png" width={16} alt="gTrade" />
            <Type.Small fontWeight={500}>gTrade</Type.Small>
          </Flex>
          <VerticalDivider sx={{ backgroundColor: themeColors.primary1 }} />
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <IconBox icon={<Logo size={12} />} />
            <Type.Small fontWeight={500}>Copin</Type.Small>
          </Flex>
        </Flex>
        {/*<Flex alignItems="center" sx={{ gap: 2 }}>*/}
        {/*  <IconBox icon={<WarningCircle size={24} />} color="primary1" />*/}
        {/*  <Type.CaptionBold color="primary1">How It Works</Type.CaptionBold>*/}
        {/*</Flex>*/}
      </Flex>
      <Type.H5 mt={2}>10,000 ARB Incentives For Decentralized Copy-Trading Fee Rebates</Type.H5>
      <Flex mt={3} alignItems="center" sx={{ gap: 1 }}>
        <ArbitrumLogo size={24} />
        <Type.Body color="neutral3">ARB Distribution:</Type.Body>
      </Flex>
      <Type.Body fontWeight={500} mt={1}>
        {formatNumber(info?.totalDistributedReward, 2)} / {formatNumber(info?.maxReward)}
      </Type.Body>
      <Flex mt={3} alignItems="center" sx={{ gap: 1 }}>
        <ArbitrumLogo size={24} />
        <Type.Body color="neutral3">ARB Ongoing Fees:</Type.Body>
      </Flex>
      <Type.Body fontWeight={500} mt={1}>
        {formatNumber(totalOngoingRewards, 2)}
      </Type.Body>
      <Flex mt={20} alignItems="center" sx={{ gap: 2 }}>
        <IconBox icon={<ArrowsHorizontal size={24} />} color="primary1" />
        <Type.Body color="neutral3">Duration:</Type.Body>
      </Flex>
      <Type.Body mt={1}>{formatDate(info?.epochStart, format)} -</Type.Body>
      <Type.Body>{formatDate(info?.epochEnd, format)}</Type.Body>
      <Flex
        as="a"
        href="https://blog.copin.io/p/join-copins-decentralized-copy-trading?r=2m5jsa&utm_campaign=post&utm_medium=web&triedRedirect=true"
        target="_blank"
        mt={3}
        alignItems="center"
        sx={{ gap: 2 }}
      >
        <IconBox icon={<WarningCircle size={24} />} color="primary1" />
        <Type.CaptionBold color="primary1">How It Works</Type.CaptionBold>
      </Flex>
    </Box>
  )
}

//=========================
function ClaimHistories() {
  const { account: _account } = useAuthContext()
  const { info, histories, format, isLoadingFeeRebate, isLoadingHistories } = useFeeRebateContext()
  const account = isAddress(_account?.address)

  const { sm, xl } = useResponsive()

  const columns: ColumnData<EpochHistoryData>[] = useMemo(
    () => [
      {
        title: 'Epoch',
        dataIndex: 'epochId',
        key: 'epochId',
        style: { minWidth: '130px', textAlign: 'left' },
        render: (item) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EpochStatus epochId={item.epochId} status={item.status} />
          </Box>
        ),
      },
      {
        title: 'Duration',
        dataIndex: 'epochStart',
        key: 'epochStart',
        style: { minWidth: '180px' },
        render: (item) => (
          <>
            <Type.Caption
              color="neutral1"
              data-tip="React-tooltip"
              data-tooltip-id={`tt_rebate_${item.epochId}_${account}`}
              data-tooltip-delay-show={360}
            >
              {formatDate(item.epochStart, DATE_TEXT_FORMAT)} - {formatDate(item.epochEnd, DATE_TEXT_FORMAT)}
            </Type.Caption>
            <Tooltip
              id={`tt_rebate_${item.epochId}_${account}`}
              place="top"
              type="dark"
              effect="solid"
              clickable={false}
            >
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption width={65} color="neutral3">
                  Start Date:
                </Type.Caption>
                <Type.Caption>{formatDate(item.epochStart, format)}</Type.Caption>
              </Flex>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption width={65} color="neutral3">
                  End Date:
                </Type.Caption>
                <Type.Caption>{formatDate(item.epochEnd, format)}</Type.Caption>
              </Flex>
            </Tooltip>
          </>
        ),
      },
      {
        title: 'Your Trading Fees',
        dataIndex: 'totalRewardPool',
        key: 'totalRewardPool',
        style: { minWidth: '130px', textAlign: 'right' },
        render: (item) => <TraderReward epochHistory={item} account={account} />,
      },
      {
        title: 'Your Earned Rebate',
        dataIndex: 'rebateData',
        key: 'rebateData',
        style: { minWidth: '130px', textAlign: 'right' },
        render: (item) => <TraderReward epochHistory={item} account={account} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '150px', textAlign: 'right' },
        render: (item) => (
          <ClaimEpochStatus
            epochHistory={item}
            account={account}
            epochId={!!info?.currentEpochId && item.epochId <= info?.currentEpochId ? item.epochId : undefined}
            epochStatus={item.status}
          />
        ),
      },
    ],
    [account, info?.currentEpochId]
  )

  return (
    <>
      {xl ? (
        <Box flex="1 0 0">
          <Flex p={3} alignItems="center" sx={{ gap: 2 }}>
            <ClockCounterClockwise size={24} color={themeColors.primary1} />
            <Type.LargeBold>Claim Fee Rebates History</Type.LargeBold>
          </Flex>
          <Table
            restrictHeight={false}
            data={histories}
            columns={columns}
            isLoading={(isLoadingFeeRebate || isLoadingHistories) ?? false}
            tableBodyWrapperSx={{
              overflow: 'auto',
              flex: 'auto',
            }}
            containerSx={{
              height: 'auto',
              '& th:first-child, td:first-child': {
                pl: '16px !important',
              },
              '& th:last-child, td:last-child': {
                pr: '16px !important',
              },
              '& th, td': {
                border: 'none !important',
              },
            }}
          />
        </Box>
      ) : (
        <Flex
          sx={{
            flexDirection: 'column',
            '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4' },
            '& > *:last-child': { borderBottom: 'none' },
          }}
        >
          <Flex p={3} alignItems="center" sx={{ gap: 2 }}>
            <ClockCounterClockwise size={24} color={themeColors.primary1} />
            <Type.LargeBold>Claim Fee Rebates History</Type.LargeBold>
          </Flex>
          {histories?.map((_d) => {
            return (
              <Box key={_d.epochId} sx={{ mx: 3, py: 12 }}>
                <Flex mb={12} sx={{ alignItems: 'center', gap: 2 }}>
                  <Flex alignItems="center" sx={{ gap: 1 }}>
                    <Type.Caption>Epoch</Type.Caption>
                    <EpochStatus epochId={_d.epochId} status={_d.status} />
                  </Flex>
                </Flex>
                <Flex mb={12} alignItems="center" sx={{ gap: 2 }}>
                  <Type.Caption color="neutral3">Duration</Type.Caption>
                  <Type.Caption color="neutral1">
                    {formatDate(_d.epochStart, DATE_TEXT_FORMAT)} - {formatDate(_d.epochEnd, DATE_TEXT_FORMAT)}
                  </Type.Caption>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 3 }}>
                  <Flex flex={1} flexDirection="column">
                    <Type.Caption color="neutral3">Trading Fees</Type.Caption>
                    <TraderReward epochHistory={_d} account={account} sx={{ justifyContent: 'flex-start' }} />
                  </Flex>
                  <Flex flex={1} flexDirection="column">
                    <Type.Caption color="neutral3">Earned Rebate</Type.Caption>
                    <TraderReward epochHistory={_d} account={account} sx={{ justifyContent: 'flex-start' }} />
                  </Flex>
                  <Flex flex={1} flexDirection="column">
                    <Type.Caption color="neutral3">Status</Type.Caption>
                    <ClaimEpochStatus
                      epochHistory={_d}
                      account={account}
                      epochId={!!info?.currentEpochId && _d.epochId <= info?.currentEpochId ? _d.epochId : undefined}
                      epochStatus={_d.status}
                    />
                  </Flex>
                </Flex>
              </Box>
            )
          })}
        </Flex>
      )}
    </>
  )
}

//=========================
function RewardDistribution() {
  const { xl } = useResponsive()
  const { totalOngoingRewards, info, reload } = useFeeRebateContext()
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr'],
        }}
      >
        {xl && (
          <RewardWrapper
            label={<Type.Body color="primary1">ARB Distribution</Type.Body>}
            value={`${formatNumber(info?.totalDistributedReward, 2)} / ${formatNumber(info?.maxReward, 0)}`}
            action={
              <Type.Caption mb={1} color="neutral3">
                Ongoing Fees: {formatNumber(totalOngoingRewards, 2)}
              </Type.Caption>
            }
            hasBorder
          />
        )}
        <RewardWrapper label={'Total Earned Rebate'} value={formatNumber(info?.totalFees, 2)} hasBorder />
        <RewardWrapper label={'Claimed Rebate'} value={formatNumber(info?.claimedFees, 2)} hasBorder />
        <RewardWrapper
          label={'Unclaim Rebate'}
          value={formatNumber(info?.claimableFees, 2)}
          action={
            !!info?.claimableFees ? <ClaimButton availableClaim={info?.claimableFees} onSuccess={reload} /> : undefined
          }
          hasGradient
        />
      </Box>
    </Box>
  )
}
function RewardWrapper({
  label,
  value,
  action,
  hasBorder,
  hasGradient,
}: {
  label: ReactNode
  value: string | undefined
  action?: ReactNode
  hasBorder?: boolean
  hasGradient?: boolean
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRight: hasBorder ? 'small' : undefined,
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
          py: 64,
          zIndex: 3,
        }}
      >
        <Flex width="100%" justifyContent="center" alignItems="center" sx={{ mb: 2, gap: 2 }}>
          <Type.Body color="neutral3" display="block" sx={{ textAlign: 'center' }}>
            {hasGradient ? <GradientText>{label}</GradientText> : label}
          </Type.Body>
          <ArbitrumLogo size={24} />
        </Flex>
        <Type.H4 display="block" sx={{ textAlign: 'center' }}>
          {value ? `${value}` : '--'}
        </Type.H4>
        {action && (
          <Flex sx={{ position: 'absolute', justifyContent: 'center', width: '100%', bottom: 3 }}>{action}</Flex>
        )}
      </Box>
    </Box>
  )
}

//=========================
function Footer() {
  const { histories, info, format } = useFeeRebateContext()
  const currentEpoch = histories?.find((e) => e.epochId === info?.currentEpochId)

  return (
    <Flex
      as="footer"
      display="block"
      py={1}
      px={3}
      sx={{
        borderTop: 'small',
        borderColor: 'neutral4',
        '& a': {
          color: 'inherit',
          '&:hover': {
            color: 'neutral1',
          },
        },
        zIndex: 10,
      }}
      alignItems="center"
      justifyContent="space-between"
    >
      <Type.Caption color="neutral3">
        Have question? Please ask in{' '}
        <a href={LINKS.telegram} target="_blank" rel="noreferrer">
          <Type.Caption color="primary1">here</Type.Caption>
        </a>{' '}
        or see the{' '}
        <a href={LINKS.blog} target="_blank" rel="noreferrer">
          <Type.Caption color="primary1">Blog</Type.Caption>
        </a>
      </Type.Caption>
      <Type.Caption color="neutral3">
        Last update:{' '}
        {formatDate(!!currentEpoch?.lastUpdated ? currentEpoch?.lastUpdated : currentEpoch?.epochStart, format)}
      </Type.Caption>
    </Flex>
  )
}

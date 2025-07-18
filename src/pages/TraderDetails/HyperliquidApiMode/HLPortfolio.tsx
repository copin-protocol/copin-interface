import { Trans } from '@lingui/macro'
import { CaretRight, Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useState } from 'react'

import SectionTitle from 'components/@ui/SectionTitle'
import useHyperliquidAccountSummary from 'hooks/features/trader/useHyperliquidAccountSummary'
import useHyperliquidFees from 'hooks/features/trader/useHyperliquidFees'
import useHyperliquidPortfolio from 'hooks/features/trader/useHyperliquidPortfolio'
import { useHyperliquidTraderContext } from 'hooks/features/trader/useHyperliquidTraderContext'
import useHyperliquidVaultEquities from 'hooks/features/trader/useHyperliquidVaultEquities'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Flex, Type } from 'theme/base'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import ModalDailyVolume from './ModalDailyVolume'
import ModalFeesSchedule from './ModalFeesSchedule'
import ModalSubAccounts from './ModalSubAccounts'

export default function HLPortfolio() {
  const {
    hlAccountData,
    hlAccountSpotData,
    hlAccountVaultData,
    hlPortfolioData,
    hlFeesData,
    hlStakingData,
    hlSubAccounts,
    hlSpotTokens,
    isAccountValue,
    isCombined,
    timeOption,
  } = useHyperliquidTraderContext()
  const userSummary = useHyperliquidAccountSummary({ hlAccountData, hlAccountSpotData })
  const userFees = useHyperliquidFees({ hlFeesData })
  const userPortfolio = useHyperliquidPortfolio({
    hlPortfolioData,
    isCombined,
    isAccountValue,
    timeOption: timeOption.id,
  })
  const userVaultEquities = useHyperliquidVaultEquities({ hlAccountVaultData })
  const userStaking = useMemo(
    () => Number(hlStakingData?.delegated || 0) + Number(hlStakingData?.totalPendingWithdrawal || 0),
    [hlStakingData]
  )
  const totalEquity = useMemo(() => {
    return userSummary.spotValue + userSummary.accountValue + userVaultEquities
  }, [userSummary.accountValue, userSummary.spotValue, userVaultEquities])

  const [isSpotFees, setIsSpotFees] = useState(false)
  const [openModalVolume, setOpenModalVolume] = useState(false)
  const [openModalFees, setOpenModalFees] = useState(false)
  const [openModalSub, setOpenModalSub] = useState(false)

  const { sm, xl } = useResponsive()

  const renderSubAccounts = () => {
    return (
      <ButtonWithIcon
        type="button"
        variant="outlineInactive"
        size="sm"
        direction="right"
        icon={<CaretRight size={12} weight="bold" />}
        onClick={() => setOpenModalSub(true)}
        py="1px"
        px={2}
        width="fit-content"
      >
        <Type.Small>
          <Trans>Sub-Accounts</Trans>
        </Type.Small>
      </ButtonWithIcon>
    )
  }

  return (
    <Flex flexDirection="column" width="100%" height="100%" p={12}>
      {xl && (
        <SectionTitle
          icon={Pulse}
          title={
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Trans>PORTFOLIO</Trans>
              {!!hlSubAccounts?.length && renderSubAccounts()}
            </Flex>
          }
        />
      )}
      <Flex flexDirection="column" sx={{ gap: [2, 2, 2, 3] }}>
        {!xl && !!hlSubAccounts?.length && renderSubAccounts()}
        <Flex flex={1} sx={{ gap: 2 }}>
          <Flex flex={1} variant="card" flexDirection="column" sx={{ gap: 1, p: 2 }}>
            <Type.Caption color="neutral3">
              <Trans>14 Days Volume</Trans>
            </Type.Caption>
            <Type.BodyBold>${compactNumber(userFees?.totalUser14DVolume, 2)}</Type.BodyBold>
            <Button
              type="button"
              variant="textPrimary"
              onClick={() => setOpenModalVolume(true)}
              p={0}
              width="fit-content"
            >
              <Type.Caption>
                <Trans>View Volume</Trans>
              </Type.Caption>
            </Button>
          </Flex>
          <Flex flex={1} flexDirection="column" variant="card" sx={{ gap: 1, p: 2 }}>
            <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
              <Flex sx={{ flex: 1, flexWrap: 'wrap' }}>
                <Type.Caption color="neutral3" mr="1ch">
                  <Trans>Fees</Trans>
                </Type.Caption>
                <Type.Caption color="neutral3">
                  <Trans>(Taker / Maker)</Trans>
                </Type.Caption>
              </Flex>

              {sm && (
                <Dropdown
                  buttonVariant="ghost"
                  buttonSx={{ p: 0 }}
                  menuSx={{
                    width: 80,
                    minWidth: 80,
                    height: 'max-content',
                  }}
                  menu={
                    <>
                      <DropdownItem onClick={() => setIsSpotFees(false)}>
                        <Type.Caption>
                          <Trans>Perps</Trans>
                        </Type.Caption>
                      </DropdownItem>
                      <DropdownItem onClick={() => setIsSpotFees(true)}>
                        <Type.Caption>
                          <Trans>Spot</Trans>
                        </Type.Caption>
                      </DropdownItem>
                    </>
                  }
                >
                  <Type.Caption>{isSpotFees ? 'Spot' : 'Perps'}</Type.Caption>
                </Dropdown>
              )}
            </Flex>
            {isSpotFees ? (
              <Type.BodyBold>{`${formatNumber((userFees?.spotTakerFee ?? 0) * 100, 4, 4)}% / ${formatNumber(
                (userFees?.spotMakerFee ?? 0) * 100,
                4,
                4
              )}%`}</Type.BodyBold>
            ) : (
              <Type.BodyBold>{`${formatNumber((userFees?.takerFee ?? 0) * 100, 4, 4)}% / ${formatNumber(
                (userFees?.makerFee ?? 0) * 100,
                4,
                4
              )}%`}</Type.BodyBold>
            )}
            <Button
              type="button"
              variant="textPrimary"
              onClick={() => setOpenModalFees(true)}
              p={0}
              width="fit-content"
            >
              <Type.Caption>
                <Trans>View Fee Schedule</Trans>
              </Type.Caption>
            </Button>
          </Flex>
        </Flex>
        <Flex
          flex={1}
          flexDirection="column"
          width="100%"
          justifyContent="space-between"
          sx={{ gap: 2, pb: [0, 0, 0, 0, 12] }}
        >
          <RowItem label={<Trans>Volume</Trans>} value={`$${formatNumber(userPortfolio?.totalVolume, 0)}`} />
          {userPortfolio?.mdd && userPortfolio?.mdd < 100 && (
            <RowItem
              label={<Trans>Max Drawdown</Trans>}
              value={
                userPortfolio?.mdd && userPortfolio?.mdd >= 100 ? '--' : `${formatNumber(userPortfolio?.mdd, 2, 2)}%`
              }
            />
          )}
          <RowItem label={<Trans>Total Equity</Trans>} value={`$${formatNumber(totalEquity, 0)}`} />
          <RowItem label={<Trans>Perps Equity</Trans>} value={`$${formatNumber(userSummary.accountValue, 0)}`} />
          <RowItem label={<Trans>Spot Equity</Trans>} value={`$${formatNumber(userSummary.spotValue, 0)}`} />
          <RowItem label={<Trans>Vault Equity</Trans>} value={`$${formatNumber(userVaultEquities, 0)}`} />
          <RowItem label={<Trans>Staking Amount</Trans>} value={`${formatNumber(userStaking, 0)} HYPE`} />
        </Flex>
      </Flex>
      {openModalVolume && (
        <ModalDailyVolume
          data={userFees?.dailyUserVolume}
          makerVolumeShare={userFees?.makerVolumeShare}
          onDismiss={() => setOpenModalVolume(false)}
        />
      )}
      {openModalFees && <ModalFeesSchedule data={userFees} onDismiss={() => setOpenModalFees(false)} />}
      {openModalSub && (
        <ModalSubAccounts subData={hlSubAccounts} spotTokens={hlSpotTokens} onDismiss={() => setOpenModalSub(false)} />
      )}
    </Flex>
  )
}

function RowItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{label}</Type.Caption>
      <Type.Caption color="neutral1">{value}</Type.Caption>
    </Flex>
  )
}

import { Trans } from '@lingui/macro'
import React, { useCallback, useMemo, useState } from 'react'

import Divider from 'components/@ui/Divider'
import { HlFeesData, HlStakingDiscountTier } from 'entities/hyperliquid'
import { MappedRebateTier, MappedVipTier } from 'hooks/features/trader/useHyperliquidFees'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Modal from 'theme/Modal'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function ModalFeesSchedule({ data, onDismiss }: { data?: HlFeesData | null; onDismiss: () => void }) {
  const [currentTier, setCurrentTier] = useState(() => {
    return data?.stakingDiscountTiers?.findLast((e) => Number(e.discount) === data?.stakingDiscount)?.discount
  })

  const vipColumns = useMemo(() => {
    const result: ColumnData<MappedVipTier>[] = [
      {
        title: 'Tier',
        dataIndex: 'tierIndex',
        key: 'tierIndex',
        style: { minWidth: '60px' },
        render: (item: MappedVipTier) => {
          return <Type.Caption>{item.tierIndex}</Type.Caption>
        },
      },
      {
        title: '14D Volume',
        dataIndex: 'ntlCutoff',
        key: 'ntlCutoff',
        style: { minWidth: '120px' },
        render: (item: MappedVipTier, index) => {
          return <Type.Caption>{`${!!index ? '>' : '≤'} $${formatNumber(item.ntlCutoff, 0)}`}</Type.Caption>
        },
      },
      {
        title: 'Perps Taker',
        dataIndex: 'perpsTaker',
        key: 'perpsTaker',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item: MappedVipTier) => {
          return <Type.Caption>{`${formatNumber(item.perpsTaker, 4, 4)}%`}</Type.Caption>
        },
      },
      {
        title: 'Perps Maker',
        dataIndex: 'perpsMaker',
        key: 'perpsMaker',
        style: { minWidth: '90px', textAlign: 'right' },
        render: (item: MappedVipTier) => {
          return <Type.Caption>{`${formatNumber(item.perpsMaker, 4, 4)}%`}</Type.Caption>
        },
      },
      {
        title: 'Spot Taker',
        dataIndex: 'spotTaker',
        key: 'spotTaker',
        style: { minWidth: '90px', textAlign: 'right' },
        render: (item: MappedVipTier) => {
          return <Type.Caption>{`${formatNumber(item.spotTaker, 4, 4)}%`}</Type.Caption>
        },
      },
      {
        title: 'Spot Maker',
        dataIndex: 'spotMaker',
        key: 'spotMaker',
        style: { minWidth: '90px', textAlign: 'right' },
        render: (item: MappedVipTier) => {
          return <Type.Caption>{`${formatNumber(item.spotMaker, 4, 4)}%`}</Type.Caption>
        },
      },
    ]
    return result
  }, [])

  const mmColumns = useMemo(() => {
    const result: ColumnData<MappedRebateTier>[] = [
      {
        title: 'Tier',
        dataIndex: 'tierIndex',
        key: 'tierIndex',
        style: { minWidth: '80px' },
        render: (item: MappedRebateTier) => {
          return <Type.Caption>{item.tierIndex}</Type.Caption>
        },
      },
      {
        title: '14D Maker Volume Share',
        dataIndex: 'makerFractionCutoff',
        key: 'makerFractionCutoff',
        style: { minWidth: '155px' },
        render: (item: MappedRebateTier) => {
          return <Type.Caption>{`> ${formatNumber(item.makerFractionCutoff, 2, 2)}%`}</Type.Caption>
        },
      },
      {
        title: 'Maker',
        dataIndex: 'makerRebate',
        key: 'makerRebate',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: MappedRebateTier) => {
          return <Type.Caption>{`${formatNumber(item.makerRebate, 3, 3)}%`}</Type.Caption>
        },
      },
    ]
    return result
  }, [])

  return (
    <Modal
      isOpen
      width="100%"
      maxWidth="550px"
      title={<Trans>Fee Schedule</Trans>}
      onDismiss={() => onDismiss()}
      hasClose
    >
      <Box width="100%" px={3} pb={1}>
        <SelectStakingDiscountTiers
          stakingDiscountTiers={data?.stakingDiscountTiers ?? []}
          tier={currentTier}
          onChangeTier={setCurrentTier}
        />
      </Box>
      <Type.Caption px={3}>
        Trader current staking discount is {(data?.stakingDiscount ?? 0) * 100}% with{' '}
        {formatNumber((data?.stakingLevel ?? 0) * 100000, 2)} HYPE staked. Staking discounts are updated at the end of
        each UTC day.
      </Type.Caption>
      <Type.Body px={3} py={2} color="neutral3">
        <Trans>FEE TIERS</Trans>
      </Type.Body>
      <Box height={270}>
        <Table
          restrictHeight={true}
          data={data?.vipTiers}
          columns={vipColumns}
          isLoading={false}
          renderRowBackground={(item, _) =>
            (!data?.currentVipTier && item.tierIndex === 0) || data?.currentVipTier?.tierIndex === item.tierIndex
              ? 'rgba(78, 174, 253, 0.2)'
              : 'transparent'
          }
          tableBodySx={{ color: 'neutral1' }}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child': {
                pr: 3,
              },
              '& td:last-child': {
                pr: 3,
              },
            },
          }}
        />
      </Box>
      <Type.Body px={3} py={2} color="neutral3">
        <Trans>MAKER REBATE TIERS</Trans>
      </Type.Body>
      <Box>
        <Table
          restrictHeight={false}
          data={data?.mmTiers}
          columns={mmColumns}
          isLoading={false}
          tableBodySx={{ color: 'neutral1' }}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child': {
                pr: 3,
              },
              '& td:last-child': {
                pr: 3,
              },
            },
          }}
        />
        <Box px={3} py={3}>
          <Divider />
          <Type.Caption py={2} color="neutral3">
            <Trans>
              Perps and spot volume are counted together to determine trader fee tier, and spot volume counts double
              toward trader fee tier. Negative fees are rebates. Staking discounts do not apply to maker rebates.
            </Trans>
          </Type.Caption>
        </Box>
      </Box>
    </Modal>
  )
}

export const SelectStakingDiscountTiers = ({
  stakingDiscountTiers,
  tier,
  onChangeTier,
}: {
  stakingDiscountTiers: HlStakingDiscountTier[]
  tier?: string
  onChangeTier: (tier: string) => void
}) => {
  const options = stakingDiscountTiers.map((tier) => {
    return {
      label: `${formatNumber(Number(tier.discount) * 100, 0)}% / ${formatNumber(
        Number(tier.bpsOfMaxSupply) * 100000
      )} HYPE`,
      value: tier.discount,
    }
  })
  const currentOption = options.find((e) => e.value === tier)
  const renderTiers = useCallback(() => {
    return (
      <Box width="100%">
        {options.map((option) => (
          <DropdownItem key={option.value} size="sm" onClick={() => onChangeTier(option.value)}>
            <Type.Caption color={tier === option.value ? 'primary1' : 'inherit'}>{option.label}</Type.Caption>
          </DropdownItem>
        ))}
      </Box>
    )
  }, [onChangeTier, options, tier])
  return (
    <Dropdown
      menu={renderTiers()}
      buttonVariant="outline"
      inline
      buttonSx={{ width: '100%', p: 2 }}
      menuSx={{ width: 200 }}
      hasArrow
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Type.Caption>
          <Trans>Staking Discount / HYPE Staked</Trans>
        </Type.Caption>
        <Type.Caption>{currentOption?.label}</Type.Caption>
      </Flex>
    </Dropdown>
  )
}

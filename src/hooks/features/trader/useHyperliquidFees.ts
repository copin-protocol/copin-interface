import { useMemo } from 'react'

import { HlDailyVolumeData, HlFeeTierMM, HlFeeTierVIP, HlFeesData, HlFeesRawData } from 'entities/hyperliquid'

export interface MappedVipTier {
  tierIndex: number
  ntlCutoff: number
  perpsTaker: number
  perpsMaker: number
  spotTaker: number
  spotMaker: number
}

export interface MappedRebateTier {
  tierIndex: number
  makerFractionCutoff: number
  makerRebate: number
}

const useHyperliquidFees = ({ hlFeesData }: { hlFeesData?: HlFeesRawData }) => {
  return useMemo(() => {
    if (!hlFeesData) return null

    const {
      dailyUserVlm,
      feeSchedule,
      userCrossRate,
      userAddRate,
      userSpotCrossRate,
      userSpotAddRate,
      activeReferralDiscount,
      activeStakingDiscount,
    } = hlFeesData

    const sortedDailyUserVlm =
      filterTodayUserVlm(dailyUserVlm)?.sort((a, b) => {
        return new Date(b.date).valueOf() - new Date(a.date).valueOf()
      }) ?? []

    const totalUserTaker =
      sortedDailyUserVlm.reduce((acc, day: HlDailyVolumeData) => acc + Number(day.userCross), 0) ?? 0
    const totalUserMaker = sortedDailyUserVlm.reduce((acc, day: HlDailyVolumeData) => acc + Number(day.userAdd), 0) ?? 0
    const totalExchange = sortedDailyUserVlm.reduce((acc, day: HlDailyVolumeData) => acc + Number(day.exchange), 0) ?? 0
    const totalUser14DVolume = totalUserTaker + totalUserMaker

    const referralDiscount = Number(activeReferralDiscount || '0')
    const stakingDiscount = Number(activeStakingDiscount.discount || '0')
    const stakingLevel = Number(activeStakingDiscount.bpsOfMaxSupply)

    const vipTiersRaw: HlFeeTierVIP[] = feeSchedule?.tiers?.vip
    const mmTiersRaw: HlFeeTierMM[] = feeSchedule?.tiers?.mm
    const minTierVolume = !!vipTiersRaw?.length ? Number(vipTiersRaw[0].ntlCutoff) : 0
    const vipTiers: MappedVipTier[] = [
      {
        tierIndex: 0,
        ntlCutoff: minTierVolume,
        perpsTaker: Number(feeSchedule.cross) * (1 - stakingDiscount) * 100,
        perpsMaker: Number(feeSchedule.add) * (1 - stakingDiscount) * 100,
        spotTaker: Number(feeSchedule.spotCross) * (1 - stakingDiscount) * 100,
        spotMaker: Number(feeSchedule.spotAdd) * (1 - stakingDiscount) * 100,
      },
      ...(vipTiersRaw?.map((tier, index) => ({
        tierIndex: index + 1,
        ntlCutoff: Number(tier.ntlCutoff),
        perpsTaker: Number(tier.cross) * (1 - stakingDiscount) * 100,
        perpsMaker: Number(tier.add) * (1 - stakingDiscount) * 100,
        spotTaker: Number(tier.spotCross) * (1 - stakingDiscount) * 100,
        spotMaker: Number(tier.spotAdd) * (1 - stakingDiscount) * 100,
      })) ?? []),
    ]

    const mmTiers: MappedRebateTier[] =
      mmTiersRaw?.map((tier, index) => ({
        tierIndex: index + 1,
        makerFractionCutoff: Number(tier.makerFractionCutoff) * 100,
        makerRebate: Number(tier.add) * 100,
      })) ?? []

    const currentVipTier = vipTiers?.findLast((tier) => totalUser14DVolume >= Number(tier.ntlCutoff))

    const makerVolumeShare = totalExchange > 0 ? totalUserMaker / totalExchange : 0
    const currentMakerRebateTier = mmTiers?.findLast((tier) => makerVolumeShare >= Number(tier.makerFractionCutoff))

    return {
      totalUserTaker,
      totalUserMaker,
      totalUser14DVolume,
      makerVolumeShare,
      takerFee: Number(userCrossRate) * (1 - referralDiscount),
      makerFee: Number(userAddRate) * (1 - referralDiscount),
      spotTakerFee: Number(userSpotCrossRate) * (1 - referralDiscount),
      spotMakerFee: Number(userSpotAddRate) * (1 - referralDiscount),
      vipTiers,
      mmTiers,
      minTierVolume,
      currentVipTier,
      currentMakerRebateTier,
      stakingDiscount,
      stakingLevel,
      referralDiscount,
      dailyUserVolume: sortedDailyUserVlm,
      stakingDiscountTiers: feeSchedule.stakingDiscountTiers,
    } as HlFeesData
  }, [hlFeesData])
}

export default useHyperliquidFees

export function filterTodayUserVlm(data: HlDailyVolumeData[]): HlDailyVolumeData[] {
  const todayUTC = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
  return data.filter((record) => record.date !== todayUTC)
}

import { ReferralTierEnum } from 'utils/config/enums'

export const TIER_SYSTEM: Record<
  ReferralTierEnum,
  { rebateF0: number; commissionF1: number; commissionF2: number; totalFee: number }
> = {
  [ReferralTierEnum.TIER_1]: {
    totalFee: 0,
    rebateF0: 0,
    commissionF1: 10,
    commissionF2: 1,
  },
  [ReferralTierEnum.TIER_2]: {
    totalFee: 1500,
    rebateF0: 5,
    commissionF1: 15,
    commissionF2: 2,
  },
  [ReferralTierEnum.TIER_3]: {
    totalFee: 3000,
    rebateF0: 5,
    commissionF1: 20,
    commissionF2: 4,
  },
  [ReferralTierEnum.TIER_4]: {
    totalFee: 6000,
    rebateF0: 5,
    commissionF1: 25,
    commissionF2: 6,
  },
  [ReferralTierEnum.TIER_5]: {
    totalFee: 12000,
    rebateF0: 5,
    commissionF1: 30,
    commissionF2: 8,
  },
  [ReferralTierEnum.TIER_6]: {
    totalFee: 24000,
    rebateF0: 5,
    commissionF1: 35,
    commissionF2: 10,
  },
}

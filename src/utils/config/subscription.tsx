import { SubscriptionPlanEnum } from 'utils/config/enums'

export interface PlanConfig {
  id: number
  title: string
  price: number
  yearlyDiscountPercent: number
  features: string[]
  color: string
  discountByPeriod?: {
    [key: string]: number
  }
  gradientBorder?: boolean
  isActive?: boolean
  onUpgrade?: () => void
}

export const PLANS: PlanConfig[] = [
  {
    id: 0,
    title: SubscriptionPlanEnum.FREE,
    price: 0,
    yearlyDiscountPercent: 0,
    features: [
      "Get started with Copin's features. Access curated on-chain signals, basic analytics tools, and explore trading ideas",
    ],
    color: '#fff',
  },
  {
    id: 1,
    title: SubscriptionPlanEnum.STARTER,
    price: 99,
    yearlyDiscountPercent: 20,
    features: ['Start your journey into on-chain data analysts and begin making profits with smart copy-trading.'],
    color: 'green2',
  },
  {
    id: 2,
    title: SubscriptionPlanEnum.PRO,
    price: 299,
    yearlyDiscountPercent: 20,
    features: ['For active traders. Level up your strategy with labeled trader profiles and deep on-chain analytics.'],
    color: 'orange1',
  },
  {
    id: 3,
    title: SubscriptionPlanEnum.ELITE,
    price: 999,
    yearlyDiscountPercent: 20,
    features: [
      'For funds and full-time traders. Access the full suite of tools, expert insights, and create your own trading signals',
    ],
    color: 'violet',
  },
]

export const PRO_PLAN = PLANS.find((plan) => plan.title === SubscriptionPlanEnum.PRO) as PlanConfig

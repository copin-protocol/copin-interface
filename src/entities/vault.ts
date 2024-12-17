export interface VaultData {
  vaultAddress?: string
  copyWallet?: string
  owner?: string
  totalShares?: number
  totalPooledToken?: number
  totalSupply?: number
  decimals?: number
  userNetDeposit?: number
  userBalanceShares?: number
  userLastDepositTimes?: number
  profitSharingRatio?: number
  depositFee?: number
  withdrawFee?: number
  managementFee?: number
  lockDepositDuration?: number
  lastSnapshotBalance?: number
  lastSnapshot?: number
  paused?: boolean
  vaultConfigs?: VaultConfig
}

export interface VaultConfig {
  minDeposit: number
  maxDeposit: number
  minMargin: number
  maxMargin: number
}

export interface VaultUserDetails {
  userBalanceUsd: number
  netDeposit: number
  lastPrice: number
  currentPrice: number
  pnl: number
}

export interface VaultAprData {
  pastMonthBalance: number
  pnl: number
  apr: number
  from: string
  to: string
}

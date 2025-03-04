import { Info } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'

export function TooltipIcon({ id, sx = {} }: { id: string; sx?: any }) {
  return <IconBox color="neutral2" data-tooltip-id={id} icon={<Info size={14} />} sx={{ ...sx }} />
}

export function TooltipLabel({ id, label, sx = {} }: { id: string; label: ReactNode; sx?: any }) {
  return (
    <Box data-tooltip-id={id} data-tooltip-delay-show={360} sx={{ ...sx }}>
      {label}
    </Box>
  )
}

export function Tooltips() {
  return (
    <>
      <Tooltip id="feature-alert">
        <Type.Caption color="neutral2" maxWidth={300}>
          You will receive alerts when MM, insider trader, whale trader... trading
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-cex-connection">
        <Type.Caption color="neutral2" maxWidth={300}>
          You can actively request additional CEXs that you want. Support is only provided for VIP packages of over 6
          months
        </Type.Caption>
      </Tooltip>
      <Tooltip id="advanced-data-visualization">
        <Type.Caption color="neutral2" maxWidth={300}>
          Ex: Custom trader percentile rank
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-non-referral">
        <Type.Caption color="neutral2" maxWidth={300}>
          The size is include leverage, Maximum size per exchange.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-referral">
        <Type.Caption color="neutral2" maxWidth={300}>
          The size is include leverage, Maximum size per exchange.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="hot-trader">
        <Type.Caption color="neutral2" maxWidth={300}>
          Max trade size when copying top-performing traders.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-platform">
        <Type.Caption color="neutral2" maxWidth={300}>
          More powerful tools to management.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-source-copy">
        <Type.Caption color="neutral2" maxWidth={300}>
          Early access to our data indexing.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="on-chain-trader-for-copying">
        <Type.Caption color="neutral2" maxWidth={300}>
          Traders available for copying on PerpDEX. VIP users get early access to new DEXs.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="trader-to-copying">
        <Type.Caption color="neutral2" maxWidth={300}>
          No limit on the number of traders you can copy.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="total-copy-size-limit">
        <Type.Caption color="neutral2" maxWidth={300}>
          The maximum amount you can allocate across copied trades.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="cex-account-connection">
        <Type.Caption color="neutral2" maxWidth={300}>
          Connect your CEX account for copy trading. VIP users get exclusive CEX options.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="track-alert-signal">
        <Type.Caption color="neutral2" maxWidth={300}>
          The number of traders you can receive trade signals from.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-exclusive-signal">
        <Type.Caption color="neutral2" maxWidth={300}>
          VIP users get access to private trading signals and API integration.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="license-signal">
        <Type.Caption color="neutral2" maxWidth={300}>
          Signals are for personal use only.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="channel-alert">
        <Type.Caption color="neutral2" maxWidth={300}>
          Receive trade alerts via direct messages, groups, or webhooks.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="custom-alert">
        <Type.Caption color="neutral2" maxWidth={300}>
          Set your own trading alerts. More alerts mean greater flexibility.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="switch-alert">
        <Type.Caption color="neutral2" maxWidth={300}>
          Automatically turn alerts on or off. And switch between bots with each other.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="hyperliquid-alert">
        <Type.Caption color="neutral2" maxWidth={300}>
          Get trade alerts for HyperLiquid traders. VIP users get real-time alerts.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="alpha-group-access">
        <Type.Caption color="neutral2" maxWidth={300}>
          VIP users get access to exclusive trading communities.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="export-data-csv">
        <Type.Caption color="neutral2" maxWidth={300}>
          Download your trading data. Higher limits for Premium & VIP users.
        </Type.Caption>
      </Tooltip>
    </>
  )
}

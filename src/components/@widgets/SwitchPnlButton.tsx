import { Trans } from '@lingui/macro'

import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import SwitchInput from 'theme/SwitchInput'
import { Box, Flex, Type } from 'theme/base'

export const SwitchPnlButton = () => {
  const { pnlWithFeeEnabled, setPnlWithFeeEnabled } = useUserPreferencesStore((s) => ({
    pnlWithFeeEnabled: s.pnlWithFeeEnabled,
    setPnlWithFeeEnabled: s.setPnlWithFeeEnabled,
  }))

  const handleToggle = () => {
    setPnlWithFeeEnabled(!pnlWithFeeEnabled)
  }

  return (
    <Flex alignItems="center" p="10px">
      <Flex alignItems="center">
        <Box mr={1}>
          <SwitchInput
            defaultActive={pnlWithFeeEnabled}
            isManual
            isActive={pnlWithFeeEnabled}
            onChange={handleToggle}
          />
        </Box>
        <Type.Caption color="neutral2" ml={1} sx={{ width: 200 }}>
          PnL & ROI include trading fees
        </Type.Caption>
      </Flex>
    </Flex>
  )
}
type PnlTitleProps = {
  type?: 'upper' | 'lower'
  color?: string
  character?: string
}

export const PnlTitle = ({ type = 'upper', color = 'neutral1', character }: PnlTitleProps) => {
  // const pnlWithFeeEnabled = useGlobalStore((s) => s.pnlSettings.pnlWithFeeEnabled)

  // const text = pnlWithFeeEnabled ? 'PnL*' : 'PnL'

  if (type === 'lower') {
    return (
      <Type.Caption color={color} sx={{ flexShrink: 0 }}>
        {/* {text} */}
        {/* PnL{pnlWithFeeEnabled && <Superscript>wf</Superscript>} */}
        PnL
        {character}
      </Type.Caption>
    )
  }

  return <Trans>PNL</Trans>

  // return <>{pnlWithFeeEnabled ? <Trans>PNL*</Trans> : <Trans>PNL</Trans>}</>
}

export const PnlTitleWithTooltip = () => {
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)

  const tooltipText = pnlWithFeeEnabled ? (
    <Trans>
      The overall profit or loss <Type.Caption color="primary1">including fees</Type.Caption> generated from the trades
    </Trans>
  ) : (
    <Trans>
      The overall profit or loss <Type.Caption color="primary1">excluding fees</Type.Caption> generated from the trades
    </Trans>
  )

  return (
    <LabelWithTooltip id="tt_pnl_label" tooltip={tooltipText}>
      <PnlTitle />
    </LabelWithTooltip>
  )
}

// const Superscript = ({ children }: { children: React.ReactNode }) => (
//   <span
//     style={{
//       fontSize: '0.75em',
//       position: 'relative',
//       top: '-0.4em',
//       marginLeft: 2,
//     }}
//   >
//     {children}
//   </span>
// )

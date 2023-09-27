import { Type } from 'theme/base'

export const volumeProtectionContent = (
  <Type.Caption>
    You setup volume protection with lookback orders is 10 and copy Alice&apos;s trades. When Alice opens a new
    position, the system calculates the average volume of the 10 latest orders of Alice (Ex: the average volume is
    1000$). If Alice&apos;s order volume is less than 1000$ (Ex: 100$, 1/10 of the average volume), the system opens the
    order by 1/10 compared to the copy trade volume
  </Type.Caption>
)

export const volumeMultiplierContent = (
  <Type.Caption>
    You configure the max volume multiplier three times (x3), and the amount per order is $100. If the trader opens a
    new position or increases a position, the maximum volume of the position you are copying is $300 ($100 x 3). Any new
    trading volume of this trader that exceeds this threshold will not be executed
  </Type.Caption>
)

export const maxPositionsContent = (
  <Type.Caption>The maximum number of positions that can be opened at the same time per API Key</Type.Caption>
)

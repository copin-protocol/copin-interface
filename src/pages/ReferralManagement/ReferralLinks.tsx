import { ReactNode } from 'react'

import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Type } from 'theme/base'
import { addressShorten } from 'utils/helpers/format'

import { getReferralLink } from './helpers'

export default function ReferralLinks({ referralCode }: { referralCode: string }) {
  const refLink = getReferralLink(referralCode)
  return (
    <Box
      sx={{
        width: '100%',
        backgroundImage: 'linear-gradient(90deg, #A9AFFF 0%, #FFAEFF 100%)',
        p: '1px',
        mb: 3,
      }}
    >
      <Box sx={{ bg: 'neutral6', p: 12 }}>
        <Item label={'REFERRAL ID'} value={referralCode} valueText={referralCode} />

        <Box mb={12} />

        <Item label={'REFERRAL LINK'} value={refLink} valueText={addressShorten(refLink, 10, 15)} />
      </Box>
    </Box>
  )
}
function Item({
  label,
  valueText,
  value,
  additionComponent,
}: {
  label: ReactNode
  value: string
  valueText: ReactNode
  additionComponent?: ReactNode
}) {
  return (
    <Flex
      sx={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Type.Caption color="neutral3">{label}</Type.Caption>
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Type.Caption>{valueText}</Type.Caption>
        {additionComponent}
        <CopyButton
          variant="ghost"
          iconSize={20}
          value={value}
          sx={{ p: 0, color: 'neutral3', '&:hover:not(:disabled)': { color: 'neutral2' } }}
        />
      </Flex>
    </Flex>
  )
}

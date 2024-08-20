/* eslint-disable react/jsx-key */
import { Trans } from '@lingui/macro'
import Dayjs from 'dayjs'
import { ReactNode } from 'react'

import defaultNft from 'assets/images/default-nft.webp'
import vipNft from 'assets/images/vip-nft.webp'
import { GradientText } from 'components/@ui/GradientText'
import { UserSubscriptionData } from 'entities/user'
import useCountdown from 'hooks/helpers/useCountdown'
import { Box, Image, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function NFTSubscriptionCard({
  data,
  action,
}: {
  data?: Partial<UserSubscriptionData>
  action?: ReactNode
}) {
  const nftImageSrc = data?.tierId === SubscriptionPlanEnum.VIP ? vipNft : defaultNft
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', p: 3 }}>
      <CardDecorators />
      <Box sx={{ position: 'relative' }}>
        <Image
          src={nftImageSrc}
          sx={{ width: '100%', maxWidth: '368px', height: 'auto', mx: 'auto', display: 'block' }}
        />
        <Type.H4 mt={3} sx={{ textAlign: 'center' }}>
          <GradientText>
            <Trans>Copin Subscription {data?.tokenId ? `#${data.tokenId}` : 'NFT'}</Trans>
          </GradientText>
        </Type.H4>
        {!!data?.expiredTime && <ExpireCountdown expiredTime={data.expiredTime} />}
        {action}
      </Box>
    </Box>
  )
}

function ExpireCountdown({ expiredTime }: { expiredTime: string }) {
  const timer = useCountdown(Dayjs.utc(expiredTime).valueOf())
  return (
    <Type.Body mt={1} mb={2} color="orange1" textAlign="center" display="block">
      {!!timer?.hasEnded && <Trans>Your NFT is expired</Trans>}
      {!timer?.hasEnded && (
        <>
          {Number(timer?.days) > 1 && <Trans>Your NFT expires in {timer?.days} days</Trans>}
          {Number(timer?.days) === 1 && <Trans>Your NFT expires in {timer?.days} day</Trans>}
          {Number(timer?.days) < 1 && (
            <Trans>
              Your NFT expires in {timer?.hours}h {timer?.minutes}m {timer?.seconds}s
            </Trans>
          )}
        </>
      )}
    </Type.Body>
  )
}

function CardDecorators() {
  return (
    <>
      <Box sx={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, mixBlendMode: 'soft-light' }} />
      {/* Light */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          width: '300px',
          height: '155px',
          borderRadius: '200px',
          background: 'radial-gradient(75.94% 115.68% at 73.2% 6.65%, #FFF 0%, #3EA2F4 27.6%, #423EF4 100%)',
          filter: 'blur(85.5px)',
        }}
      />
      {/* Glass */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          borderRadius: '4px',
          border: '0.5px solid',
          borderColor: 'neutral4',
          background:
            'linear-gradient(259deg, rgba(62, 162, 244, 0.05) 4.64%, rgba(0, 0, 0, 0.10) 64.5%, rgba(66, 62, 244, 0.04) 99.63%)',
          backdropFilter: 'blur(8px)',
        }}
      />
    </>
  )
}

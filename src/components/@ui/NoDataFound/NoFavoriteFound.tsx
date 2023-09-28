import noFavorite from 'assets/images/no-favorite.png'
import CenterItemContainer from 'components/@ui/Container/CenterItemContainer'
import { Image, Type } from 'theme/base'
import { linearGradient3 } from 'theme/colors'

export default function NoFavoriteFound() {
  return (
    <CenterItemContainer sx={{ color: 'neutral3', backgroundImage: linearGradient3 }}>
      <Image src={noFavorite} width={263} />
      <Type.CaptionBold color="neutral1" display="block" mt={40} fontWeight={600}>
        Looks like you don&apos;t have any favorite traders
      </Type.CaptionBold>
      <Type.Caption mt={1}>Hovering in your interested trader then click “Star”</Type.Caption>
    </CenterItemContainer>
  )
}

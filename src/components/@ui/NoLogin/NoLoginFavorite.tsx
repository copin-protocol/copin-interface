import { PlugsConnected } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import CenterItemContainer from 'components/@ui/Container/CenterItemContainer'
import { useClickLoginButton } from 'components/LoginAction'
import { Button } from 'theme/Buttons'
import { Type } from 'theme/base'
import { linearGradient3 } from 'theme/colors'

export default function NoLoginFavorite() {
  const { md } = useResponsive()
  const handleClickLogin = useClickLoginButton()
  return (
    <CenterItemContainer sx={{ color: 'neutral3', backgroundImage: linearGradient3 }}>
      <PlugsConnected size={md ? 90 : 48} />
      <Type.CaptionBold color="neutral1" display="block" mt={40} fontWeight={600}>
        Please{' '}
        <Button variant="ghostPrimary" sx={{ p: 0 }} onClick={handleClickLogin}>
          login
        </Button>{' '}
        to save your favorite traders
      </Type.CaptionBold>
      <Type.Caption mt={1}>This feature is only available if you are logged in</Type.Caption>
    </CenterItemContainer>
  )
}

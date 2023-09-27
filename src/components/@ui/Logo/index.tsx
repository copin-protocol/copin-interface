// import { useResponsive } from '@umijs/hooks'
import logoText from 'assets/logo-text.svg'
import logo from 'assets/logo.svg'
// import { useIsDarkMode } from 'hooks/setting/useDarkMode'
import { Box, Image } from 'theme/base'

const Logo = ({ size = 32 }: { size?: number | number[] }) => {
  // const responsive = useResponsive()
  // const isDarkMode = useIsDarkMode()
  return (
    // <Image src={`/images/logo${responsive.md ? '' : '-mobile'}-${isDarkMode ? 'dark' : 'light'}.svg`} height="36px" />
    <Box height={size}>
      <Image src={logo} height="100%" />
    </Box>
  )
}
export const LogoText = ({ size = 32 }: { size?: number | number[] }) => {
  // const responsive = useResponsive()
  // const isDarkMode = useIsDarkMode()
  return (
    // <Image src={`/images/logo${responsive.md ? '' : '-mobile'}-${isDarkMode ? 'dark' : 'light'}.svg`} height="36px" />
    <Box height={size} display={['none', 'block']}>
      <Image src={logoText} />
    </Box>
  )
}

export default Logo

import { CaretLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import TopOpenPositions from 'components/TopOpeningPositions'
import SwitchProtocols from 'pages/Home/SwitchProtocols'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, Type } from 'theme/base'

const TopOpenings = () => {
  // const { protocol } = useProtocolStore()
  return (
    <>
      <CustomPageTitle title="Top Opening Positions" />
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Flex px={2} py={3} sx={{ gap: 2 }} alignItems="center" flexWrap="wrap">
          <Link to="/">
            <IconButton color="neutral1" icon={<CaretLeft size={24} />} variant="ghost" />
          </Link>
          <Type.H5>Top Opening Positions on</Type.H5>
          {/*<ProtocolLogo*/}
          {/*  pl={1}*/}
          {/*  size={24}*/}
          {/*  protocol={protocol}*/}
          {/*  textSx={{ fontSize: '24px', fontWeight: 'bold', color: 'neutral1' }}*/}
          {/*/>*/}
          <SwitchProtocols
            buttonSx={{ border: 'none', px: 0, pt: 0, pb: 0 }}
            textSx={{ fontSize: '16px', fontWeight: 'bold' }}
          />
        </Flex>
        <Box sx={{ flex: '1 0 0' }}>
          <TopOpenPositions />
        </Box>
      </Flex>
    </>
  )
}

export default TopOpenings

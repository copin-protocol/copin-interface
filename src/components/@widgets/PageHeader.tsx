import { useResponsive } from 'ahooks'
import { ComponentType, ReactNode, useEffect } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { ProtocolFilter } from 'components/@ui/ProtocolFilter'
import { HomeSwitchProtocols, RouteSwitchProtocol } from 'components/@widgets/SwitchProtocols'
import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useTradersContext from 'pages/Explorer/useTradersContext'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'

export default function PageHeader({
  pageTitle,
  headerText,
  showOnMobile = false,
  icon: Icon,
  routeSwitchProtocol = false,
  keepSearchOnSwitchProtocol = true,
  showSelectProtocol = true,
  useNewCode = false,
}: {
  pageTitle: string
  headerText: ReactNode
  showOnMobile?: boolean
  icon: ComponentType<any>
  keepSearchOnSwitchProtocol?: boolean
  routeSwitchProtocol?: boolean
  showSelectProtocol?: boolean
  useNewCode?: boolean
}) {
  const { selectedProtocols, checkIsProtocolChecked, handleToggleProtocol, setSelectedProtocols, urlProtocol } =
    useTradersContext()
  const { md } = useResponsive()

  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const renderProtocolSelection = () => {
    if (useNewCode) {
      return (
        <ProtocolFilter
          selectedProtocols={urlProtocol ? [urlProtocol] : selectedProtocols}
          checkIsProtocolChecked={checkIsProtocolChecked}
          handleToggleProtocol={handleToggleProtocol}
          setSelectedProtocols={setSelectedProtocols}
          allowList={allowList}
        />
      )
    }

    {
      /*TODO: REMOVE OLD CODE LATER */
    }
    return routeSwitchProtocol ? (
      <RouteSwitchProtocol keepSearch={keepSearchOnSwitchProtocol} />
    ) : (
      <HomeSwitchProtocols buttonSx={{ border: 'none', borderLeft: 'small', borderLeftColor: 'neutral4' }} />
    )
  }

  return (
    <>
      <CustomPageTitle title={pageTitle} />
      <Box
        display={showOnMobile ? 'flex' : ['none', 'none', 'flex']}
        sx={{
          width: '100%',
          pl: 3,
          pr: showOnMobile && !md ? 3 : 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          gap: 2,
          height: 48,
          flexShrink: 0,
        }}
      >
        <Flex
          sx={{
            width: '100%',
            gap: 2,
            alignItems: 'center',
            color: 'neutral1',
            flex: 1,
          }}
        >
          <IconBox icon={<Icon size={24} weight="fill" />} />
          <Type.Body sx={{ flex: 1, flexShrink: 0, fontWeight: 500 }}>{headerText}</Type.Body>
        </Flex>
        {/* {showSelectProtocol && (
          <>
            {routeSwitchProtocol ? (
              <RouteSwitchProtocol keepSearch={keepSearchOnSwitchProtocol} />
            ) : (
              <HomeSwitchProtocols buttonSx={{ border: 'none', borderLeft: 'small', borderLeftColor: 'neutral4' }} />
            )}
          </>
        )} */}

        {renderProtocolSelection()}
      </Box>
    </>
  )
}

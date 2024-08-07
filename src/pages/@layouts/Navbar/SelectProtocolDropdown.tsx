import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import CrossTag from 'assets/images/cross_tag.svg'
import NewTag from 'assets/images/new_tag.svg'
import ActiveDot from 'components/@ui/ActiveDot'
import { ChainWithLabel } from 'components/@ui/ChainLogo'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { getProtocolConfigs } from 'components/SwitchProtocols/helpers'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { ALLOWED_PROTOCOLS } from 'pages/Home/configs'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { compactNumber } from 'utils/helpers/format'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'

import { useProtocolsStatisticContext } from '../ProtocolsStatisticContext'

const DELAY = 360

export default function SelectProtocolDropdown({
  children,
  routeFactory,
}: {
  children: ReactNode
  routeFactory: (protocol: ProtocolEnum) => string
}) {
  const protocols = useGetProtocolOptions()
  const protocolConfigs = useMemo(() => getProtocolConfigs(protocols), [protocols])

  const { protocol: storedProtocol } = useProtocolStore()
  const storedChainId = useMemo(() => {
    return protocols.find((option) => option.id === storedProtocol)?.chainId ?? DEFAULT_CHAIN_ID
  }, [protocols, storedProtocol])

  const [currentChainId, setCurrentChainId] = useState(storedChainId)

  const timeoutRef = useRef<NodeJS.Timeout[] | null>(null)
  const onMouseEnterChainItem = useCallback((chainId: number) => {
    const timeout = setTimeout(() => {
      setCurrentChainId(chainId)
    }, DELAY)
    timeoutRef.current = [...(timeoutRef.current ?? []), timeout]
  }, [])

  const onMouseLeaveItem = useCallback(() => {
    if (timeoutRef.current?.length) {
      timeoutRef.current.forEach((timeout) => {
        clearTimeout(timeout)
      })
      timeoutRef.current = null
      return
    }
  }, [storedChainId])
  const onMouseLeaveMenu = useCallback(() => {
    if (timeoutRef.current?.length) {
      timeoutRef.current.forEach((timeout) => {
        clearTimeout(timeout)
      })
      timeoutRef.current = null
      return
    }
    setCurrentChainId(storedChainId)
  }, [storedChainId])

  const { data: protocolsStatistic } = useProtocolsStatisticContext()

  const menu = useMemo(() => {
    return (
      <Flex onMouseLeave={onMouseLeaveMenu}>
        <Flex
          sx={{
            flexDirection: 'column',
            gap: 1,
            width: 200,
            p: 2,
            bg: 'neutral7',
            borderLeft: 'small',
            borderBottom: 'small',
            borderColor: 'neutral4',
          }}
        >
          {protocolConfigs.chainOptions.map((chainOption) => {
            const protocols = protocolConfigs.protocolsByChains[chainOption.chainIdNumber] ?? []
            const protocolCount = protocols.length
            if (!protocolCount) return null
            const isActiveChain = storedChainId === chainOption.chainIdNumber
            return (
              <Flex
                key={chainOption.label}
                color={isActiveChain ? 'primary1' : 'neutral1'}
                sx={{
                  height: 40,
                  px: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '4px',
                  '&:hover': { bg: 'neutral5' },
                  bg: isActiveChain ? 'neutral4' : 'transparent',
                }}
                onMouseEnter={() => onMouseEnterChainItem(chainOption.chainIdNumber)}
                onMouseLeave={onMouseLeaveItem}
              >
                <ChainWithLabel label={`${chainOption.label} (${protocolCount})`} icon={chainOption.icon} />
                <IconBox icon={<CaretRight />} color="neutral1" />
              </Flex>
            )
          })}
        </Flex>
        <Box
          sx={{
            p: 2,
            bg: 'neutral6',
            width: 200,
            borderRight: 'small',
            borderBottom: 'small',
            borderColor: 'neutral4',
          }}
        >
          {protocolConfigs.protocolsByChains[currentChainId]?.map((protocol) => {
            const isActiveProtocol = storedProtocol === protocol.id
            const protocolStatistic = protocolsStatistic?.[protocol.id]
            return (
              <Box key={protocol.id} as={Link} to={routeFactory(protocol.id)} sx={{ color: 'inherit' }}>
                <Flex
                  sx={{
                    width: '100%',
                    height: 52,
                    px: 2,
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: '4px',
                    color: 'neutral3',
                    bg: isActiveProtocol ? 'neutral4' : 'transparent',
                    '&:hover': { bg: 'neutral4', color: 'neutral1' },
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <ProtocolLogo protocol={protocol.id} isActive={isActiveProtocol} hasText={false} size={32} />
                  </Box>
                  <Box sx={{ flex: '1' }}>
                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
                      <Type.Caption
                        color={isActiveProtocol ? 'primary1' : 'inherit'}
                        sx={{ display: 'block', textAlign: 'left' }}
                      >
                        {protocol.text}
                      </Type.Caption>
                      {ALLOWED_PROTOCOLS.includes(protocol.id) && (
                        <ActiveDot
                          tooltipId={`tt_allow_copy_${protocol.id}`}
                          tooltipContent={<Trans>Allow Copy</Trans>}
                        />
                      )}
                      {protocol.isCross ? (
                        <img src={CrossTag} alt="cross" />
                      ) : protocol.isNew ? (
                        <img src={NewTag} alt="new" />
                      ) : (
                        <></>
                      )}
                    </Flex>
                    <Type.Small
                      mt={1}
                      color={isActiveProtocol ? 'neutral1' : 'inherit'}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        lineHeight: '16px',
                      }}
                    >
                      <Box as="span">{compactNumber(protocolStatistic?.traders ?? 0, 2, true)} Traders</Box>
                      {/* <Box as="span">{compactNumber(protocolStatistic?.oi ?? 0, 2)} OI</Box> */}
                    </Type.Small>
                  </Box>
                </Flex>
              </Box>
            )
          })}
        </Box>
      </Flex>
    )
  }, [
    protocolConfigs.chainOptions,
    protocolConfigs.protocolsByChains,
    currentChainId,
    storedChainId,
    protocolsStatistic,
  ])
  return (
    <Dropdown menu={menu} placement="bottom">
      <Flex sx={{ height: '100%', alignItems: 'center', gap: 1 }}>{children}</Flex>
    </Dropdown>
  )
}

function Dropdown({
  children,
  menu,
  placement,
}: {
  children: ReactNode
  menu: ReactNode
  placement: 'right' | 'bottom'
}) {
  let stylesContent = {}
  switch (placement) {
    case 'bottom':
      stylesContent = {
        // pt: '2px',
        pt: '2px',
        top: '100%',
        left: 0,
      }
      break
    case 'right':
      stylesContent = {
        // pl: '2px',
        top: 0,
        left: '100%',
      }
      break
  }

  const [showMenu, setShowMenu] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(true)
      timeoutRef.current = null
    }, DELAY)
  }, [])
  const onMouseLeave = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      return
    }
    setShowMenu(false)
  }, [])
  return (
    <Box
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      sx={{
        color: 'neutral1',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        position: 'relative',
        '& .dropdown-content': {
          // display: 'none',
          position: 'absolute',
          minWidth: 'max-content',
          ...stylesContent,
          zIndex: 1,
        },
        // '&:hover': {
        //   '& > .dropdown-content': {
        //     display: 'block',
        //   },
        // },
      }}
    >
      <Box className="dropdown-content" display={showMenu ? 'block' : 'none'}>
        {menu}
      </Box>
      <Box height="100%" sx={{ svg: { transition: '0.3s', transform: showMenu ? 'rotate(180deg)' : 'rotate(0)' } }}>
        {children}
      </Box>
    </Box>
  )
}

// export default function SelectProtocolDropdown({ children }: { children: ReactNode }) {
//   const protocols = useGetProtocolOptions()
//   const protocolConfigs = useMemo(() => getProtocolConfigs(protocols), [protocols])
//   const menu = useMemo(() => {
//     return (
//       <Box sx={{ py: 2, bg: 'neutral7', border: 'small', borderColor: 'neutral4' }}>
//         {protocolConfigs.chainOptions.map((chainOption) => {
//           const protocols = protocolConfigs.protocolsByChains[chainOption.chainIdNumber] ?? []
//           const protocolCount = protocols.length
//           if (!protocolCount) return null
//           return (
//             <Dropdown
//               key={chainOption.label}
//               placement="right"
//               menu={
//                 <Box sx={{ p: 2, width: 300, border: 'small', borderColor: 'neutral4', bg: 'neutral6' }}>
//                   {protocols.map((protocol) => {
//                     return (
//                       <Box key={protocol.id}>
//                         <Flex
//                           sx={{
//                             width: '100%',
//                             height: 52,
//                             px: 2,
//                             alignItems: 'center',
//                             gap: 2,
//                             borderRadius: '4px',
//                             '&:hover': { bg: 'neutral4' },
//                           }}
//                         >
//                           <ProtocolLogo protocol={protocol.id} isActive={false} hasText={false} size={32} />
//                           <Box>
//                             <Type.Caption mb={2}>{protocol.text}</Type.Caption>
//                             <Type.Caption sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
//                               <Box as="span">{compactNumber(123123123)} Trader</Box>
//                               <Box as="span">{compactNumber(123123123)} OI</Box>
//                             </Type.Caption>
//                           </Box>
//                         </Flex>
//                       </Box>
//                     )
//                   })}
//                 </Box>
//               }
//             >
//               <Box sx={{ px: 2 }}>
//                 <Flex
//                   sx={{ height: 40, px: 2, alignItems: 'center', borderRadius: '4px', '&:hover': { bg: 'neutral4' } }}
//                 >
//                   <ChainWithLabel label={`${chainOption.label} (${protocolCount})`} icon={chainOption.icon} />
//                 </Flex>
//               </Box>
//             </Dropdown>
//           )
//         })}
//       </Box>
//     )
//   }, [protocolConfigs.chainOptions, protocolConfigs.protocolsByChains])
//   return (
//     <Dropdown menu={menu} placement="bottom">
//       {children}
//     </Dropdown>
//   )
// }

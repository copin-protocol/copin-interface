import { Trans } from '@lingui/macro'
import { ArrowElbowLeftUp, ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ComponentProps, Suspense, lazy, useState } from 'react'
import { useLocation } from 'react-router-dom'

import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

const ViewComparison = lazy(() => import('pages/ComparingTraders/ViewComparison'))

export default function PickTradersButton({
  listAddress,
  handleClick,
  type = 'home',
  enableCompare = false,
}: {
  listAddress: string[] | undefined
  handleClick: () => void
  type?: 'home' | 'backtest'
  enableCompare?: boolean
}) {
  const noSelectTitle = type === 'home' ? 'Select to backtest / compare' : 'Select trader to set strategy'
  const buttonTitle = type === 'home' ? 'Backtest' : 'Set Strategy'
  const sx =
    type === 'home'
      ? {}
      : {
          px: 1,
          '& > div': {
            gap: 1,
            justifyContent: ['start', 'center'],
            '& > div': {
              gap: 1,
            },
          },
        }
  const { lg } = useResponsive()

  return (
    <>
      {listAddress?.length ? (
        <>
          {enableCompare && lg ? (
            <Flex
              sx={{
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderRadius: 0,
                py: 0,
                px: 1,
                flexShrink: 0,
                '&:hover': {
                  color: 'primary2',
                },
              }}
            >
              <Flex sx={{ alignItems: 'center', gap: 2, width: '100%' }}>
                <Box color="neutral1">
                  <AvatarGroup addresses={listAddress} limit={3} size={24} />
                </Box>
                <Flex sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Type.CaptionBold
                    role="button"
                    onClick={handleClick}
                    color="primary1"
                    sx={{ '&:hover': { color: 'primary2' } }}
                  >
                    {buttonTitle} {`(${listAddress.length})`}
                  </Type.CaptionBold>
                  <CompareButton listAddress={listAddress} />
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Button
              variant="primary"
              sx={{
                color: 'neutral7',
                width: '100%',
                height: '100%',
                borderRadius: 0,
                py: 0,
                px: 12,
                flexShrink: 0,
                ...sx,
              }}
              onClick={handleClick}
            >
              <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                <Box color="neutral1">
                  <AvatarGroup addresses={listAddress} limit={3} />
                </Box>
                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                  <Type.CaptionBold>
                    {buttonTitle} {`(${listAddress.length})`}
                  </Type.CaptionBold>
                  <ArrowRight size={16} />
                </Flex>
              </Flex>
            </Button>
          )}
        </>
      ) : (
        <Flex
          width="100%"
          height="100%"
          sx={{
            alignItems: 'center',
            gap: 2,
            px: 3,
            flexShrink: 0,
            borderRight: 'small',
            borderColor: ['transparent', 'neutral4'],
          }}
          color="neutral3"
        >
          <ArrowElbowLeftUp size={16} />
          <Type.Caption>{noSelectTitle}</Type.Caption>
        </Flex>
      )}
    </>
  )
}

function CompareButton({ listAddress }: { listAddress: string[] | undefined }) {
  const { pathname, search } = useLocation()
  const { searchParams } = useSearchParams()
  const time = searchParams[URL_PARAM_KEYS.EXPLORER_TIME_FILTER] ?? TimeFilterByEnum.S30_DAY
  const protocol = useProtocolStore((state) => state.protocol)
  const [isOpen, setIsOpen] = useState(false)

  if (listAddress?.length !== 2) return <></>

  const handleClick = () => {
    window.history.replaceState(
      null,
      '',
      `${ROUTES.COMPARING_TRADERS.path}?time=${time}&${URL_PARAM_KEYS.COMPARE_TRADERS}=${listAddress.join('_')}&${
        URL_PARAM_KEYS.COMPARE_PROTOCOLS
      }=${protocol}_${protocol}`
    )
    setIsOpen(true)
  }
  const handleDismiss = () => {
    const _searchParams = new URLSearchParams(search)
    const url = `${pathname}?${_searchParams}`
    window.history.replaceState(null, '', url)
    setIsOpen(false)
  }

  const timeOption = TIME_FILTER_OPTIONS.find((option) => option.id === time) ?? TIME_FILTER_OPTIONS[0]
  const tradersData = listAddress.map((address) => ({ account: address, protocol })) as ComponentProps<
    typeof ViewComparison
  >['traders']

  return (
    <>
      <Box sx={{ width: '1px', height: '16px', bg: 'neutral4' }} />
      <Type.CaptionBold role="button" color="primary1" sx={{ '&:hover': { color: 'primary2' } }} onClick={handleClick}>
        <Trans>Compare</Trans>
      </Type.CaptionBold>
      <Suspense fallback={<></>}>
        <ViewComparison isOpen={isOpen} onDismiss={handleDismiss} traders={tradersData} timeOption={timeOption} />
      </Suspense>
    </>
  )
}

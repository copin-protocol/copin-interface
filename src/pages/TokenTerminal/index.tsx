import { Trans } from '@lingui/macro'
import { Coin } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useCallback, useMemo, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'

import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import NotFound from 'components/@ui/NotFound'
import PageHeader from 'components/@widgets/PageHeader'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { PositionData } from 'entities/trader'
import { useIsIF } from 'hooks/features/subscription/useSubscriptionRestrict'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import FilterGroupBookmarkTag from 'pages/DailyTrades/FilterTags/FilterGroupBookmarkTag'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import PageTitle from 'theme/PageTitle'
import Picker from 'theme/Picker'
import { Box, Flex } from 'theme/base'
import { BOOKMARK_NO_GROUP_KEY, PAGE_TITLE_HEIGHT } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

import DirectionalSection from './DirectionalSection'
import OpenInterestSection from './OpenInterestSection'
import TokenDropdown from './TokenDropdown'

const SIZE_PICKER_OPTIONS = [
  { label: 'All', value: '' },
  { label: '1K-100K', value: '1000_100000' },
  { label: '100k-10M', value: '100000_10000000' },
  { label: '10M-100M', value: '10000000_100000000' },
  { label: '100M+', value: '100000000_' },
]

const SIDE_PICKER_OPTIONS = [
  { label: 'Long', value: 'LONG' },
  { label: 'Short', value: 'SHORT' },
]

export default function TokenTerminalPage() {
  const { token } = useParams<{ token: string }>()
  const isIF = useIsIF()
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG')
  const { md } = useResponsive()
  const { searchParams, setSearchParams } = useSearchParams()
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const sizeParams = searchParams.size || SIZE_PICKER_OPTIONS[0].value
  const { bookmarks } = useTraderFavorites()
  const currentGroupId = searchParams.groupId as string | undefined
  const changeGroupId = useCallback(
    (groupId: string | undefined) =>
      setSearchParams({ groupId, ['ordersPage']: undefined, ['positionsPage']: undefined }),
    [setSearchParams]
  )
  const { getListSymbol } = useMarketsConfig()
  const listAllSymbol = getListSymbol?.()
  const sizeFilter = useMemo(() => {
    if (!sizeParams || sizeParams === '' || !SIZE_PICKER_OPTIONS.find((s) => s.value === sizeParams)) return null
    const [gte, lte] = (sizeParams as string).split('_').map((e) => (e === '' ? undefined : e))
    return { gte, lte }
  }, [sizeParams])
  const selectedAccounts = useMemo(() => {
    if (!currentGroupId || currentGroupId === BOOKMARK_NO_GROUP_KEY || !bookmarks) return null
    return Object.keys(bookmarks)
      .filter((account) => bookmarks[account]?.customAlertIds?.includes(currentGroupId))
      .map((k) => k.split('-')[0])
  }, [currentGroupId, bookmarks])

  const handleSelectItem = useCallback((data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.pushState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes?.[0] }))
  }, [])

  const handleDismiss = () => {
    window.history.pushState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  if (!token) {
    return <Redirect to={ROUTES.HOME.path} />
  }

  if (!listAllSymbol?.includes(token)) {
    return <NotFound />
  }

  if (!isIF) {
    return (
      <Box>
        <Box
          sx={{
            width: '100%',
            pl: 3,
            pr: 0,
            alignItems: 'center',
            // justifyContent: 'space-between',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            gap: 2,
            height: PAGE_TITLE_HEIGHT,
            flexShrink: 0,
          }}
        >
          <PageTitle icon={Coin} title={<Trans>TOKEN TERMINAL</Trans>} />
        </Box>
        <Box sx={{ maxWidth: 350, pt: [100, 100, 200], mx: 'auto' }}>
          <PlanUpgradePrompt
            requiredPlan={SubscriptionPlanEnum.IF}
            showTitleIcon
            useLockIcon
            // showLearnMoreButton
            showConfirmButton={false}
            title={<Trans>Coming Soon</Trans>}
            description={<Trans>This feature is not available yet — we will announce when it is ready.</Trans>}
          />
        </Box>
      </Box>
    )
  }

  return (
    <SafeComponentWrapper>
      <PageHeader
        showOnMobile
        pageTitle={`Token Terminal`}
        headerText={<Trans>TOKEN TERMINAL</Trans>}
        icon={Coin}
        keepSearchOnSwitchProtocol={false}
        routeSwitchProtocol
        useNewCode={true}
        sx={{ pr: [12, 0, 0] }}
      />
      <Box
        width="100%"
        height={`calc(100% - ${PAGE_TITLE_HEIGHT}px)`}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Flex
          sx={{ flexDirection: 'column', gap: 1, pt: 2, justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}
        >
          <Flex
            width="100%"
            px={12}
            sx={{
              '& > *': { flex: [undefined, 1] },
              flexWrap: ['wrap', 'none'],
            }}
          >
            <Flex width={['50%', 'fit-content']} justifyContent="start" alignItems="center">
              <FilterGroupBookmarkTag
                currentGroupId={currentGroupId}
                onChangeGroupId={changeGroupId}
                allowedFilter={true}
                planToFilter={SubscriptionPlanEnum.ELITE}
              />
            </Flex>
            <Flex justifyContent="center" width="100%" order={[1, 0]}>
              <TokenDropdown token={token} tokens={listAllSymbol} groupId={currentGroupId} />
            </Flex>

            <Box
              sx={{
                '& > *': { width: 'fit-content', height: 'fit-content', gap: 2 },
                justifyContent: 'end',
                alignItems: 'center',
                display: ['none', 'none', 'none', 'flex'],
              }}
            >
              <Picker<string>
                options={SIZE_PICKER_OPTIONS}
                value={(searchParams.size as string) || SIZE_PICKER_OPTIONS[0].value}
                onChange={(size) => setSearchParams({ size })}
                size="md"
              />
            </Box>
            <Box
              display={['flex', 'flex', 'flex', 'none']}
              width={['50%', 'fit-content']}
              justifyContent="end"
              alignItems="center"
            >
              <Dropdown
                inline
                buttonVariant="ghostPrimary"
                menuSx={{ width: '150px' }}
                menu={
                  <Box>
                    {SIZE_PICKER_OPTIONS.map((s) => (
                      <DropdownItem key={s.value} onClick={() => setSearchParams({ size: s.value })}>
                        {s.label}
                      </DropdownItem>
                    ))}
                  </Box>
                }
              >
                <Box as="span" color="neutral2">
                  <Trans>Size Value:</Trans>
                </Box>{' '}
                {SIZE_PICKER_OPTIONS.find((s) => s.value === searchParams.size)?.label || 'ALL'}
              </Dropdown>
            </Box>
          </Flex>
        </Flex>
        <Flex flex="1" minHeight={800} height="100%" width="100%" flexDirection="column">
          <Box width="100%" height="350px">
            <OpenInterestSection
              token={token}
              sizeFilter={sizeFilter}
              selectedAccounts={selectedAccounts}
              onSelectItem={handleSelectItem}
            />
          </Box>
          <Box display={md ? 'none' : 'block'} py={2} mx="auto" width="fit-content">
            <Picker<string>
              options={SIDE_PICKER_OPTIONS}
              value={side}
              onChange={(side) => setSide(side as 'LONG' | 'SHORT')}
              size="md"
              itemSx={{
                width: '100px',
              }}
            />
          </Box>
          <Flex flex="1" sx={{ overflow: 'hidden', minHeight: 0, gap: 2 }}>
            {(md || side === 'LONG') && (
              <DirectionalSection
                onSelectPosition={handleSelectItem}
                token={token}
                sizeFilter={sizeFilter}
                selectedAccounts={selectedAccounts}
                isLong={true}
              />
            )}
            {(md || side === 'SHORT') && (
              <DirectionalSection
                onSelectPosition={handleSelectItem}
                token={token}
                sizeFilter={sizeFilter}
                selectedAccounts={selectedAccounts}
                isLong={false}
              />
            )}
          </Flex>
        </Flex>
      </Box>
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="top-opening-position-page"
      />
    </SafeComponentWrapper>
  )
}

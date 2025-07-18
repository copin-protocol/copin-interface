import { Trans } from '@lingui/macro'
import { Plus, Star } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'

import UpgradeModal from 'components/@subscription/UpgradeModal'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoLoginFavorite from 'components/@ui/NoLogin/NoLoginFavorite'
import TextWithEdit from 'components/@ui/TextWithEdit'
import AddGroupInput from 'components/@widgets/FavoriteButton/AddGroupInput'
import { GlobalProtocolFilter, GlobalProtocolFilterProps } from 'components/@widgets/ProtocolFilter'
import { AlertDashboardProvider } from 'hooks/features/alert/useAlertDashboardContext'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useCustomAlerts from 'hooks/features/alert/useCustomAlerts'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import { useIsElite } from 'hooks/features/subscription/useSubscriptionRestrict'
import useSearchParams from 'hooks/router/useSearchParams'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import useTraderFavorites, { parseTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { TopWrapperMobile } from 'pages/@layouts/Components'
import SortTradersDropdown from 'pages/Explorer/Layouts/SortTradersDropdown'
import { TabKeyEnum } from 'pages/Explorer/Layouts/layoutConfigs'
import TimeFilterSection, { TimeFilterDropdown } from 'pages/Explorer/TimeFilterSection'
import useTradersContext, { FilterTradersProvider } from 'pages/Explorer/useTradersContext'
import Badge from 'theme/Badge'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Loading from 'theme/Loading'
import PageTitle from 'theme/PageTitle'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { BOOKMARK_GROUP_NAME_MAX_LENGTH, BOOKMARK_NO_GROUP_KEY, PAGE_TITLE_HEIGHT } from 'utils/config/constants'
import { AlertCustomType, SubscriptionFeatureEnum } from 'utils/config/enums'

import ListTraderFavorites from './ListTraderFavorites'
import { Actions, GroupItem } from './components'

const BookmarksPage = () => {
  const { pathname } = useSearchParams()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { traderFavorites, bookmarks, isLoading } = useTraderFavorites()
  const { searchParams, setSearchParams } = useSearchParams()
  const { bookmarkGroups } = useBotAlertContext()
  const [isOpenUpgradeModal, setIsOpenUpgradeModal] = useState(false)
  const { watchedListQuota, bookmarkGroupsQuota, maxBookmarkGroupsQuota } = useAlertPermission()

  const { deleteCustomAlert, updateCustomAlert } = useCustomAlerts({
    onSuccess: (data) => {
      setSearchParams({ groupId: data?.id ?? BOOKMARK_NO_GROUP_KEY })
    },
    deleteSuccessMsg: <Trans>Group deleted successfully</Trans>,
    updateSuccessMsg: <Trans>Group updated successfully</Trans>,
  })
  const { isAuthenticated, profile } = useAuthContext()
  const isElite = useIsElite()
  const { md } = useResponsive()
  const [isEditMode, setIsEditMode] = useState(false)
  const [creatingGroup, setCreatingGroup] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!searchParams.groupId) {
      const latestBookmark = Object.values(bookmarks).sort((a, b) => (b.lastAddedAt ?? 0) - (a.lastAddedAt ?? 0))?.[0]
      if (latestBookmark) {
        setSearchParams({ groupId: latestBookmark.customAlertIds?.[0] ?? BOOKMARK_NO_GROUP_KEY })
      } else {
        setSearchParams({ groupId: BOOKMARK_NO_GROUP_KEY })
      }
    }
  }, [searchParams.groupId, bookmarks, isLoading])

  const protocolFilterProps: GlobalProtocolFilterProps = useMemo(
    () => ({
      placement: md ? 'bottom' : 'bottomRight',
      menuSx: { width: ['300px', '400px', '50vw', '50vw'] },
    }),
    [md]
  )

  const groups = useMemo(() => {
    return bookmarkGroups?.filter((alert) => alert.type === AlertCustomType.TRADER_BOOKMARK)
  }, [bookmarkGroups])

  const accounts = useMemo(() => {
    if (selectedProtocols == null) return []
    return traderFavorites
      .filter((value) => {
        const protocolValid = selectedProtocols.includes(parseTraderFavoriteValue(value).protocol)
        if (searchParams?.groupId == BOOKMARK_NO_GROUP_KEY) {
          return protocolValid && bookmarks[value] != null && bookmarks[value]?.customAlertIds?.length === 0
        }
        return protocolValid && bookmarks[value]?.customAlertIds?.includes(searchParams?.groupId as string)
      })
      .map((value) => parseTraderFavoriteValue(value).address)
  }, [traderFavorites, selectedProtocols, searchParams?.groupId, bookmarks])

  const totalAccounts = useMemo(() => {
    return traderFavorites.filter((value) => {
      if (searchParams?.groupId == BOOKMARK_NO_GROUP_KEY) {
        return bookmarks[value] != null && bookmarks[value]?.customAlertIds?.length === 0
      }
      return bookmarks[value]?.customAlertIds?.includes(searchParams?.groupId as string)
    }).length
  }, [traderFavorites, searchParams?.groupId, bookmarks])

  const groupInfo = useMemo(() => {
    return bookmarkGroups?.find((alert) => alert.id === searchParams.groupId)
  }, [bookmarkGroups, searchParams.groupId])

  const badgeType = useMemo(() => {
    if (totalAccounts > watchedListQuota) return 'danger'
    if (totalAccounts === watchedListQuota) return 'warning'
    return 'default'
  }, [totalAccounts, watchedListQuota])

  if (selectedProtocols == null) return null

  if (!isAuthenticated || !profile?.id) return <NoLoginFavorite />
  if (isLoading || !searchParams.groupId)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return (
    <AlertDashboardProvider>
      {!!maxBookmarkGroupsQuota && (
        <UpgradeModal
          isOpen={isOpenUpgradeModal}
          onDismiss={() => {
            setIsOpenUpgradeModal(false)
          }}
          title={<Trans>You&apos;ve hit your bookmark groups limit</Trans>}
          description={
            <Trans>
              You&apos;re reach the maximum of Bookmark Groups for your current plan. Upgrade your plan to unlock access
              up to {maxBookmarkGroupsQuota} bookmark groups
            </Trans>
          }
        />
      )}
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <CustomPageTitle title="Trader Favorites" />
        <TopWrapperMobile>
          {creatingGroup ? (
            <AddGroupInput
              onCreated={(data) => {
                setCreatingGroup(false)
                if (data?.id) setSearchParams({ groupId: data.id })
              }}
              showTitle={false}
              onCanceled={() => {
                setCreatingGroup(false)
              }}
            />
          ) : (
            <>
              <PageTitle title={<Trans>TRADER GROUP BOOKMARKS</Trans>} icon={Star} />
              <ButtonWithIcon
                variant="ghostPrimary"
                sx={{ px: 0 }}
                icon={<Plus size={16} />}
                onClick={() => {
                  if (groups && groups.length >= bookmarkGroupsQuota) {
                    setIsOpenUpgradeModal(true)
                    return
                  }
                  setCreatingGroup(true)
                }}
              >
                <Trans>New Group</Trans>
              </ButtonWithIcon>
            </>
          )}
        </TopWrapperMobile>
        <Flex flex="1 0 0" flexDirection="column" height="100%">
          {md && (
            <Flex
              height={PAGE_TITLE_HEIGHT}
              pl={3}
              sx={{
                alignItems: 'center',
                columnGap: 3,
                rowGap: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              <PageTitle title={<Trans>TRADER GROUP BOOKMARKS</Trans>} icon={Star} />

              <GlobalProtocolFilter {...protocolFilterProps} />
            </Flex>
          )}
          <Box flex="1 0 0">
            <FilterTradersProvider key={pathname} tab={TabKeyEnum.Favorite} accounts={accounts}>
              <Flex width="100%" height="100%">
                <Box
                  display={['none', 'none', 'flex']}
                  width={250}
                  height="100%"
                  sx={{ borderRight: 'small', borderRightColor: 'neutral4', p: 12, flexDirection: 'column', gap: 12 }}
                >
                  {creatingGroup ? (
                    <AddGroupInput
                      onCreated={(data) => {
                        setCreatingGroup(false)
                        if (data?.id) setSearchParams({ groupId: data.id })
                      }}
                      onCanceled={() => {
                        setCreatingGroup(false)
                      }}
                      showTitle={false}
                    />
                  ) : (
                    <ButtonWithIcon
                      variant="outlinePrimary"
                      icon={<Plus size={16} />}
                      block
                      sx={{ height: 'fit-content' }}
                      onClick={() => {
                        if (groups && groups.length >= bookmarkGroupsQuota) {
                          setIsOpenUpgradeModal(true)
                          return
                        }
                        setCreatingGroup(true)
                      }}
                    >
                      <Trans>
                        New Group ({groups?.length || 0}/{bookmarkGroupsQuota})
                      </Trans>
                    </ButtonWithIcon>
                  )}
                  <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
                    <Box>
                      {groups?.map((alert) => (
                        <GroupItem
                          key={alert.id}
                          name={alert.name || ''}
                          id={alert.id}
                          isActive={searchParams?.groupId === alert.id}
                          onChangeGroup={() => {
                            setSearchParams({ groupId: alert.id })
                          }}
                          onDelete={() => {
                            deleteCustomAlert(alert.id)
                          }}
                        />
                      ))}
                      <GroupItem
                        name={'Others'}
                        isActive={searchParams?.groupId == BOOKMARK_NO_GROUP_KEY}
                        onChangeGroup={() => {
                          setSearchParams({ groupId: BOOKMARK_NO_GROUP_KEY })
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                  <Box sx={{ borderBottom: 'small', borderBottomColor: 'neutral4', p: 12 }}>
                    <Flex alignItems="center" sx={{ gap: 2 }} justifyContent="space-between">
                      {md ? (
                        <>
                          {searchParams.groupId !== BOOKMARK_NO_GROUP_KEY ? (
                            groupInfo?.name ? (
                              <Flex sx={{ gap: 1, alignItems: 'center' }}>
                                <TextWithEdit
                                  key={searchParams.groupId as string}
                                  textSx={{
                                    fontWeight: 'bold',
                                  }}
                                  maxLength={BOOKMARK_GROUP_NAME_MAX_LENGTH}
                                  fullWidth={true}
                                  defaultValue={groupInfo.name}
                                  onSave={(value) => {
                                    updateCustomAlert({
                                      id: searchParams.groupId as string,
                                      data: {
                                        name: value,
                                      },
                                    })
                                  }}
                                />
                                <Tooltip id="bookmark-count-tooltip">
                                  <Box>
                                    <Type.Caption display="block">
                                      <Trans>Number of traders in this group</Trans>
                                    </Type.Caption>
                                    {!isElite && (
                                      <Type.Caption display="block">
                                        <Trans>Some traders from higher plan are not shown</Trans>
                                      </Type.Caption>
                                    )}
                                  </Box>
                                </Tooltip>
                                <Box data-tooltip-id="bookmark-count-tooltip">
                                  <Badge count={`${totalAccounts || 0}/${watchedListQuota}`} type={badgeType} />
                                </Box>
                              </Flex>
                            ) : (
                              <></>
                            )
                          ) : (
                            <Type.CaptionBold>Others</Type.CaptionBold>
                          )}
                          <Actions
                            searchParams={searchParams}
                            groupInfo={groupInfo}
                            updateCustomAlert={updateCustomAlert}
                            deleteCustomAlert={deleteCustomAlert}
                            tradersCount={totalAccounts || 0}
                          />
                        </>
                      ) : (
                        <>
                          <Flex alignItems="center" sx={{ gap: 2, px: 1 }}>
                            {!isEditMode && (
                              <Dropdown
                                inline
                                buttonVariant="ghost"
                                menu={
                                  <Box width={200} sx={{ maxHeight: 180, overflow: 'auto' }}>
                                    {groups?.map((alert) => (
                                      <DropdownItem
                                        key={alert.id}
                                        sx={{ textTransform: 'none' }}
                                        onClick={() => {
                                          setSearchParams({ groupId: alert.id })
                                        }}
                                      >
                                        {alert.name}
                                      </DropdownItem>
                                    ))}
                                    <DropdownItem
                                      sx={{ textTransform: 'none' }}
                                      onClick={() => {
                                        setSearchParams({ groupId: BOOKMARK_NO_GROUP_KEY })
                                      }}
                                    >
                                      <Type.Caption sx={{ textTransform: 'none' }}>Others</Type.Caption>
                                    </DropdownItem>
                                  </Box>
                                }
                              >
                                <Flex sx={{ gap: 2, alignItems: 'center' }}>
                                  <Type.CaptionBold
                                    sx={{
                                      textTransform: 'none',
                                      textOverflow: 'ellipsis',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {searchParams?.groupId === BOOKMARK_NO_GROUP_KEY ? 'Others' : groupInfo?.name}
                                  </Type.CaptionBold>
                                </Flex>
                              </Dropdown>
                            )}

                            {searchParams?.groupId !== BOOKMARK_NO_GROUP_KEY && (
                              <TextWithEdit
                                key={searchParams.groupId as string}
                                defaultValue={groupInfo?.name || ''}
                                maxLength={BOOKMARK_GROUP_NAME_MAX_LENGTH}
                                formatDisplayText={(value) => ''}
                                onSave={(value) => {
                                  updateCustomAlert({
                                    id: searchParams.groupId as string,
                                    data: {
                                      name: value,
                                    },
                                  })
                                }}
                                onEditMode={(isEditMode) => {
                                  setIsEditMode(isEditMode)
                                }}
                              />
                            )}
                            {searchParams?.groupId !== BOOKMARK_NO_GROUP_KEY && (
                              <Badge count={`${totalAccounts || 0}/${watchedListQuota}`} type={badgeType} />
                            )}
                          </Flex>
                          <Actions
                            searchParams={searchParams}
                            groupInfo={groupInfo}
                            updateCustomAlert={updateCustomAlert}
                            deleteCustomAlert={deleteCustomAlert}
                            tradersCount={totalAccounts || 0}
                          />
                        </>
                      )}
                    </Flex>
                  </Box>
                  <ListTraders bookmarks={bookmarks} totalAccounts={totalAccounts} />
                </Flex>
              </Flex>
            </FilterTradersProvider>
          </Box>
        </Flex>
      </Flex>
    </AlertDashboardProvider>
  )
}

export default BookmarksPage

function ListTraders({
  bookmarks,
  totalAccounts,
}: {
  bookmarks: { [key: string]: { note?: string; customAlertIds?: string[] } }
  totalAccounts: number
}) {
  const contextValues = useTradersContext()
  const { md } = useResponsive()
  const protocolFilterProps: GlobalProtocolFilterProps = useMemo(
    () => ({
      placement: md ? 'bottom' : 'bottomRight',
      menuSx: { width: ['300px', '400px', '50vw', '50vw'] },
    }),
    [md]
  )
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
      <Box flex="1 1 0" sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        {md ? (
          <TimeFilterSection contextValues={contextValues} learnMoreSection={SubscriptionFeatureEnum.TRADER_FAVORITE} />
        ) : (
          <Flex sx={{ height: 40, alignItems: 'center', pl: 3, pr: [3, 3, 0], justifyContent: 'space-between' }}>
            <TimeFilterDropdown contextValues={contextValues} />
            <Flex sx={{ height: '100%' }}>
              <Flex sx={{ height: '100%', alignItems: 'center', borderLeft: 'small', borderLeftColor: 'neutral4' }}>
                <SortTradersDropdown
                  currentSort={contextValues.currentSort}
                  changeCurrentSort={contextValues.changeCurrentSort}
                />
                <GlobalProtocolFilter {...protocolFilterProps} />
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
      <ListTraderFavorites contextValues={contextValues} bookmarks={bookmarks} totalAccounts={totalAccounts} />
    </Flex>
  )
}

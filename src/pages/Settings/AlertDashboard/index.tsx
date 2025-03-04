import { Trans } from '@lingui/macro'
import { Plus, Siren } from '@phosphor-icons/react'
import React from 'react'
import { Link } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import InputSearchText from 'components/@ui/InputSearchText'
import SectionTitle from 'components/@ui/SectionTitle'
import useAlertDashboardContext, {
  AlertDashboardProvider,
  TabKeyEnum,
} from 'hooks/features/alert/useAlertDashboardContext'
import Badge from 'theme/Badge'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

import DesktopView from './DesktopView'
import MobileView from './MobileView'

export default function AlertDashboardPage() {
  return (
    <>
      <CustomPageTitle title="Alert" />
      <AlertDashboardProvider>
        <AlertDashboardComponent />
      </AlertDashboardProvider>
    </>
  )
}

function AlertDashboardComponent() {
  const {
    isMobile,
    tab,
    systemAlerts,
    maxCustoms,
    totalCustoms,
    isVIPUser,
    isLimited,
    keyword,
    setKeyword,
    handleCreateCustomAlert,
  } = useAlertDashboardContext()
  const isCustom = tab === TabKeyEnum.CUSTOM
  return (
    <Flex sx={{ width: '100%', height: 'calc(100% - 1px)', flexDirection: 'column' }}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}
      >
        <SectionTitle
          icon={Siren}
          title={
            <Flex height={48} alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
              {isMobile ? (isCustom ? 'CUSTOM ALERT' : 'SYSTEM ALERT') : 'ALERT'}
              {isMobile && <Badge count={isCustom ? `${totalCustoms}/${maxCustoms}` : systemAlerts?.length ?? 0} />}
              {isCustom && isMobile && (
                <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
                  {!isVIPUser && isLimited ? (
                    <Link to={ROUTES.SUBSCRIPTION.path}>
                      <Button size="xs" variant="outlinePrimary">
                        <Trans>Upgrade</Trans>
                      </Button>
                    </Link>
                  ) : (
                    <ButtonWithIcon
                      size="xs"
                      variant="outlinePrimary"
                      icon={<Plus />}
                      disabled={isLimited}
                      onClick={handleCreateCustomAlert}
                    >
                      <Type.Caption>Create New Alert</Type.Caption>
                    </ButtonWithIcon>
                  )}
                </Flex>
              )}
            </Flex>
          }
          sx={{ px: 3, mb: 0 }}
        />
      </Flex>
      {isMobile && isCustom && setKeyword && (
        <Flex width="100%" px={3} py={2} alignItems="center" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
          <InputSearchText
            placeholder="SEARCH ALERT NAME"
            sx={{
              width: '100%',
              border: 'none',
              backgroundColor: 'transparent !important',
              p: 0,
            }}
            searchText={keyword ?? ''}
            setSearchText={setKeyword}
          />
        </Flex>
      )}
      {isMobile ? <MobileView /> : <DesktopView />}
    </Flex>
  )
}

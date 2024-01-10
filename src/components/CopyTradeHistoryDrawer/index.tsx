import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'

import Container from 'components/@ui/Container'
import NoDataFound from 'components/@ui/NoDataFound'
import UserLogItem from 'components/@ui/UserLogItem'
import { CopyTradeData } from 'entities/copyTrade.d'
import useUserLogDetails from 'hooks/features/useUserLogDetails'
import { isMobile } from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { Flex, Type } from 'theme/base'

export default function CopyTradeHistoryDrawer({
  isOpen,
  onDismiss,
  copyTradeData,
}: {
  isOpen: boolean
  onDismiss: () => void
  copyTradeData: CopyTradeData | undefined
}) {
  const { data, isLoading } = useUserLogDetails({ modelId: copyTradeData?.id })

  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss} mode="right" size={isMobile ? '100%' : '60%'} background="neutral5">
      <Container p={3} sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Type.BodyBold>
          <Trans>Copytrade Settings History</Trans>
        </Type.BodyBold>
        <Flex my={3} flexDirection="column">
          {isLoading && <Loading />}
          {!isLoading && !data?.length && <NoDataFound />}
          {!isLoading &&
            !!data?.length &&
            data.map((log) => {
              return <UserLogItem key={log.id} data={log} />
            })}
        </Flex>
      </Container>
    </Drawer>
  )
}

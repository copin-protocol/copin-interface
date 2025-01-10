import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import Container from 'components/@ui/Container'
import NoDataFound from 'components/@ui/NoDataFound'
import UserLogItem from 'components/@widgets/UserLogItem'
import { CopyTradeData } from 'entities/copyTrade.d'
import useUserLogDetails from 'hooks/features/useUserLogDetails'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import RcDrawer from 'theme/RcDrawer'
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
  const { lg, md } = useResponsive()

  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={lg ? '60%' : md ? '80%' : '100%'}>
      <Container p={3} sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Type.H5>
          <Trans>Copytrade Settings History</Trans>
        </Type.H5>
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
    </RcDrawer>
  )
}

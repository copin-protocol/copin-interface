import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import Container from 'components/@ui/Container'
import NoDataFound from 'components/@ui/NoDataFound'
import UserLogItem from 'components/@widgets/UserLogItem'
import { CopyWalletData } from 'entities/copyWallet'
import useUserLogDetails from 'hooks/features/useUserLogDetails'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import RcDrawer from 'theme/RcDrawer'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

export default function WalletHistoryDrawer({
  isOpen,
  onDismiss,
  copyWallet,
}: {
  isOpen: boolean
  onDismiss: () => void
  copyWallet: CopyWalletData | undefined
}) {
  const { lg, md } = useResponsive()
  const { data, isLoading } = useUserLogDetails({ modelId: copyWallet?.id })

  return (
    <RcDrawer
      open={isOpen}
      onClose={onDismiss}
      width={lg ? '60%' : md ? '80%' : '100%'}
      background={themeColors.neutral7}
    >
      <Container p={3} sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Type.H5>
          <Trans>Copy Wallet History</Trans>
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

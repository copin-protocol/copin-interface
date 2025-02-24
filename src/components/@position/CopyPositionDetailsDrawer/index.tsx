import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import Container from 'components/@ui/Container'
import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { Z_INDEX } from 'utils/config/zIndex'

import CopyPositionDetails from '../CopyPositionDetails'
import HLTraderPositionDetails from '../HLTraderPositionDetails'
import { parseHLPositionData } from '../helpers/hyperliquid'

export default function CopyPositionDetailsDrawer({
  isOpen,
  onDismiss,
  data,
}: {
  isOpen: boolean
  onDismiss: () => void
  data: CopyPositionData | undefined
}) {
  const { embeddedWallet } = useCopyWalletContext()
  const { lg } = useResponsive()
  const hlPosition = data?.hlPosition
    ? parseHLPositionData({ account: embeddedWallet?.hyperliquid?.embeddedWallet ?? '', data: [data.hlPosition] })?.[0]
    : undefined
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={lg ? '60%' : '100%'} zIndex={Z_INDEX.TOASTIFY}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: '12px', zIndex: 1 }}
          onClick={onDismiss}
        />
        {data?.openingPositionType === 'onlyLiveHyper' ? (
          <HLTraderPositionDetails data={hlPosition} />
        ) : (
          <CopyPositionDetails key={isOpen.toString()} copyPositionData={data} />
        )}
      </Container>
    </RcDrawer>
  )
}

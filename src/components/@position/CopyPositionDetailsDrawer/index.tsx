import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import Container from 'components/@ui/Container'
import NoDataFound from 'components/@ui/NoDataFound'
import { CopyPositionData } from 'entities/copyTrade'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'

import CopyPositionDetails from '../CopyPositionDetails'

export default function CopyPositionDetailsDrawer({
  isOpen,
  onDismiss,
  data,
}: {
  isOpen: boolean
  onDismiss: () => void
  data: CopyPositionData | undefined
}) {
  const { lg } = useResponsive()
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={lg ? '60%' : '100%'}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: '12px', zIndex: 1 }}
          onClick={onDismiss}
        />
        {data?.openingPositionType === 'onlyLiveHyper' && (
          <NoDataFound message={<Trans>This position is unlinked</Trans>} />
        )}
        {data?.openingPositionType !== 'onlyLiveHyper' && (
          <CopyPositionDetails key={isOpen.toString()} copyPositionData={data} />
        )}
      </Container>
    </RcDrawer>
  )
}

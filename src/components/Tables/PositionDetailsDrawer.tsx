import { XCircle } from '@phosphor-icons/react'

import { ApiMeta } from 'apis/api'
import Container from 'components/@ui/Container'
import { ColumnData, TableSortProps } from 'components/@ui/Table/types'
import PositionDetails from 'components/PositionDetails'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { ProtocolEnum } from 'utils/config/enums'
import { TokenOptionProps } from 'utils/config/trades'

export interface HistoryTableProps {
  data: PositionData[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  tokenOptions: TokenOptionProps[]
  currencyOption: TokenOptionProps
  changeCurrency: (option: TokenOptionProps) => void
  fetchNextPage?: () => void
  hasNextPage?: boolean | undefined
  toggleExpand?: () => void
  isExpanded?: boolean
  tableSettings: ColumnData<PositionData>[]
  currentSort?: TableSortProps<PositionData> | undefined
  changeCurrentSort?: (sort: TableSortProps<PositionData> | undefined) => void
}

export default function PositionDetailsDrawer({
  isOpen,
  onDismiss,
  protocol,
  id,
  chartProfitId,
}: {
  isOpen: boolean
  onDismiss: () => void
  protocol: ProtocolEnum | undefined
  id: string | undefined
  chartProfitId: string
}) {
  const isMobile = useIsMobile()
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={isMobile ? '100%' : '60%'} destroyOnClose={false}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto', bg: 'neutral6' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3 }}
          onClick={onDismiss}
        />
        <PositionDetails protocol={protocol} id={id} chartProfitId={chartProfitId} />
      </Container>
    </RcDrawer>
  )
}

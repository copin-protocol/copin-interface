import styled from 'styled-components/macro'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { FilterValues } from 'components/@widgets/ConditionFilterForm/types'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatNumber, nFormatter } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'

import { FilterTabEnum } from './configs'
import useTradersCount from './useTraderCount'

const COLORS: string[] = ['#B6EBFB', '#6EB9F7', '#1183E1', '#0A53A9', '#083791']

export default function ResultEstimated({
  ranges,
  timeOption,
  protocol,
  filterTab,
}: {
  ranges: FilterValues[]
  timeOption: TimeFilterProps
  protocol: ProtocolEnum
  filterTab: FilterTabEnum
}) {
  const effectDays = getDurationFromTimeFilter(timeOption.id)
  const { data, isLoading } = useTradersCount({ ranges, timeOption, protocol, filterTab })
  const lastData = data?.at?.(-1)
  const percent = lastData && lastData?.total > 0 ? ((lastData?.counter ?? 0) * 100) / lastData.total : 0
  const count = lastData?.counter ?? 0
  const total = lastData?.total ?? 0
  return (
    <Flex
      sx={{
        px: 3,
        height: 80,
        borderBottom: 'small',
        borderBottomColor: 'neutral5',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Flex alignItems="center" sx={{ gap: 1 }}>
        <Type.Caption width="max-content" color={'neutral1'}>
          {data ? `${percent.toFixed(1)}%` : '--'}
        </Type.Caption>
        <Type.Caption minWidth="max-content" color="neutral3">
          traders fit conditions in {formatNumber(effectDays, 0)} days
        </Type.Caption>
      </Flex>
      <Box
        sx={{
          position: 'relative',
          height: '16px',
          border: 'small',
          borderColor: 'neutral3',
          bg: 'neutral5',
          width: '100%',
        }}
      >
        {data &&
          data.map((value, index) => {
            const { counter, total } = value
            const percent = total > 0 ? (counter * 100) / total : 0
            return (
              <Box key={index}>
                <Progress width={percent + 2} p={0} bg={COLORS[index]} />
              </Box>
            )
          })}
        <Box sx={{ position: 'absolute', top: '50%', left: 32, transform: 'translateY(-50%)', zIndex: 10 }}>
          {isLoading && <Loading size={16} />}
        </Box>
      </Box>

      <Flex sx={{ width: '100%', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
        <Type.Caption color="neutral1">{data ? nFormatter(count, 1) : '--'}</Type.Caption>
        <Type.Caption color="neutral3">{data ? nFormatter(total, 1) : '--'}</Type.Caption>
      </Flex>
    </Flex>
  )
}

const Progress = styled(Box)<{ width: number; bg: string }>`
  position: absolute;
  z-index: 2;
  top: -1px;
  left: -1px;
  height: 16px;
  background: ${({ bg }) => bg};
  transition: all 240ms ease;
  width: ${({ width }) => `${width}%`};

  @-webkit-keyframes progressAnimation {
    0% {
      width: 0%;
    }
    100% {
      width: ${({ width }) => `${width}%`};
    }
  }
  @keyframes progressAnimation {
    0% {
      width: 0%;
    }
    100% {
      width: ${({ width }) => `${width}%`};
    }
  }
`

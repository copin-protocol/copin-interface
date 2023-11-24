import styled from 'styled-components/macro'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { FilterValues } from 'components/ConditionFilterForm/types'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatNumber, nFormatter } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'

import useTradersCount from './useTraderCount'

const COLORS: string[] = ['#B6EBFB', '#6EB9F7', '#1183E1', '#0A53A9', '#083791']

export default function ResultEstimated({
  ranges,
  timeOption,
  protocol,
}: {
  ranges: FilterValues[]
  timeOption: TimeFilterProps
  protocol: ProtocolEnum
}) {
  const effectDays = getDurationFromTimeFilter(timeOption.id)
  const { data, isLoading } = useTradersCount({ ranges, timeOption, protocol })
  return !!isLoading || !!data?.length ? (
    <Flex
      sx={{
        px: 3,
        height: 80,
        alignItems: 'center',
        borderBottom: 'small',
        borderBottomColor: 'neutral5',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: '50%', left: 32, transform: 'translateY(-50%)', zIndex: 10 }}>
        {isLoading && <Loading size={16} />}
      </Box>
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
            const isLast = index === data.length - 1
            return (
              <Box key={index}>
                <Progress width={percent + 2} p={0} bg={COLORS[index]} />
                <Absolute
                  top={'-32px'}
                  left={percent < 50 ? `${percent}%` : undefined}
                  right={percent >= 50 ? `${100 - percent}%` : undefined}
                  sx={{ display: isLast ? 'block' : 'none' }}
                >
                  <Flex alignItems="center" sx={{ gap: 1 }}>
                    <Type.Caption width="max-content" color={isLast ? 'neutral1' : 'neutral3'}>
                      {percent.toFixed(1)}%
                    </Type.Caption>
                    <Type.Caption minWidth="max-content" color="neutral3" py={2}>
                      traders fit conditions in {formatNumber(effectDays, 0)} days
                    </Type.Caption>
                  </Flex>
                </Absolute>

                <Absolute
                  bottom={'-25px'}
                  left={percent < 50 ? `${percent}%` : undefined}
                  right={percent >= 50 ? `${100 - percent}%` : undefined}
                  sx={{ display: isLast ? 'block' : 'none' }}
                >
                  <Type.Caption color={isLast ? 'neutral1' : 'neutral3'}>{nFormatter(counter, 1)}</Type.Caption>
                </Absolute>
              </Box>
            )
          })}

        <Absolute bottom={'-25px'} right={'-2px'}>
          {data && <Type.Caption color="neutral3">{nFormatter(data[0]?.total ?? 0, 1)}</Type.Caption>}
        </Absolute>
      </Box>
    </Flex>
  ) : null
}

const Absolute = styled(Box)<{
  top?: string
  bottom?: string
  left?: string
  right?: string
}>`
  position: absolute;
  top: ${({ top }) => (top ? top : 'auto')};
  bottom: ${({ bottom }) => (bottom ? bottom : 'auto')};
  left: ${({ left }) => (left ? left : 'auto')};
  right: ${({ right }) => (right ? right : 'auto')};
`

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

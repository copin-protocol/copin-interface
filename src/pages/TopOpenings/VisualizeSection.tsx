import openingBg from 'assets/images/opening_bg.svg'
import { DifferentialBar } from 'components/@ui/DifferentialBar'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import OpeningPositionsBubble from './OpeningPositionsBubble'

type VisualizeSectionProps = {
  protocol: ProtocolEnum
  data: PositionData[] | undefined
  isLoading: boolean
}

export default function VisualizeSection({ protocol, data, isLoading }: VisualizeSectionProps) {
  const longShortData = getLongShortData(data)
  return (
    <>
      <Box height="100%">
        <Flex
          height="calc(100% - 136px)"
          sx={{
            position: 'relative',
            borderBottom: 'small',
            borderTop: 'small',
            borderColor: 'neutral4',
            backgroundImage: `url(${openingBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!data && isLoading && <Loading />}
          {data && <OpeningPositionsBubble data={data} protocol={protocol} />}
        </Flex>
        <Box height="136px" p={12}>
          <LongShortRate {...longShortData} />
        </Box>
      </Box>
    </>
  )
}

export function VisualizeSectionMobile({ data }: Pick<VisualizeSectionProps, 'data'>) {
  const longShortData = getLongShortData(data)
  return <LongShortRate {...longShortData} />
}

type LongShortRateProps = {
  longRate: number | undefined
  shortRate: number | undefined
  longTraders: Set<string> | undefined
  shortTraders: Set<string> | undefined
  longVol: number | undefined
  shortVol: number | undefined
}
function LongShortRate({ longRate, shortRate, longTraders, shortTraders, longVol, shortVol }: LongShortRateProps) {
  return (
    <Box>
      <Flex justifyContent="space-between" mb={3}>
        <Type.CaptionBold>Long Rate: {formatNumber(longRate, 1, 1)}%</Type.CaptionBold>
        <Type.CaptionBold>Short Rate: {formatNumber(shortRate, 1, 1)}%</Type.CaptionBold>
      </Flex>
      <DifferentialBar sourceRate={longRate ?? 0} targetRate={shortRate ?? 0} />
      <Flex justifyContent="space-between" mt={3}>
        <Box>
          <Type.Caption display="block">Long Volume: ${formatNumber(longVol, 0, 0)}</Type.Caption>
          <Type.Caption>{longTraders?.size ?? '--'} traders</Type.Caption>
        </Box>
        <Box textAlign="right">
          <Type.Caption display="block">Short Volume: ${formatNumber(shortVol, 0, 0)}</Type.Caption>
          <Type.Caption>{shortTraders?.size ?? '--'} traders</Type.Caption>
        </Box>
      </Flex>
    </Box>
  )
}

function getLongShortData(data: PositionData[] | undefined): LongShortRateProps {
  const longVol = data ? data.filter((item) => item.isLong).reduce((prev, cur) => (prev += cur.size), 0) : undefined
  const longTraders = data ? new Set(data.filter((item) => item.isLong).map((item) => item.account)) : undefined
  const shortTraders = data ? new Set(data.filter((item) => !item.isLong).map((item) => item.account)) : undefined
  const shortVol = data ? data.filter((item) => !item.isLong).reduce((prev, cur) => (prev += cur.size), 0) : undefined
  const longRate = longVol != null && shortVol != null ? (longVol * 100) / (longVol + shortVol) : undefined
  const shortRate = longRate != null ? 100 - longRate : undefined
  return {
    longRate,
    shortRate,
    longTraders,
    shortTraders,
    longVol,
    shortVol,
  }
}

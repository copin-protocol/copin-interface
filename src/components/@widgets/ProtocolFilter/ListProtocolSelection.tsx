import ActiveDot from 'components/@ui/ActiveDot'
import BetaTag from 'components/@ui/BetaTag'
import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { ProtocolsStatisticData } from 'entities/statistic'
import useGetProtocolStatus from 'hooks/features/systemConfig/useGetProtocolStatus'
import Checkbox from 'theme/Checkbox'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum, SystemStatusTypeEnum } from 'utils/config/enums'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { compactNumber, getSystemStatusTypeColor } from 'utils/helpers/format'

export default function ListProtocolSelection({
  options,
  checkIsSelected,
  protocolsStatistic,
  handleToggle,
  itemSx = {},
  isAvailable = true,
  itemActiveSx = {},
  hasCheckBox = true,
}: {
  options: ProtocolOptionProps[]
  checkIsSelected: (protocol: ProtocolEnum) => boolean
  protocolsStatistic?: ProtocolsStatisticData | undefined
  handleToggle: (protocol: ProtocolEnum) => void
  itemSx?: any
  itemActiveSx?: any
  isAvailable?: boolean
  hasCheckBox?: boolean
}) {
  const { protocolDataStatusMapping, getProtocolMessage } = useGetProtocolStatus()

  return (
    <>
      {/* RENDER PROTOCOLS */}
      {!options?.length && (
        <Box my={3}>
          <NoDataFound />
        </Box>
      )}
      <Grid
        sx={{
          gridTemplateColumns: ['repeat(auto-fill, minmax(200px, 1fr))', 'repeat(auto-fill, minmax(200px, 1fr))'],
          gap: 1,
        }}
      >
        {options.map((option) => {
          const protocol = option.id
          const isActive = checkIsSelected(protocol)
          const protocolStatistic = protocolsStatistic?.[protocol]
          const protocolStatus = protocolDataStatusMapping[protocol]

          return (
            <Box
              key={protocol}
              sx={{
                backgroundColor: 'neutral6',
                borderRadius: 'xs',
                cursor: 'pointer',

                ...itemSx,
                ...(isActive ? itemActiveSx : {}),
                ...(isAvailable
                  ? {
                      '&:hover': {
                        backgroundColor: isActive ? undefined : 'neutral5',
                      },
                    }
                  : { cursor: 'not-allowed' }),
              }}
              onClick={() => isAvailable && handleToggle(protocol)}
            >
              <Flex
                alignItems="center"
                sx={{
                  py: 10,
                  px: 2,
                  gap: '6px',
                  backgroundColor: 'transparent',
                  color: 'neutral5',
                }}
              >
                {hasCheckBox && (
                  <Checkbox key={protocol} checked={isActive} disabled={!isAvailable} wrapperSx={{ height: 'auto' }} />
                )}
                <ProtocolLogo className="active" protocol={protocol} isActive={false} hasText={false} size={32} />

                <Flex flex="1" sx={{ gap: '5px', alignItems: 'center', position: 'relative' }}>
                  <Flex width="100%" flexDirection={'column'} sx={{ justifyContent: 'space-between' }} mx={1}>
                    <Flex sx={{ alignItems: 'center', gap: 1 }}>
                      <Type.Caption color={'neutral1'} sx={{ textTransform: 'uppercase' }}>
                        {option.text}
                      </Type.Caption>
                      {option.isBeta && <BetaTag />}
                      {protocolStatus !== SystemStatusTypeEnum.STABLE && (
                        <ActiveDot
                          color={getSystemStatusTypeColor(protocolStatus)}
                          tooltipContent={getProtocolMessage(protocol)}
                          tooltipId={`status_indicator_${protocol}`}
                        />
                      )}
                    </Flex>
                    <Flex sx={{ alignItems: 'center', gap: 1, '& > *': { flexShrink: 0, wordSpacing: '-2px' } }}>
                      <Type.Small width={54} color={'neutral3'}>
                        MAU: {compactNumber(protocolStatistic?.traders30 ?? 0, 0, true)}
                      </Type.Small>
                      <Type.Small width={54} color={'neutral3'}>
                        OI: ${compactNumber(protocolStatistic?.oi, 0, true)}
                      </Type.Small>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          )
        })}
      </Grid>
    </>
  )
}

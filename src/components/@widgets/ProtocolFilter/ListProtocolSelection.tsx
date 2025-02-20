import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { ProtocolsStatisticData } from 'entities/statistic'
import Checkbox from 'theme/Checkbox'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { compactNumber } from 'utils/helpers/format'

export default function ListProtocolSelection({
  options,
  checkIsSelected,
  protocolsStatistic,
  handleToggle,
  itemSx = {},
  itemActiveSx = {},
  hasCheckBox = true,
}: {
  options: ProtocolOptionProps[]
  checkIsSelected: (protocol: ProtocolEnum) => boolean
  protocolsStatistic?: ProtocolsStatisticData | undefined
  handleToggle: (protocol: ProtocolEnum) => void
  itemSx?: any
  itemActiveSx?: any
  hasCheckBox?: boolean
}) {
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
          gridTemplateColumns: ['repeat(auto-fill, minmax(175px, 1fr))', 'repeat(auto-fill, minmax(175px, 1fr))'],
          gap: 1,
        }}
      >
        {options.map((option) => {
          const protocol = option.id
          const isActive = checkIsSelected(protocol)
          const protocolStatistic = protocolsStatistic?.[protocol]

          return (
            <Box
              key={protocol}
              sx={{
                backgroundColor: 'neutral6',
                borderRadius: 'xs',
                '&:hover': {
                  backgroundColor: 'neutral5',
                  cursor: 'pointer',
                },
                ...itemSx,
                ...(isActive ? itemActiveSx : {}),
              }}
              onClick={() => handleToggle(protocol)}
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
                {hasCheckBox && <Checkbox key={protocol} checked={isActive} wrapperSx={{ height: 'auto' }} />}

                <ProtocolLogo className="active" protocol={protocol} isActive={false} hasText={false} size={32} />

                <Flex width="100%" sx={{ gap: '5px', alignItems: 'center', position: 'relative' }}>
                  <Flex width="100%" flexDirection={'column'} sx={{ justifyContent: 'space-between' }} mx={1}>
                    <Type.Caption color={'neutral1'} sx={{ textTransform: 'uppercase' }}>
                      {option.text}
                    </Type.Caption>
                    <Flex sx={{ alignItems: 'center', gap: 1, '& > *': { flexShrink: 0, wordSpacing: '-2px' } }}>
                      <Type.Small width={54} color={'neutral3'}>
                        MAU: {compactNumber(protocolStatistic?.traders30 ?? 0, 0, true)}
                      </Type.Small>
                      <Type.Small width={54} color={'neutral3'}>
                        OI: ${compactNumber(protocolStatistic?.oi, 0, true)}
                      </Type.Small>
                    </Flex>
                  </Flex>

                  {/*{option.isCross ? (*/}
                  {/*  <img src={CrossTag} alt="cross" />*/}
                  {/*) : option.isNew ? (*/}
                  {/*  <img src={NewTag} alt="new" />*/}
                  {/*) : (*/}
                  {/*  <></>*/}
                  {/*)}*/}
                </Flex>
              </Flex>
            </Box>
          )
        })}
      </Grid>
    </>
  )
}

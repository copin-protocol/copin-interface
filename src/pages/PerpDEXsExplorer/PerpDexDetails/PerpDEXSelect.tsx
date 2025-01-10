import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPerpDexStatisticApi } from 'apis/perpDex'
import NoDataFound from 'components/@ui/NoDataFound'
import PerpDexLogo from 'components/@ui/PerpDexLogo'
import IconGroup from 'components/@widgets/IconGroup'
import Icon from 'components/@widgets/IconGroup/Icon'
import Dropdown from 'theme/Dropdown'
import { InputSearch } from 'theme/Input'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generatePerpDEXDetailsRoute } from 'utils/helpers/generateRoute'
import { parseChainImage, parsePlainProtocolImage } from 'utils/helpers/transform'

type Option = {
  perpdex: string
  chains: string[] | undefined
  name: string
  protocol: ProtocolEnum | undefined
  chain: string | undefined
}

export default function PerpDEXSelect() {
  const { data, isLoading } = useQuery([QUERY_KEYS.GET_PERP_DEX_STATISTIC_DATA], getPerpDexStatisticApi)
  const options = useMemo(() => {
    const result: Option[] = []
    data &&
      [...data]
        .sort((a, b) => (a.perpdex > b.perpdex ? 1 : a.perpdex < b.perpdex ? -1 : 0))
        .forEach((v) => {
          const option: Option = {
            perpdex: v.perpdex,
            chains: v.chains ?? [],
            name: v.name,
            protocol: undefined,
            chain: undefined,
          }
          result.push(option)
          if (v.protocolInfos) {
            v.protocolInfos.forEach((p) => {
              const option: Option = {
                perpdex: p.perpdex,
                chains: undefined,
                name: p.name,
                protocol: p.protocol,
                chain: p.chain,
              }
              result.push(option)
            })
          }
        })
    return result
  }, [data])
  const [visible, setVisible] = useState(false)
  const { md } = useResponsive()

  return (
    <Dropdown
      visible={visible}
      setVisible={setVisible}
      menuDismissible
      dismissible={false}
      menuSx={{
        width: [240, 360, 560],
        p: 12,
        maxHeight: 500,
        overflow: 'auto',
        '& > *': { m: 0, maxHeight: 'max-content', overflow: 'visible' },
      }}
      placement={md ? undefined : 'bottom'}
      iconColor="neutral3"
      buttonSx={{
        p: '4px',
        '& *': { p: 0, m: 0 },
        borderRadius: '2px',
        border: 'none',
        bg: 'neutral5',
        '&:hover': { bg: 'neutral4' },
      }}
      menu={<PerpDEXSelection options={options} onClickSelection={() => setVisible(false)} />}
      iconSize={16}
    >
      {null}
    </Dropdown>
  )
}

function PerpDEXSelection({ options, onClickSelection }: { options: Option[]; onClickSelection: () => void }) {
  const [searchText, setSearchText] = useState<string | undefined>()
  const _options = options.filter((option) => {
    if (!searchText) return true
    return (
      option.perpdex.toLowerCase().match(searchText.toLowerCase()) ||
      option.name.toLowerCase().match(searchText.toLowerCase())
    )
  })
  const handleChangeSearchText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }, [])
  const handleClearSearchText = useCallback(() => {
    setSearchText(undefined)
  }, [])
  const handleClickPerpDEX = useCallback(() => {
    setSearchText(undefined)
    onClickSelection()
  }, [])
  return (
    <Box>
      <InputSearch
        block
        value={searchText}
        onChange={handleChangeSearchText}
        onClear={handleClearSearchText}
        placeholder="SEARCH PERP"
      />
      {!_options.length && <NoDataFound message={<Trans>No Perp DEX matched!</Trans>} />}
      {!!_options.length && (
        <Grid mt={3} sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 1 }}>
          {[..._options].map((option) => {
            return (
              <Flex
                as={Link}
                to={generatePerpDEXDetailsRoute({
                  perpdex: option.perpdex.toLowerCase(),
                  params: { protocol: option.protocol },
                })}
                key={option.name + option.protocol + option.perpdex}
                onClick={handleClickPerpDEX}
                sx={{
                  color: 'neutral1',
                  px: 10,
                  width: '100%',
                  height: 40,
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: '4px',
                  bg: 'neutral6',
                  '&:hover': { bg: 'neutral5' },
                }}
              >
                {option.protocol ? (
                  <Icon
                    hasBorder={false}
                    iconName={option.protocol}
                    iconUriFactory={parsePlainProtocolImage}
                    size={32}
                  />
                ) : (
                  <PerpDexLogo perpDex={option.perpdex} size={32} />
                )}
                <Type.Caption mb={'2px'}>{option.name}</Type.Caption>
                {option.chain ? (
                  <Icon hasBorder={false} iconName={option.chain} iconUriFactory={parseChainImage} size={16} />
                ) : (
                  <IconGroup iconNames={option.chains ?? []} iconUriFactory={parseChainImage} size={16} />
                )}
              </Flex>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}

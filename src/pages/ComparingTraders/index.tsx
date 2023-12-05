import { Trans } from '@lingui/macro'
import { useCallback, useMemo, useState } from 'react'

import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import { TraderData } from 'entities/trader'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useSearchParams from 'hooks/router/useSearchParams'
import FindAndSelectTrader, { HandleSelectTrader } from 'pages/TraderDetails/TraderRankingExpanded/FindAndSelectTrader'
import { Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

import ComparisonComponent, { ComparisonComponentProps } from './ComparisonComponent'

export default function ComparingTraders() {
  const { checkIsPremium } = useIsPremiumAndAction()

  const { searchParams, setSearchParams } = useSearchParams()
  const traders = useMemo(() => {
    return (searchParams[URL_PARAM_KEYS.COMPARE_TRADERS] as string)?.split?.('_') ?? []
  }, [searchParams])
  let protocols = useMemo(() => {
    return ((searchParams[URL_PARAM_KEYS.COMPARE_PROTOCOLS] as string)?.split('_') ?? []) as ProtocolEnum[]
  }, [searchParams])
  if (protocols.length < traders.length) protocols = traders.map(() => ProtocolEnum.GMX)

  const handleChangeTrader = useCallback(
    ({ index, traderData }: { index: number; traderData: TraderData }) => {
      const newTraders = [...traders]
      newTraders[index] = traderData.account
      const newProtocols = [...protocols]
      protocols[index] = traderData.protocol
      setSearchParams({
        [URL_PARAM_KEYS.COMPARE_TRADERS]: newTraders.join('_'),
        [URL_PARAM_KEYS.COMPARE_PROTOCOLS]: newProtocols.join('_'),
      })
    },
    [protocols, setSearchParams, traders]
  )

  const { currentOption: timeOption, changeCurrentOption: changeCurrentTime } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: TIME_FILTER_OPTIONS,
    defaultOption: TIME_FILTER_OPTIONS[0].id as unknown as string,
  })
  const handleChangeTime = (option: TimeFilterProps) => {
    if (option.id === TimeFilterByEnum.ALL_TIME) {
      if (!checkIsPremium()) return
    }
    changeCurrentTime(option)
  }

  const [firstTrader, setFirstTrader] = useState<TraderData>({
    account: traders[0],
    protocol: protocols[0],
  } as TraderData)
  const [secondTrader, setSecondTrader] = useState<TraderData>({
    account: traders[1],
    protocol: protocols[1],
  } as TraderData)

  const handleChangeFirstTrader: HandleSelectTrader = useCallback(
    (data) => {
      setFirstTrader(data)
      handleChangeTrader({ index: 0, traderData: data })
    },
    [handleChangeTrader]
  )
  const handleChangeSecondTrader: HandleSelectTrader = useCallback(
    (data) => {
      setSecondTrader(data)
      handleChangeTrader({ index: 1, traderData: data })
    },
    [handleChangeTrader]
  )

  const FirstComponent = useCallback(
    (props: ComparisonComponentProps) => {
      return (
        <FindAndSelectTrader
          type="switch"
          selectedTrader={props.firstTrader}
          onSelect={handleChangeFirstTrader}
          ignoreSelectTraders={[props.firstTrader, props.secondTrader]}
          timeOption={props.timeOption}
        />
      )
    },
    [handleChangeFirstTrader]
  )
  const SecondComponent = useCallback(
    (props: ComparisonComponentProps) => {
      return (
        <FindAndSelectTrader
          type="switch"
          selectedTrader={props.secondTrader}
          onSelect={handleChangeSecondTrader}
          ignoreSelectTraders={[props.firstTrader, props.secondTrader]}
          timeOption={props.timeOption}
        />
      )
    },
    [handleChangeSecondTrader]
  )

  return (
    <>
      <Type.Body
        sx={{ p: 3, display: 'flex', alignItems: 'center', gap: '0.5ch', '& *': { fontSize: 'inherit !important' } }}
      >
        <span>
          <Trans>Traders Comparison in</Trans>
        </span>
        <TimeDropdown timeOption={timeOption} onChangeTime={handleChangeTime} />
      </Type.Body>
      <ComparisonComponent
        firstTrader={firstTrader}
        secondTrader={secondTrader}
        firstComponent={FirstComponent}
        secondComponent={SecondComponent}
        timeOption={timeOption}
      />
    </>
  )
}

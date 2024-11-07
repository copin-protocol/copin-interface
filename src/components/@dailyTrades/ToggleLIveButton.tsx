import LiveDataIcon from 'components/@ui/LiveDataIcon'
// import TimeCountdown from 'components/@widgets/TimeCountdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Flex, Type } from 'theme/base'

export default function ToggleLiveButton({
  onClick,
  enabledLiveData,
}: {
  onClick: () => void
  enabledLiveData: boolean
}) {
  return (
    <Flex sx={{ alignItems: 'center' }} role="button" onClick={onClick}>
      {/* <TimeCountdown /> */}
      <LiveDataIcon disabled={!enabledLiveData} />
      <Type.Caption ml={1} mr={2} color={enabledLiveData ? 'neutral1' : 'neutral3'} sx={{ color: 'red' }}>
        LIVE DATA
      </Type.Caption>
      <SwitchInput checked={enabledLiveData} onClick={onClick} />
    </Flex>
  )
}

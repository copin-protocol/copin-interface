// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { CaretRight, Copy, Star, XCircle } from '@phosphor-icons/react'
import isEqual from 'lodash/isEqual'
import { ReactNode, useRef, useState } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { useClickLoginButton } from 'components/LoginAction'
import { TraderData } from 'entities/trader'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { PickFromCopyTradesModal, PickFromFavoritesModal } from './PickTraderModals'
import SearchTraders from './SearchTraders'
import Stats from './Stats'
import useSelectTrader from './useSelectTrader'

export type HandleSelectTrader = (data: TraderData) => void
export interface FindAndSelectTraderProps {
  onSelect: HandleSelectTrader
  account: string | undefined
  protocol: ProtocolEnum
  timeOption: TimeFilterProps
  selectedTrader: TraderData | null
  onClear: () => void
}

export default function FindAndSelectTrader(props: FindAndSelectTraderProps) {
  return (
    <>
      {props.selectedTrader ? (
        <SelectedTrader
          selectedTrader={props.selectedTrader}
          timeOption={props.timeOption}
          onClearTrader={props.onClear}
          handleSelectTrader={props.onSelect}
        />
      ) : (
        <Box sx={{ p: 3, position: 'relative' }}>
          <Type.CaptionBold mb={12}>
            <Trans>Choose A Trader To Compare</Trans>
          </Type.CaptionBold>
          <Flex sx={{ flexDirection: 'column', gap: 12 }}>
            <SearchTraders {...props} />
            <PickFromFavorites {...props} />
            <PickFromCopyTrades {...props} />
          </Flex>
        </Box>
      )}
    </>
  )
}
function SelectedTrader({
  selectedTrader,
  handleSelectTrader,
  timeOption,
  onClearTrader,
}: {
  selectedTrader: TraderData
  handleSelectTrader: HandleSelectTrader
  timeOption: TimeFilterProps
  onClearTrader: () => void
}) {
  const prevTimeOption = useRef(timeOption)
  const { isLoading: isSelecting } = useSelectTrader({
    account: selectedTrader.account,
    protocol: selectedTrader.protocol,
    onSuccess: (data) => {
      prevTimeOption.current = timeOption
      handleSelectTrader(data)
    },
    timeOption,
    enabled: !isEqual(prevTimeOption.current, timeOption) || !selectedTrader.ranking,
  })

  if (isSelecting) return <Loading />

  return (
    <Box sx={{ position: 'relative' }}>
      <IconBox
        role="button"
        icon={<XCircle size={20} />}
        onClick={onClearTrader}
        sx={{ position: 'absolute', top: 16, right: 16, color: 'neutral2', '&:hover': { color: 'neutral1' } }}
      />
      <Stats traderData={selectedTrader} indicatorColor="orange1" isLinkAddress />
    </Box>
  )
}

function PickFromFavorites(props: FindAndSelectTraderProps) {
  const [openFavoriteModal, setOpenFavoriteModal] = useState(false)
  return (
    <Box>
      <FindOptionButton
        icon={<Star size={16} />}
        label={<Trans>Pick From Favorites</Trans>}
        onClick={() => setOpenFavoriteModal(true)}
      />
      <Box sx={{ width: 0, height: 0, overflow: 'hidden' }}>
        {openFavoriteModal && <PickFromFavoritesModal {...props} onDismiss={() => setOpenFavoriteModal(false)} />}
      </Box>
    </Box>
  )
}

function PickFromCopyTrades(props: FindAndSelectTraderProps) {
  const [openCopyTradesModal, setOpenCopyTradesModal] = useState(false)
  return (
    <Box>
      <FindOptionButton
        icon={<Copy size={16} />}
        label={<Trans>Pick From Copytrades</Trans>}
        onClick={() => setOpenCopyTradesModal(true)}
      />
      <Box sx={{ width: 0, height: 0, overflow: 'hidden' }}>
        {openCopyTradesModal && <PickFromCopyTradesModal {...props} onDismiss={() => setOpenCopyTradesModal(false)} />}
      </Box>
    </Box>
  )
}

function FindOptionButton({ icon, label, onClick }: { icon: ReactNode; label: ReactNode; onClick: () => void }) {
  const { myProfile } = useMyProfileStore()
  const handleClickLogin = useClickLoginButton()
  const handleClickOption = () => {
    if (!myProfile) {
      handleClickLogin()
      return
    }
    onClick()
  }
  return (
    <Flex
      role="button"
      sx={{ alignItems: 'center', justifyContent: 'space-between', '&:hover .icon_caret': { color: 'neutral1' } }}
      onClick={handleClickOption}
    >
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <IconBox icon={icon} color="primary1" />
        <Type.Caption>{label}</Type.Caption>
      </Flex>
      <IconBox className="icon_caret" icon={<CaretRight size={16} />} color="neutral3" />
    </Flex>
  )
}

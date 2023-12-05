// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { CaretRight, Copy, Star, XCircle } from '@phosphor-icons/react'
import isEqual from 'lodash/isEqual'
import { ReactNode, useRef, useState } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { useClickLoginButton } from 'components/LoginAction'
import { TraderData } from 'entities/trader'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
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
  ignoreSelectTraders: { account: string; protocol: ProtocolEnum }[]
  timeOption: TimeFilterProps
  selectedTrader: TraderData | null
  onClear?: () => void
}

export default function FindAndSelectTrader({
  type = 'clear',
  ...props
}: FindAndSelectTraderProps & { type?: 'clear' | 'switch' }) {
  const [expand, setExpand] = useState(false)
  if (type === 'switch') {
    const onSelect: HandleSelectTrader = (data) => {
      setExpand(false)
      props.onSelect(data)
    }
    return (
      <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
        {props.selectedTrader && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <SelectedTrader
              selectedTrader={props.selectedTrader}
              timeOption={props.timeOption}
              handleSelectTrader={props.onSelect}
            />
            <Box flex="1" />
            <Type.Caption
              role="button"
              color="primary1"
              sx={{
                position: 'sticky',
                width: '100%',
                textAlign: 'center',
                p: 1,
                '&:hover': {
                  color: 'primary2',
                },
                bottom: 0,
                borderTop: 'small',
                borderTopColor: 'neutral4',
                bg: 'modalBG',
                backdropFilter: 'blur(5px)',
              }}
              onClick={() => setExpand(true)}
            >
              <Trans>Change Trader</Trans>
            </Type.Caption>
          </Box>
        )}
        <Box
          sx={{
            p: 3,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '100%',
            bg: 'neutral5',
            transform: expand ? 'translateY(0%)' : 'translateY(100%)',
            transition: '0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box flex="1">
            <Type.CaptionBold mb={12}>
              <Trans>Choose A Trader To Compare</Trans>
            </Type.CaptionBold>
            <Flex sx={{ flexDirection: 'column', gap: 12 }}>
              <SearchTraders {...props} onSelect={onSelect} resultHeight={170} />
              <PickFromFavorites {...props} onSelect={onSelect} />
              <PickFromCopyTrades {...props} onSelect={onSelect} />
            </Flex>
          </Box>
          <Type.Caption
            role="button"
            color="primary1"
            sx={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              p: 1,
              '&:hover': {
                color: 'primary2',
              },
              bottom: 0,
              borderTop: 'small',
              borderTopColor: 'neutral4',
            }}
            onClick={() => setExpand(false)}
          >
            <Trans>Cancel</Trans>
          </Type.Caption>
        </Box>
      </Box>
    )
  }
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
export function SelectedTrader({
  selectedTrader,
  handleSelectTrader,
  timeOption,
  onClearTrader,
}: {
  selectedTrader: TraderData
  handleSelectTrader: HandleSelectTrader
  timeOption: TimeFilterProps
  onClearTrader?: () => void
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
    <Box sx={{ position: 'relative', width: '100%' }}>
      {onClearTrader && (
        <IconBox
          role="button"
          icon={<XCircle size={20} />}
          onClick={onClearTrader}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'neutral2', '&:hover': { color: 'neutral1' } }}
        />
      )}
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

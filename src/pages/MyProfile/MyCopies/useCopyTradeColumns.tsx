import { Trans } from '@lingui/macro'
import { CopySimple, DotsThreeOutlineVertical, PencilSimpleLine, Plugs, Radical, Trash } from '@phosphor-icons/react'
import { MutableRefObject, SetStateAction, useMemo } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyTradeData } from 'entities/copyTrade'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'

import { renderTrader } from '../renderProps'
import ActionItem from './ActionItem'
import ReverseTag from './ReverseTag'

export default function useCopyTradeColumns({
  onSelect,
  isMutating,
  setOpenDrawer,
  setOpenCloneDrawer,
  setOpenDeleteModal,
  setOpenConfirmStopModal,
  toggleStatus,
  copyTradeData,
}: {
  onSelect: (data?: CopyTradeData) => void
  isMutating: boolean
  setOpenDrawer: (value: SetStateAction<boolean>) => void
  setOpenCloneDrawer: (value: SetStateAction<boolean>) => void
  setOpenDeleteModal: (value: SetStateAction<boolean>) => void
  setOpenConfirmStopModal: (value: SetStateAction<boolean>) => void
  toggleStatus: ({ id, currentStatus }: { id: string; currentStatus: CopyTradeStatusEnum }) => void
  copyTradeData: MutableRefObject<CopyTradeData | undefined>
}) {
  const columns = useMemo(() => {
    const handleOpenDrawer = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDrawer(true)
    }

    const handleOpenCloneDrawer = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenCloneDrawer(true)
    }

    const handleOpenDeleteModal = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDeleteModal(true)
    }

    const toggleStatusCopyTrade = (item: CopyTradeData) => {
      if (isMutating) return
      onSelect(item)
      if (item.status === CopyTradeStatusEnum.STOPPED) {
        toggleStatus({ id: item.id, currentStatus: item.status })
        return
      }
      if (item.status === CopyTradeStatusEnum.RUNNING) {
        setOpenConfirmStopModal(true)
        return
      }
    }

    const isRunningFn = (status: CopyTradeStatusEnum) => status === CopyTradeStatusEnum.RUNNING

    const result: ColumnData<CopyTradeData>[] = [
      {
        title: (
          <Box as="span" pl={3}>
            Run/Stop
          </Box>
        ),
        dataIndex: 'status',
        key: 'status',
        sortBy: 'status',
        sortType: SortTypeEnum.ASC,
        style: { minWidth: '110px' },
        render: (item) => (
          <Box pl={3} sx={{ position: 'relative' }}>
            {item.reverseCopy && <ReverseTag />}
            <SwitchInput
              checked={isRunningFn(item.status)}
              onChange={() => {
                toggleStatusCopyTrade(item)
              }}
              isLoading={copyTradeData.current?.id === item.id && isMutating}
              disabled={copyTradeData.current?.id === item.id && isMutating}
            />
          </Box>
        ),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '120px', pr: 3 },
        render: (item) => (
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Type.Caption
              maxWidth={104}
              color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}
              sx={{ ...overflowEllipsis(), display: 'block' }}
              data-tooltip-id={`${item.id}_${item.title}`}
            >
              {item.title ? item.title : '--'}
            </Type.Caption>
            {item.title && isRunningFn(item.status) && (
              <Tooltip id={`${item.id}_${item.title}`} place="top" type="dark" effect="solid">
                <Type.Caption sx={{ maxWidth: 350 }}>{item.title}</Type.Caption>
              </Tooltip>
            )}
          </Flex>
        ),
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '150px' },
        // TODO: 2
        render: (item) =>
          renderTrader(item.account, item.protocol, {
            textSx: {
              color: isRunningFn(item.status) ? 'neutral1' : 'neutral3',
            },
            sx: {
              filter: isRunningFn(item.status) ? 'none' : 'grayscale(1)',
            },
          }),
      },
      {
        title: 'Vol/Order',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => (
          <Type.Caption color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}>
            ${formatNumber(item.volume)}
          </Type.Caption>
        ),
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => (
          <Type.Caption color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}>
            x{formatNumber(item.leverage)}
          </Type.Caption>
        ),
      },
      {
        title: 'Risk Control',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '80px', textAlign: 'left', pl: 3 },
        render: (item) => (
          <Flex
            sx={{
              alignItems: 'center',
              gap: 2,
              filter: isRunningFn(item.status) ? undefined : 'grayscale(1)',
            }}
          >
            {item.enableStopLoss && (
              <>
                <IconBox
                  icon={<Plugs size={16} />}
                  color="#FA5547"
                  sx={{ bg: '#FA55474D', p: '2px', borderRadius: 'sm' }}
                  data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`}
                />
                {isRunningFn(item.status) && (
                  <Tooltip
                    id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`}
                    place="top"
                    type="dark"
                    effect="solid"
                  >
                    <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                      Stoploss:{' '}
                      <Box as="span" color="red1">
                        ${`${formatNumber(item.stopLossAmount, 2, 2)}`}
                      </Box>
                    </Type.Caption>
                  </Tooltip>
                )}
              </>
            )}
            {!!item.maxVolMultiplier && (
              <>
                <IconBox
                  icon={<Radical size={16} />}
                  color="primary1"
                  sx={{ bg: '#97CFFD4D', p: '2px', borderRadius: 'sm' }}
                  data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_MAX_VOL_MULTIPLIER}_${item.id}`}
                />
                {isRunningFn(item.status) && (
                  <Tooltip
                    id={`${TOOLTIP_KEYS.MY_COPY_ICON_MAX_VOL_MULTIPLIER}_${item.id}`}
                    place="top"
                    type="dark"
                    effect="solid"
                  >
                    <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                      Max Volume Multiplier:{' '}
                      <Box as="span" color="red1">
                        {`${formatNumber(item.maxVolMultiplier, 0, 0)}`} times
                      </Box>
                    </Type.Caption>
                  </Tooltip>
                )}
              </>
            )}
          </Flex>
        ),
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>7D PnL</Trans>,
        key: 'pnl7D',
        dataIndex: 'pnl7D',
        sortBy: 'pnl7D',
        render: (item) => (
          <SignedText
            value={item.pnl7D}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            sx={
              isRunningFn(item.status)
                ? undefined
                : {
                    color: 'neutral3',
                  }
            }
          />
        ),
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>30D PnL</Trans>,
        key: 'pnl30D',
        dataIndex: 'pnl30D',
        sortBy: 'pnl30D',
        render: (item) => (
          <SignedText
            value={item.pnl30D}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            sx={
              isRunningFn(item.status)
                ? undefined
                : {
                    color: 'neutral3',
                  }
            }
          />
        ),
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>Total PnL</Trans>,
        key: 'pnl',
        dataIndex: 'pnl',
        sortBy: 'pnl',
        render: (item) => (
          <SignedText
            value={item.pnl}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            sx={
              isRunningFn(item.status)
                ? undefined
                : {
                    color: 'neutral3',
                  }
            }
          />
        ),
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '40px', width: 40, textAlign: 'right', pr: 2 },
        render: (item) => (
          <Flex justifyContent="end">
            <Dropdown
              hasArrow={false}
              menuSx={{
                bg: 'neutral7',
                width: 100,
              }}
              menu={
                <>
                  <ActionItem
                    title={<Trans>Edit</Trans>}
                    icon={<PencilSimpleLine size={18} />}
                    onSelect={() => handleOpenDrawer(item)}
                  />
                  <ActionItem
                    title={<Trans>Clone</Trans>}
                    icon={<CopySimple size={18} />}
                    onSelect={() => handleOpenCloneDrawer(item)}
                  />
                  <ActionItem
                    title={<Trans>Remove</Trans>}
                    icon={<Trash size={18} />}
                    onSelect={() => handleOpenDeleteModal(item)}
                  />
                </>
              }
              sx={{}}
              buttonSx={{
                border: 'none',
                height: '100%',
                p: 0,
                // '&:hover,&:focus,&:active': {
                //   bg: 'neutral7',
                // },
              }}
              placement="topRight"
            >
              <IconButton
                size={24}
                type="button"
                icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
                variant="ghost"
                sx={{
                  color: 'neutral3',
                }}
              />
            </Dropdown>
          </Flex>
        ),
      },
    ]
    return result
  }, [isMutating])
  return columns
}
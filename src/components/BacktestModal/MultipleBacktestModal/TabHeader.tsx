import { XCircle } from '@phosphor-icons/react'
import { Fragment, useEffect, useRef } from 'react'

import AddressCount from 'components/@ui/AddressCount'
import { WarningType } from 'components/BacktestModal/WarningModal'
import useBacktestWarningModal from 'hooks/store/useBacktestWarningModal'
import { TestInstanceData, useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import { Box, Flex, IconBox, Type } from 'theme/base'

export default function TabHeader() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { currentHomeInstanceId, getCommonData, removeInstance, setCurrentBacktestInstanceId } =
    useSelectBacktestTraders()
  const { openModal, dismissModal } = useBacktestWarningModal()
  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  const currentBacktestInstanceId = currentHomeInstance?.currentBacktestInstanceId ?? ''
  const listSelectedTraders = currentHomeInstance?.tradersByIds ?? []

  const handleSelectCurrentTab = (instanceId: string | null) => {
    setCurrentBacktestInstanceId({ homeId: currentHomeInstanceId ?? '', backtestId: instanceId })
  }
  const handleDeleteTab = (instanceId: string) => {
    openModal({
      type: WarningType.CLEAR_RESULT,
      confirmFunction: () => {
        if (currentBacktestInstanceId === instanceId) {
          if (wrapperRef.current) wrapperRef.current.scrollLeft = 0
        }
        removeInstance({ homeId: currentHomeInstanceId ?? '', instanceId })
        dismissModal()
      },
    })
  }
  useEffect(() => {
    const backtestInstancesByIds = currentHomeInstance?.backtestInstancesByIds
    if (backtestInstancesByIds?.[backtestInstancesByIds?.length - 1] === currentBacktestInstanceId) {
      if (wrapperRef.current) wrapperRef.current.scrollLeft = 999999
    }
  }, [currentBacktestInstanceId])

  if (!currentHomeInstanceId || !currentHomeInstance) return <></>

  return (
    <Box sx={{ overflow: 'auto' }} ref={wrapperRef}>
      <Flex sx={{ '& > * ': { flexShrink: 0 } }}>
        <TabTitleComponent
          addressesCount={listSelectedTraders.length}
          title={`Backtest Group`}
          onClickTitle={() => handleSelectCurrentTab(null)}
          isCurrentTab={currentHomeInstance.currentBacktestInstanceId == null}
        />
        {currentHomeInstance.backtestInstancesByIds.map((instanceId) => {
          const instance = currentHomeInstance.backtestInstancesMapping[instanceId]
          if (!instance || !instance.isVisible || instance.stage === 'idle' || instance.stage === 'selecting')
            return <Fragment key={instanceId}></Fragment>
          return (
            <TabTitle
              key={instanceId}
              instanceData={instance}
              currentInstanceId={currentBacktestInstanceId}
              handleClickTabHeaderItem={handleSelectCurrentTab}
              handleDeleteTab={handleDeleteTab}
            />
          )
        })}
      </Flex>
    </Box>
  )
}

function TabTitle({
  instanceData,
  currentInstanceId,
  handleClickTabHeaderItem,
  handleDeleteTab,
}: {
  instanceData: TestInstanceData
  currentInstanceId: string | null
  handleClickTabHeaderItem: (instanceId: string) => void
  handleDeleteTab: (instanceId: string) => void
}) {
  let stageName = ''
  switch (instanceData.stage) {
    case 'setting':
      stageName = 'Backtest Strategy'
      break
    case 'simulating':
      stageName = 'Backtest Simulating'
      break
    case 'simulated':
      stageName = 'Backtest Result'
      break
    default:
      stageName = 'Backtest'
      break
  }
  const titleName = instanceData.name
  const isCurrentTab = currentInstanceId === instanceData.id
  const count = instanceData.listTrader?.length ?? 0
  return (
    <TabTitleComponent
      isCurrentTab={isCurrentTab}
      title={`${stageName} ${titleName}`}
      addressesCount={count}
      onClickTitle={() => handleClickTabHeaderItem(instanceData.id)}
      onDeleteTab={() => handleDeleteTab(instanceData.id)}
    />
  )
}

function TabTitleComponent({
  title,
  isCurrentTab,
  addressesCount,
  onClickTitle,
  onDeleteTab,
}: {
  title: string
  isCurrentTab: boolean
  addressesCount: number
  onClickTitle: () => void
  onDeleteTab?: () => void
}) {
  // const { sm } = useResponsive()
  // const Text = sm ? Type.BodyBold : Type.CaptionBold
  return (
    <Flex
      sx={{
        py: 2,
        px: '12px',
        bg: isCurrentTab ? 'neutral5' : 'transparent',
        alignItems: 'center',
        gap: 2,
        ...(isCurrentTab
          ? {}
          : {
              '&:hover': {
                bg: 'neutral6',
              },
            }),
      }}
    >
      <AddressCount count={addressesCount} color="neutral7" bg="primary1" />
      <Type.CaptionBold
        role="button"
        onClick={() => {
          onClickTitle()
        }}
      >
        {title}{' '}
      </Type.CaptionBold>
      {onDeleteTab && (
        <IconBox
          icon={<XCircle size={24} />}
          onClick={() => onDeleteTab()}
          role="button"
          sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' } }}
        />
      )}
    </Flex>
  )
}

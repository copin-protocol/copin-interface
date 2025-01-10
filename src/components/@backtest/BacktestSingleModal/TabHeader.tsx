import { MinusSquare, PlusCircle, XCircle } from '@phosphor-icons/react'

import { Flex, IconBox } from 'theme/base'

import { BacktestInstanceData, BacktestState } from '../types'

export default function TabHeader({
  state,
  onSelectItem,
  onDeleteItem,
  onAddNewItem,
  onMinimize,
}: {
  state: BacktestState
  onSelectItem: (id: string) => void
  onDeleteItem: (id: string) => void
  onAddNewItem: () => void
  onMinimize: () => void
}) {
  const currentInstanceId = state.currentInstanceId
  return (
    <Flex sx={{ gap: 3, alignItems: 'center', width: '100%' }}>
      <Flex flex="1" sx={{ alignItems: 'center', overflow: 'auto' }}>
        <Flex sx={{ alignItems: 'center', maxWidth: '100%', width: '100%' }}>
          {state.instanceIds.map((id) => {
            const isSelected = id === currentInstanceId
            return (
              <Flex
                key={id}
                sx={{
                  // position: 'relative',
                  overflow: 'hidden',
                  marginTop: isSelected ? '1px' : 0,
                  alignItems: 'center',
                  bg: '#000',
                  borderRight: `small`,
                  borderBottom: isSelected ? 'none' : 'small',
                  borderColor: 'neutral4',

                  gap: 2,
                  px: 3,
                  flexShrink: 0,
                }}
              >
                <Flex
                  role="button"
                  onClick={() => onSelectItem(id)}
                  sx={{
                    flex: 1,
                    height: 48,
                    fontSize: [12, 14],
                    fontWeight: 700,
                    lineHeight: '48px',
                  }}
                >
                  {getTitle({ instanceData: state.instancesMapping[id] })}
                </Flex>
                <IconBox
                  role="button"
                  onClick={() => onDeleteItem(id)}
                  icon={<XCircle size={24} />}
                  sx={{ flexShrink: 0, lineHeight: 0, color: 'neutral3', '&:hover': { color: 'neutral2' } }}
                />
              </Flex>
            )
          })}
          <Flex
            flex="1"
            justifyContent="start"
            alignItems="center"
            sx={{
              height: '49px',
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            <IconBox
              role="button"
              onClick={onAddNewItem}
              icon={<PlusCircle size={24} />}
              sx={{ flexShrink: 0, color: 'primary1', '&:hover': { color: 'primary2' }, px: '12px' }}
            />
          </Flex>
        </Flex>
      </Flex>
      <IconBox
        role="button"
        onClick={onMinimize}
        icon={<MinusSquare size={24} />}
        sx={{ color: 'neutral3', flexShrink: 0, '&:hover': { color: 'neutral2' }, mr: 3 }}
      />
    </Flex>
  )
}

function getTitle({ instanceData }: { instanceData: BacktestInstanceData }) {
  let desc = 'Backtest'
  switch (instanceData.status) {
    case 'setting':
      desc = 'Backtest Strategy'
      break
    case 'testing':
      desc = 'Backtest Simulating'
      break
    case 'tested':
      desc = 'Backtest Result'
      break
    default:
      break
  }
  return `${desc} ${instanceData.order}`
}

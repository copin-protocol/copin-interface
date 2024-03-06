import { ArrowElbowLeftUp } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { memo, useState } from 'react'

import { CompareButton } from 'components/BacktestPickTradersButton'
import TraderListTable from 'components/Tables/TraderListTable'
import { mobileTableSettings, tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import TraderListCard from 'components/TraderListCard'
import { TraderData } from 'entities/trader.d'
import useQueryTraders from 'pages/Explorer/ListTradersSection/useQueryTraders'
import { TradersContextData } from 'pages/Explorer/useTradersContext'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'

function ListTraderFavorites({
  contextValues,
  notes,
}: {
  contextValues: TradersContextData
  notes: { [key: string]: string }
}) {
  const { sm } = useResponsive()
  const settings = sm ? tableSettings : mobileTableSettings
  const {
    protocol,
    tab,
    accounts,
    isRangeSelection,
    timeRange,
    timeOption,
    currentSort,
    changeCurrentSort,
    filterTab,
  } = contextValues

  const { data, isLoading, isRangeProgressing, loadingRangeProgress } = useQueryTraders({
    protocol,
    tab,
    timeRange,
    timeOption,
    isRangeSelection,
    accounts,
    filterTab,
  })

  const [selectedTraders, setSelectedTraders] = useState<string[]>([])
  const handleSelect = ({ isSelected, data }: { isSelected: boolean; data: TraderData }) => {
    setSelectedTraders((prev) => {
      if (isSelected) {
        return prev.filter((address) => address !== data.account)
      }
      return [...prev, data.account]
    })
  }
  const checkIsSelected = (data: TraderData) => selectedTraders.includes(data.account)
  const formatedData = data?.data.map((item) => ({ ...item, note: notes ? notes[item.account] : undefined }))

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <>
        {isRangeProgressing ? (
          <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box mt={4} mb={3} variant="card" sx={{ mx: 'auto', maxWidth: 600, width: '100%' }}>
              <Type.Body textAlign="center" display="block" mb={24}>
                Data is being processed. Please wait a few minutes
              </Type.Body>
              <ProgressBar
                percent={((loadingRangeProgress?.processed ?? 0) / (loadingRangeProgress?.total ?? 0)) * 100}
                height={8}
                color="primary1"
                bg="neutral6"
              />
            </Box>
          </Flex>
        ) : null}
      </>
      {isRangeProgressing ? null : (
        <>
          <Box
            flex="1 0 0"
            sx={{
              overflow: 'hidden',
              borderBottom: 'small',
              borderBottomColor: 'neutral5',
              bg: 'neutral7',
              position: 'relative',
            }}
          >
            {sm ? (
              <TraderListTable
                data={formatedData}
                isLoading={isLoading}
                currentSort={currentSort}
                changeCurrentSort={changeCurrentSort}
                handleSelectAll={null}
                tableSettings={settings}
                checkIsSelected={checkIsSelected}
                handleSelect={handleSelect}
              />
            ) : (
              <TraderListCard data={formatedData} isLoading={isLoading} />
            )}
          </Box>

          <CompareTradersButton selectedTraders={selectedTraders} />
        </>
      )}
    </Flex>
  )
}

export default memo(ListTraderFavorites)

function CompareTradersButton({ selectedTraders }: { selectedTraders: string[] }) {
  return (
    <Box
      display={{ _: 'none', lg: 'flex' }}
      width={['100%', 228]}
      height={40}
      sx={{
        alignItems: 'center',
        gap: 2,
        px: selectedTraders.length === 2 ? 0 : 3,
        flexShrink: 0,
        borderRight: 'small',
        borderColor: ['transparent', 'neutral4'],
      }}
      color="neutral3"
    >
      {selectedTraders.length === 2 ? (
        <CompareButton listAddress={selectedTraders} hasDivider={false} block />
      ) : (
        <>
          <ArrowElbowLeftUp size={16} />
          <Type.Caption color="neutral3">Select 2 traders to compare</Type.Caption>
        </>
      )}
    </Box>
  )
}

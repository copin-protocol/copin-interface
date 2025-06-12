import { Pencil, X } from '@phosphor-icons/react'
import React, { memo, useCallback, useState } from 'react'

import { CloseOnchainPositionModal } from 'components/@position/CopyPositionDetails/CloseOnchainPosition'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import LabelEPnL from 'components/@ui/LabelEPnL'
import TraderAddress from 'components/@ui/TraderAddress'
import { renderEntry, renderOpeningPnL, renderOpeningRoi, renderSizeOpening } from 'components/@widgets/renderProps'
import { CopyWalletData } from 'entities/copyWallet'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import IconButton from 'theme/Buttons/IconButton'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { UsdPrices } from 'utils/types'
import { ARBITRUM_CHAIN, OPTIMISM_CHAIN } from 'utils/web3/chains'

import ModifyTPSLModal from '../DCPManagement/ModifyTPSLModal'
import useDCPManagementContext from '../DCPManagement/useDCPManagementContext'
import { OnchainPositionData } from './schema'

type ExternalSource = {
  prices: UsdPrices
  gainsPrices: UsdPrices
  onClose: (item: OnchainPositionData) => void
  onSetSltp: (item: OnchainPositionData) => void
}
const sourceColumn: ColumnData<OnchainPositionData> = {
  title: 'Source Trader',
  dataIndex: 'source',
  key: 'source',
  sortBy: 'source',
  style: { width: '160px' },
  render: (item) =>
    !!(item.source && item.sourceProtocol) ? (
      <TraderAddress
        address={item.source}
        protocol={item.protocol}
        options={{
          wrapperSx: {
            width: '160px',
          },
        }}
      />
    ) : (
      <Type.Caption>--</Type.Caption>
    ),
}
const entryColumn: ColumnData<OnchainPositionData> = {
  title: 'Entry',
  dataIndex: 'averagePrice',
  key: 'averagePrice',
  sortBy: 'averagePrice',
  style: { width: '150px' },
  render: (item) => renderEntry(item as unknown as PositionData),
}
const sizeOpeningColumn: ColumnData<OnchainPositionData> = {
  title: 'Value',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { width: '215px' },
  render: (item) => renderSizeOpening(item as unknown as PositionData),
}

const pnlOpeningColumn: ColumnData<OnchainPositionData> = {
  title: <LabelEPnL />,
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { width: '90px', textAlign: 'right' },
  render: (item) => renderOpeningPnL(item as unknown as PositionData),
}

const roiOpeningColumn: ColumnData<OnchainPositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { width: '90px', textAlign: 'right' },
  render: (item) => renderOpeningRoi(item as unknown as PositionData),
}

const durationColumn: ColumnData<OnchainPositionData> = {
  title: 'Time',
  dataIndex: 'createdAt',
  key: 'createdAt',
  style: { width: '50px' },
  render: (item) => (
    <Type.Caption color="neutral3">
      {item.createdAt ? <RelativeShortTimeText date={item.createdAt} /> : '--'}
    </Type.Caption>
  ),
}

const sltpColumn: ColumnData<OnchainPositionData> = {
  title: 'SL / TP',
  dataIndex: 'sl',
  key: 'sl',
  sortBy: 'sl',
  style: { minWidth: '200px', textAlign: 'right' },
  render: (item, index, { onSetSltp }: any) => (
    <Flex justifyContent="end" sx={{ gap: 2 }} alignItems="center">
      <Type.Caption>
        {item.sl ? PriceTokenText({ value: item.sl, maxDigit: 2, minDigit: 2, sx: { color: 'neutral1' } }) : '--'}
      </Type.Caption>
      <Type.Caption>/</Type.Caption>
      <Type.Caption>
        {item.tp ? PriceTokenText({ value: item.tp, maxDigit: 2, minDigit: 2, sx: { color: 'neutral1' } }) : '--'}
      </Type.Caption>
      <IconButton
        onClick={(e: any) => {
          e.stopPropagation()
          onSetSltp(item)
        }}
        variant="outline"
        size={24}
        icon={<Pencil size={14} />}
        sx={{ borderColor: 'neutral4', '&:hover': { borderColor: 'neutral3' } }}
      />
    </Flex>
  ),
}

const OnchainPositionContainer = ({ activeWallet }: { activeWallet: CopyWalletData }) => {
  const {
    onchainPositions,
    positionsMapping,
    loadingOnchainPositions,
    reloadOnchainPositions,
    setCurrentOnchainPosition,
  } = useDCPManagementContext()

  const [openingCloseData, openCloseData] = useState<OnchainPositionData>()
  const [openingSltpData, openSltpData] = useState<OnchainPositionData>()
  const { prices, gainsPrices } = useGetUsdPrices()

  const openingColumns: ColumnData<OnchainPositionData, ExternalSource>[] = [
    durationColumn,
    sourceColumn,
    entryColumn,
    sizeOpeningColumn,
    sltpColumn,
    pnlOpeningColumn,
    roiOpeningColumn,
    {
      title: '',
      dataIndex: 'index',
      key: 'index',
      style: { minWidth: '30px', textAlign: 'right' },
      render: (item, index, { onClose }: any) => (
        <Flex sx={{ position: 'relative' }} justifyContent="right" alignItems="center">
          <IconButton
            onClick={(e: any) => {
              e.stopPropagation()
              onClose(item)
            }}
            variant="outline"
            size={24}
            icon={<X size={14} />}
            sx={{
              borderColor: 'neutral4',
              '&:hover': { borderColor: 'neutral3', color: 'red1' },
            }}
          />
        </Flex>
      ),
    },
  ]
  const onClose = (item: OnchainPositionData) => {
    openCloseData(item)
  }

  const onSetSltp = (item: OnchainPositionData) => {
    openSltpData(item)
  }

  const handleSelectItem = (item?: OnchainPositionData) => {
    setCurrentOnchainPosition(item)
  }

  const handleModifySltp = useCallback(() => openSltpData(undefined), [])

  return (
    <Box width="100%" height="100%">
      {!onchainPositions?.length && !loadingOnchainPositions && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">Your Onchain Positions Is Empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once you have a position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {!!onchainPositions?.length && (
        <Box overflow="hidden" height="100%" minWidth="950px">
          <Table
            isLoading={loadingOnchainPositions}
            data={onchainPositions.map((onchainPosition) => ({
              ...onchainPosition,
              source: positionsMapping?.[onchainPosition.index]?.copyAccount,
              sourceProtocol: positionsMapping?.[onchainPosition.index]?.protocol,
              fee: positionsMapping?.[onchainPosition.index]?.fee,
              createdAt: positionsMapping?.[onchainPosition.index]?.createdAt,
              copyPositionId: positionsMapping?.[onchainPosition.index]?.id,
            }))}
            columns={openingColumns}
            externalSource={{ prices, gainsPrices, onClose, onSetSltp }}
            onClickRow={handleSelectItem}
            wrapperSx={{
              table: {
                '& th:last-child, td:last-child': {
                  pr: 2,
                },
                '& td:last-child': {
                  pr: 2,
                },
              },
            }}
            restrictHeight={true}
          />
        </Box>
      )}
      {/*{!!openingCloseData && (*/}
      {/*  <ClosePositionGnsV8Modal*/}
      {/*    isOpen={!!openingCloseData}*/}
      {/*    position={openingCloseData}*/}
      {/*    smartWallet={activeWallet.smartWalletAddress as string}*/}
      {/*    onDismiss={(isSuccess) => {*/}
      {/*      if (isSuccess) {*/}
      {/*        reloadOnchainPositions()*/}
      {/*      }*/}
      {/*      openCloseData(undefined)*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
      {!!openingCloseData && (
        <CloseOnchainPositionModal
          copyWalletId={activeWallet.id}
          isOpen
          onDismiss={(success?: boolean) => {
            if (success) {
              reloadOnchainPositions()
            }
            openCloseData(undefined)
          }}
          position={{
            copyPositionId: openingCloseData.copyPositionId ?? '',
            indexToken: openingCloseData.indexToken,
            isLong: openingCloseData.isLong,
            averagePrice: openingCloseData.averagePrice,
            protocol: openingCloseData.protocol,
            address: openingCloseData?.address,
            index: openingCloseData?.index,
          }}
        />
      )}
      {!!openingSltpData && (
        <ModifyTPSLModal isOpen={!!openingSltpData} onDismiss={handleModifySltp} positionData={openingSltpData} />
      )}
    </Box>
  )
}

const OnchainPositions = memo(function OnchainPositionsRenderer({ activeWallet }: { activeWallet: CopyWalletData }) {
  const { isValid, alert } = useRequiredChain({
    chainId: activeWallet.exchange === CopyTradePlatformEnum.GNS_V8 ? ARBITRUM_CHAIN : OPTIMISM_CHAIN,
  })
  return isValid ? (
    !!activeWallet.smartWalletAddress ? (
      <OnchainPositionContainer activeWallet={activeWallet} />
    ) : (
      <></>
    )
  ) : (
    <Box mt={-2}>{alert}</Box>
  )
})

export default OnchainPositions

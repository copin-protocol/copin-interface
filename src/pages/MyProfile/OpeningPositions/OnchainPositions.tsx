import { X } from '@phosphor-icons/react'
import { formatUnits } from 'ethers/lib/utils'
import { memo, useState } from 'react'

import { ClosePositionGnsV8Modal } from 'components/@position/CopyPositionDetails/ClosePositionGnsV8'
import { minimumOpeningColums } from 'components/@position/configs/traderPositionRenderProps'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { useContract } from 'hooks/web3/useContract'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import IconButton from 'theme/Buttons/IconButton'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'

interface OnchainPositionData {
  index: number
  indexToken: string
  leverage: number
  collateral: number
  size: number
  averagePrice: number
  fee: number
  isLong: boolean
  protocol: ProtocolEnum
}

type ExternalSource = {
  prices: UsdPrices
  onClose: (item: OnchainPositionData) => void
}

const OnchainPositionContainer = ({ address }: { address: string }) => {
  const [openingCloseData, openCloseData] = useState<OnchainPositionData>()
  const { prices } = useGetUsdPrices()

  const gainsContract = useContract({
    contract: {
      address: '0xFF162c694eAA571f685030649814282eA457f169',
      abi: [
        {
          inputs: [{ internalType: 'address', name: '_trader', type: 'address' }],
          name: 'getTrades',
          outputs: [
            {
              components: [
                { internalType: 'address', name: 'user', type: 'address' },
                { internalType: 'uint32', name: 'index', type: 'uint32' },
                { internalType: 'uint16', name: 'pairIndex', type: 'uint16' },
                { internalType: 'uint24', name: 'leverage', type: 'uint24' },
                { internalType: 'bool', name: 'long', type: 'bool' },
                { internalType: 'bool', name: 'isOpen', type: 'bool' },
                { internalType: 'uint8', name: 'collateralIndex', type: 'uint8' },
                { internalType: 'enum ITradingStorage.TradeType', name: 'tradeType', type: 'uint8' },
                { internalType: 'uint120', name: 'collateralAmount', type: 'uint120' },
                { internalType: 'uint64', name: 'openPrice', type: 'uint64' },
                { internalType: 'uint64', name: 'tp', type: 'uint64' },
                { internalType: 'uint64', name: 'sl', type: 'uint64' },
                { internalType: 'uint192', name: '__placeholder', type: 'uint192' },
              ],
              internalType: 'struct ITradingStorage.Trade[]',
              name: '',
              type: 'tuple[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    },
  })
  const { data, isLoading, refetch } = useContractQuery<OnchainPositionData[]>(gainsContract, 'getTrades', [address], {
    refetchInterval: 10000,
    select: (data: any[]) => {
      return data.map((item) => {
        const collateral = Number(formatUnits(item[8], 6))
        const leverage = item[3] / 1000
        return {
          index: item[1],
          indexToken: `GNS-${item[2]}`,
          leverage,
          collateral,
          size: collateral * leverage,
          averagePrice: Number(formatUnits(item[9], 10)),
          fee: 0,
          isLong: item[4],
          protocol: ProtocolEnum.GNS,
        }
      })
    },
  })

  const openingColumns: ColumnData<PositionData, ExternalSource>[] = [
    ...minimumOpeningColums,
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      style: { minWidth: '30px', textAlign: 'right' },
      render: (item, index, { onClose }: any) => (
        <Flex sx={{ position: 'relative', top: '2px' }} justifyContent="right">
          <IconButton
            onClick={() => onClose(item as unknown as PositionData)}
            variant="outline"
            size={24}
            icon={<X size={14} />}
            sx={{ borderColor: 'neutral4', '&:hover': { borderColor: 'neutral3' } }}
          />
        </Flex>
      ),
    },
  ]
  const onClose = (item: OnchainPositionData) => {
    openCloseData(item)
  }
  return (
    <>
      {!data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">Your Onchain Positions Is Empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once you have a position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {!!data?.length && (
        <Box overflow="hidden" height="100%" minWidth="500px">
          <Table
            isLoading={isLoading}
            data={data as unknown as PositionData[]}
            columns={openingColumns}
            externalSource={{ prices, onClose }}
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
      {!!openingCloseData && (
        <ClosePositionGnsV8Modal
          isOpen={!!openingCloseData}
          position={openingCloseData}
          smartWallet={address}
          onDismiss={(isSuccess) => {
            if (isSuccess) {
              refetch()
            }
            openCloseData(undefined)
          }}
        />
      )}
    </>
  )
}

const OnchainPositions = memo(function OnchainPositionsRenderer({ address }: { address: string }) {
  const { isValid, alert } = useRequiredChain({
    chainId: ARBITRUM_CHAIN,
  })
  return isValid ? <OnchainPositionContainer address={address} /> : <Box>{alert}</Box>
})

export default OnchainPositions

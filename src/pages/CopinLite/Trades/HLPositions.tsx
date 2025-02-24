import { useResponsive } from 'ahooks'

import CopyOpeningPositions from 'components/@position/CopyOpeningPositions'
import LiteFilterOpeningPositionTrader from 'components/@position/CopyOpeningPositions/LiteOpeningFilterTrader'
import { parseHLCopyPositionData } from 'components/@position/helpers/hyperliquid'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { STORAGE_KEYS } from 'utils/config/keys'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import useMobileLayoutHandler from '../useMobileLayoutHandler'

const LiteHLOpeningPositions = () => {
  const { loadingEmbeddedWallets, embeddedWalletInfo, reloadEmbeddedWalletInfo } = useCopyWalletContext()

  const { lg } = useResponsive()
  const { layoutType: mobileLayoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_OPENING_LAYOUT,
    mobileBreakpoint: lg,
  })
  const hlCopyPositions = parseHLCopyPositionData({ data: embeddedWalletInfo?.assetPositions })

  return (
    <Flex flexDirection="column" height="100%" width="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <>
          {!lg && (
            <Flex
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 'small',
                borderBottomColor: 'neutral4',
                px: 3,
              }}
            >
              <LiteFilterOpeningPositionTrader type="textAndIcon" />
              <SwitchLayoutButtons layoutType={mobileLayoutType} onChangeType={handleChangeLayout} />
            </Flex>
          )}
          <Box flex="1 0 0" overflow="hidden" pt={1} sx={{ position: 'relative' }}>
            <CopyOpeningPositions
              data={hlCopyPositions}
              isLoading={false}
              layoutType="lite"
              excludingColumnKeys={['createdAt', 'copyAccount']}
              mobileLayoutType={mobileLayoutType}
              onClosePositionSuccess={() => reloadEmbeddedWalletInfo?.()}
              tableProps={{
                scrollToTopDependencies: null,
                wrapperSx: {
                  '& td': {
                    pt: '6px!important',
                    pb: '6px!important',
                  },
                },
              }}
            />
          </Box>
        </>
      )}
    </Flex>
  )
}

export default LiteHLOpeningPositions

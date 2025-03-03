import { useResponsive } from 'ahooks'

import { drawerOrderColumns, fullOrderColumns, orderColumns } from 'components/@position/configs/hlOrderRenderProps'
import { HlOrderData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { Box, Flex, Type } from 'theme/base'

import HLOpenOrderListView from './HLOpenOrderListView'

export default function OpenOrdersView({
  data,
  isLoading,
  isExpanded,
  isDrawer,
}: {
  data: HlOrderData[] | undefined
  isLoading: boolean
  isExpanded: boolean
  isDrawer: boolean
}) {
  const { lg, xl, sm } = useResponsive()

  const dataLength = data?.length ?? 0
  return (
    <>
      {isLoading && <Loading />}
      {!dataLength && !isLoading && (
        <Flex
          p={3}
          flexDirection="column"
          width="100%"
          height={isDrawer ? 60 : 180}
          justifyContent="center"
          alignItems="center"
        >
          <Type.CaptionBold display="block">This trader&quot;s opening orders is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" textAlign="center" display="block">
            Once the trader starts a new open order, you&quot;ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {dataLength > 0 && (
        <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
          {sm ? (
            <Table
              restrictHeight={(!isDrawer && lg) || (isDrawer && isDrawer && dataLength > 10)}
              wrapperSx={{
                minWidth: 500,
                minHeight: isDrawer && dataLength > 10 ? 368 : undefined,
              }}
              tableBodySx={{
                '& td:last-child': { pr: 2 },
              }}
              data={data}
              columns={isDrawer ? drawerOrderColumns : xl && isExpanded ? fullOrderColumns : orderColumns}
              isLoading={isLoading}
              renderRowBackground={() => (isDrawer ? 'transparent' : 'rgb(31, 34, 50)')}
              scrollToTopDependencies={DISABLED_SCROLL_DEPS}
            />
          ) : (
            <HLOpenOrderListView data={data} isLoading={isLoading} scrollDep={DISABLED_SCROLL_DEPS} />
          )}
        </Box>
      )}
    </>
  )
}

const DISABLED_SCROLL_DEPS: any[] = []

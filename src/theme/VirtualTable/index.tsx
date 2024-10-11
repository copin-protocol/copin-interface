import { useEffect, useRef } from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

import { VirtualTableProps } from './types'

export default function Table<T, K>({
  data,
  columns,
  isLoading,
  footer,
  onClickRow,
  currentSort,
  changeCurrentSort,
  externalSource,
  containerSx = {},
  loadingSx,
  scrollRef,
  isInfiniteLoad = false,
  dataMeta,
  scrollToTopDependencies,
  noDataMessage,
}: VirtualTableProps<T, K>) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sourceRef = isInfiniteLoad ? scrollRef : bodyRef
    const handleScrollHorizontal = () => {
      if (!sourceRef?.current || !headRef.current) return
      const scrollLeft = sourceRef.current?.scrollLeft
      headRef.current.scrollLeft = scrollLeft
    }
    sourceRef?.current?.addEventListener('scroll', handleScrollHorizontal)
    return () => sourceRef?.current?.removeEventListener('scroll', handleScrollHorizontal)
  }, [isLoading])
  useEffect(
    () => {
      if (!data || isInfiniteLoad) return
      bodyRef?.current?.scrollTo(0, 0)
    },
    scrollToTopDependencies ? scrollToTopDependencies : [data]
  )
  return null
  // <Flex
  //   className="table_container"
  //   sx={{ flexDirection: 'column', width: '100%', height: '100%', position: 'relative', ...containerSx }}
  // >
  //   {!!data?.length && (
  //     <>

  //       <Box
  //         flex="1 0 0"
  //         sx={{ overflow: restrictHeight ? 'auto' : 'unset', ...(tableBodyWrapperSx ?? {}) }}
  //         ref={isInfiniteLoad ? scrollRef : bodyRef}
  //       >
  //         <TableBody
  //           data={data}
  //           columns={columns}
  //           sx={rowSx}
  //           onClickRow={onClickRow}
  //           renderRowBackground={renderRowBackground}
  //           externalSource={externalSource}
  //           handleSelect={handleSelect}
  //           checkIsSelected={checkIsSelected}
  //           checkIsTop={checkIsTop}
  //           // title={title}
  //           // subTitle={subTitle}
  //         />

  //         {isInfiniteLoad && !isLoading && (dataMeta?.total ?? 0) === data.length && (
  //           <Flex
  //             sx={{
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               bg: 'neutral6',
  //               height: 40,
  //             }}
  //           >
  //             <Type.Caption color="neutral3">End of list</Type.Caption>
  //           </Flex>
  //         )}
  //       </Box>
  //     </>
  //   )}

  //   {!isInfiniteLoad && isLoading && (
  //     <Box
  //       sx={{
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         zIndex: 10,
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         backdropFilter: 'blur(2px)',
  //         bg: 'modalBG',
  //       }}
  //     >
  //       <Loading />
  //     </Box>
  //   )}

  //   {!isLoading && !!data && data.length === 0 && (
  //     <Box mb={24} sx={{ bg: 'neutral8', borderRadius: 'sm' }}>
  //       <NoDataFound message={noDataMessage} />
  //     </Box>
  //   )}

  //   {isInfiniteLoad && isLoading && (
  //     <Flex
  //       sx={{
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         gap: 3,
  //         backdropFilter: 'blur(5px)',
  //         bg: 'modalBG',
  //         height: 40,
  //         position: 'absolute',
  //         bottom: 0,
  //         left: 0,
  //         right: 0,
  //         ...loadingSx,
  //       }}
  //     >
  //       <Box>
  //         <Loading size={20} />
  //       </Box>
  //       {dataMeta && data && (
  //         <Type.Caption color="neutral2">
  //           {data.length} / {dataMeta.total}
  //         </Type.Caption>
  //       )}
  //     </Flex>
  //   )}

  //   {!!footer ? <Box sx={{ position: 'sticky', left: 0 }}>{footer}</Box> : null}
  // </Flex>
}

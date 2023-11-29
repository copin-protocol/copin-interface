import { useResponsive } from 'ahooks'
import { ReactNode, RefObject, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import NoDataFound from 'components/@ui/NoDataFound'
import { useHomeCustomizeStore } from 'hooks/store/useHomeCustomize'
import { Box, Flex } from 'theme/base'
import { Colors } from 'theme/types'

import TableBody from './TableBody'
import TableHead from './TableHead'
import { TableSettingsProps, TraderListSortProps } from './dataConfig'

export default function TraderListTable<T>({
  data,
  isLoading,
  currentSort,
  changeCurrentSort,
  hideCustomColumns = false,
  tableSettings,
  isSelectedAll,
  handleSelectAll,
  checkIsSelected,
  handleSelect,
  hasCustomize = true,
  freezeBg = 'neutral6',
}: {
  data: T[] | undefined
  isLoading: boolean
  currentSort?: TraderListSortProps<T>
  changeCurrentSort?: (sort: TraderListSortProps<T> | undefined) => void
  hideCustomColumns?: boolean
  tableSettings: TableSettingsProps<T>
  isSelectedAll?: boolean
  handleSelectAll?: (isSelectedAll: boolean) => void
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
  scrollRef?: RefObject<HTMLDivElement | null>
  hasCustomize?: boolean
  freezeBg?: keyof Omit<Colors, 'darkMode'>
}) {
  const { userTraderList } = useHomeCustomizeStore()

  const bodyRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!bodyRef.current || !headRef.current) return
    const handleScrollHorizontal = () => {
      if (!bodyRef.current || !headRef.current) return
      const scrollLeft = bodyRef.current?.scrollLeft
      headRef.current.scrollLeft = scrollLeft
    }
    bodyRef.current.addEventListener('scroll', handleScrollHorizontal)
  }, [])
  useEffect(() => {
    if (!isLoading) return
    bodyRef.current?.scrollTo(0, 0)
  }, [isLoading])
  const { sm } = useResponsive()
  return (
    <>
      <Flex
        sx={{
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <TableWrapper
          sx={{
            ...(sm
              ? {}
              : {
                  '& *': { fontSize: '13px !important', lineHeight: '18px !important' },
                }),
          }}
          freezebg={freezeBg}
        >
          <Box sx={{ width: '100%', overflow: 'hidden' }} ref={headRef}>
            <TableContainer>
              <TableHead
                hasData={!!data?.length}
                tableSettings={tableSettings}
                currentSort={currentSort}
                changeCurrentSort={changeCurrentSort}
                hideCustomColumns={hideCustomColumns}
                visibleColumns={hasCustomize ? userTraderList : tableSettings.map((setting) => setting.id as string)}
                isSelectedAll={isSelectedAll}
                handleSelectedAll={handleSelectAll}
              />
            </TableContainer>
          </Box>
          <Box flex="1 1 0" sx={{ width: '100%', overflow: 'auto' }} id="trader-table" ref={bodyRef}>
            <TableContainer>
              <TableBody
                data={data}
                isLoading={isLoading}
                tableSettings={tableSettings}
                visibleColumns={hasCustomize ? userTraderList : tableSettings.map((setting) => setting.id as string)}
                checkIsSelected={checkIsSelected}
                handleSelect={handleSelect}
              />
            </TableContainer>
            {!isLoading && !data?.length && <NoDataFound />}
          </Box>
        </TableWrapper>
      </Flex>
    </>
  )
}

function TableContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      as="table"
      textAlign="left"
      sx={{
        width: '100%',
        '& th, td': { verticalAlign: 'middle' },
        '& th': { pb: 10, pt: 20 },
        '& td': { py: '2px' },
      }}
    >
      {children}
    </Box>
  )
}

const TableWrapper = styled(Box)<{ freezebg: keyof Omit<Colors, 'darkMode'> }>`
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  & thead {
    background-color: ${({ theme }) => theme.colors.neutral8};
    color: ${({ theme }) => theme.colors.neutral3};
    text-transform: uppercase;
    text-align: right;
  }

  .column-hide {
    display: none;
  }
  .column-freeze {
    background-color: ${({ theme, freezebg }) => theme.colors[freezebg]};
  }

  & tbody {
    text-align: right;
    .hiding-btn {
      opacity: 0;
      transition: all 240ms ease;
    }
    & tr {
      background-color: ${({ theme }) => theme.colors.neutral8};
      &:hover {
        background-color: ${({ theme }) => theme.colors.neutral5};
        .hiding-btn {
          opacity: 1;
        }
        .column-freeze {
          background-color: ${({ theme }) => theme.colors.neutral5};
        }
      }
    }
  }
`

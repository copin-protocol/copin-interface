import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode, RefObject, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import NoDataFound from 'components/@ui/NoDataFound'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'
import { useTraderExplorerTableColumns } from 'hooks/store/useTraderCustomizeColumns'
import { Box, Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Colors } from 'theme/types'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import reorderArray from 'utils/helpers/reorderArray'

import TableBody from './TableBody'
import TableHead from './TableHead'
import { emptyColumn } from './configs'
import { TableSettingsProps, TraderListSortProps } from './types'

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
  hiddenSelectAllBox,
  hiddenSelectItemBox,
  lefts = [36, 48],
  noDataMessage,
  learnMoreSection,
}: {
  data: T[] | undefined
  isLoading: boolean
  currentSort?: TraderListSortProps<T>
  changeCurrentSort?: (sort: TraderListSortProps<T> | undefined) => void
  hideCustomColumns?: boolean
  tableSettings: TableSettingsProps<T>
  isSelectedAll?: boolean
  handleSelectAll?: ((isSelectedAll: boolean) => void) | null
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
  scrollRef?: RefObject<HTMLDivElement | null>
  hasCustomize?: boolean
  freezeBg?: keyof Omit<Colors, 'darkMode'>
  hiddenSelectAllBox?: boolean
  hiddenSelectItemBox?: boolean
  lefts?: [number, number]
  noDataMessage?: ReactNode
  learnMoreSection?: SubscriptionFeatureEnum
}) {
  const { columnKeys: visibleColumns } = useTraderExplorerTableColumns()

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

  const { isEliteUser, fieldsAllowed } = useExplorerPermission()
  const { userNextPlan } = useUserNextPlan()
  const _tableSettings = useMemo(() => {
    return isEliteUser
      ? tableSettings
      : reorderArray({
          source: fieldsAllowed,
          target:
            visibleColumns.length > 1 ? tableSettings : ([...tableSettings, emptyColumn] as TableSettingsProps<T>),
          getValue: (data) => data.id,
        }).map((v) => ({ ...v, sortBy: fieldsAllowed.includes(v.id as string) ? v.sortBy : undefined }))
  }, [fieldsAllowed, isEliteUser, tableSettings, visibleColumns])
  const { sm } = useResponsive()

  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!bodyRef.current || !data?.length) return
    const rows = bodyRef.current.querySelectorAll(`[data-table-cell-row-index="0"]`)
    let attr = ''
    for (const cell of rows) {
      const _attr = cell.getAttribute('data-table-cell-key')
      const isVisible = visibleColumns.includes(_attr as any)
      if (!fieldsAllowed.includes(_attr as any) && isVisible) {
        attr = _attr as string
        break
      }
    }

    const listBodyCell = attr ? bodyRef.current.querySelectorAll(`[data-table-cell-key="${attr as any}"]`) : undefined
    const accountCell = bodyRef.current.querySelector(`[data-table-cell-key="account"][data-table-cell-row-index="0"]`)
    const topLeftElement: Element | undefined = listBodyCell?.[0]

    const handleResize = () => {
      if (!topLeftElement && overlayRef.current) {
        overlayRef.current.style.display = 'none'
        return
      }
      if (overlayRef.current) {
        overlayRef.current.style.display = 'flex'
        const topLeftRect = topLeftElement?.getBoundingClientRect()
        const bodyRect = bodyRef.current?.getBoundingClientRect()
        const accountRect = accountCell?.getBoundingClientRect()
        overlayRef.current.style.left = `${Math.max(
          topLeftRect?.x ?? 0,
          (bodyRect?.x ?? 0) + (accountRect?.width ?? 0)
        )}px`
        overlayRef.current.style.top = `${bodyRect?.y ?? 0}px`
        overlayRef.current.style.right = `${window.innerWidth - (bodyRect?.x ?? 0) - (bodyRect?.width ?? 0)}px`
        overlayRef.current.style.height = `${bodyRect?.height ?? 0}px`
        if (overlayRef.current.clientWidth > 1) {
          overlayRef.current.style.borderLeft = `1px solid ${themeColors.neutral4}`
        } else {
          overlayRef.current.style.borderLeft = 'none'
        }
        if (overlayRef.current.clientWidth > 200) {
          overlayRef.current.classList.add('active')
        } else {
          overlayRef.current.classList.remove('active')
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const multiplier = 1.2
      const deltaScale = e.deltaMode === 1 ? 20 : 1

      let scrollX = 0
      let scrollY = 0

      if (e.shiftKey) {
        scrollX = e.deltaY * multiplier * deltaScale
      } else {
        scrollX = e.deltaX * multiplier * deltaScale
        scrollY = e.deltaY * multiplier * deltaScale
      }

      bodyRef.current?.scrollBy({
        left: scrollX,
        top: scrollY,
        behavior: 'auto', // Using 'auto' instead of 'smooth' for better macOS compatibility
      })
    }

    handleResize()

    const observer = new ResizeObserver((entries) => {
      for (const _ of entries) {
        handleResize()
      }
    })
    if (bodyRef.current) {
      observer.observe(bodyRef.current)
    }

    bodyRef.current?.addEventListener('scroll', handleResize)
    overlayRef.current?.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      observer.disconnect()
      bodyRef.current?.removeEventListener('scroll', handleResize)
      overlayRef.current?.removeEventListener('wheel', handleWheel)
    }
  }, [visibleColumns, fieldsAllowed, data, visibleColumns])
  return (
    <>
      <Flex
        sx={{
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          '.active': {
            '& > *': {
              display: 'block',
            },
          },
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
                loading={isLoading}
                hasData={!!data?.length}
                tableSettings={_tableSettings}
                currentSort={currentSort}
                changeCurrentSort={changeCurrentSort}
                hideCustomColumns={hideCustomColumns}
                visibleColumns={hasCustomize ? visibleColumns : _tableSettings.map((setting) => setting.id as string)}
                isSelectedAll={isSelectedAll}
                handleSelectedAll={handleSelectAll}
                hiddenSelectBox={hiddenSelectAllBox}
                lefts={lefts}
              />
            </TableContainer>
          </Box>
          <Box
            flex="1 1 0"
            sx={{ width: '100%', overflow: 'auto', position: 'relative' }}
            id="trader-table"
            ref={bodyRef}
          >
            <TableContainer>
              <TableBody
                data={data}
                isLoading={isLoading}
                tableSettings={_tableSettings}
                visibleColumns={hasCustomize ? visibleColumns : _tableSettings.map((setting) => setting.id as string)}
                checkIsSelected={checkIsSelected}
                handleSelect={handleSelect}
                hiddenSelectBox={hiddenSelectItemBox}
                availableColumns={isEliteUser ? undefined : fieldsAllowed}
                lefts={lefts}
              />
            </TableContainer>
            {!isEliteUser && !!data?.length && (
              <PermissionOverlay
                requiredPlan={userNextPlan}
                overlayRef={overlayRef}
                learnMoreSection={learnMoreSection}
              />
            )}
            {!isLoading && !data?.length && (noDataMessage ?? <NoDataFound />)}
          </Box>
        </TableWrapper>
      </Flex>
    </>
  )
}

function PermissionOverlay({
  requiredPlan,
  overlayRef,
  learnMoreSection = SubscriptionFeatureEnum.TRADER_EXPLORER,
}: {
  requiredPlan: SubscriptionPlanEnum
  overlayRef: RefObject<HTMLDivElement>
  learnMoreSection?: SubscriptionFeatureEnum
}) {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        backdropFilter: 'blur(10px)',
        borderLeftColor: 'neutral4',
        overflow: 'hidden',
      }}
      ref={overlayRef}
    >
      <Box display="none" minWidth={180} sx={{ flexShrink: 0 }}>
        <PlanUpgradePrompt
          requiredPlan={requiredPlan}
          title={<Trans>Upgrade to Unlock more Metrics</Trans>}
          description={<Trans>See Unrealised PnL, Traded Tokens and more.</Trans>}
          showTitleIcon
          showLearnMoreButton
          useLockIcon
          learnMoreSection={learnMoreSection}
        />
      </Box>
    </Flex>
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

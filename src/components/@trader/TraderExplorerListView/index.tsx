import { Trans } from '@lingui/macro'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

import { ShortUpgradePrompt } from 'components/@subscription/PlanUpgradePrompt'
import { mobileTableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { ExternalTraderListSource } from 'components/@trader/TraderExplorerTableView/types'
import NoDataFound from 'components/@ui/NoDataFound'
import NoFavoriteFound from 'components/@ui/NoDataFound/NoFavoriteFound'
import TraderLabels from 'components/@ui/TraderLabels'
import { TraderData } from 'entities/trader'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'
import { useTraderExplorerListColumns } from 'hooks/store/useTraderCustomizeColumns'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { BASE_LINE_HEIGHT } from 'utils/config/constants'
import { LABEL_TOOLTIP_TRANSLATION } from 'utils/config/translations'
import { LABEL_TRANSLATION } from 'utils/config/translations'

import { getColumnRequiredPlan, getPermissionTooltipId } from '../helpers'

export default function TraderExplorerListView({
  data,
  isLoading,
  isFavoritePage = false,
  noDataMessage,
}: {
  data: TraderData[] | undefined
  isLoading: boolean
  isFavoritePage?: boolean
  noDataMessage?: ReactNode
}) {
  const { columnKeys: visibleColumns } = useTraderExplorerListColumns()

  const { isEliteUser, fieldsAllowed, pagePermission } = useExplorerPermission()
  const { userNextPlan } = useUserNextPlan()
  const _tableSettings = mobileTableSettings.filter(
    ({ id }) => visibleColumns.includes(id) && fieldsAllowed.includes(id)
  )
  // const _tableSettings = reorderArray({
  //   source: fieldsAllowed,
  //   target: mobileTableSettings.filter((data) => visibleColumns.includes(data.id)),
  //   getValue: (data) => data.id,
  // }).map((v) => ({ ...v, sortBy: fieldsAllowed.includes(v.id as string) || isEliteUser ? v.sortBy : undefined }))

  const headerColumns = _tableSettings.filter((v) => v.id !== 'labels').slice(1, 4)
  const bodyColumns = _tableSettings.filter((v) => v.id !== 'labels').slice(4)

  const mobileScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mobileScrollRef.current?.scrollTo(0, 0)
  }, [data])

  const externalSource: ExternalTraderListSource = {
    isMarketsLeft: true,
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }} id="trader-table-mobile" ref={mobileScrollRef}>
      {isLoading && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      <Box sx={{ position: 'relative' }}>
        {!isLoading &&
          !data?.length &&
          (noDataMessage ?? (isFavoritePage ? <NoFavoriteFound sx={{ pt: 5 }} /> : <NoDataFound />))}

        {data?.map((_data) => {
          const labels = _data.labels
            ?.sort((a, b) => {
              if (a.includes('TIER')) return -1
              if (b.includes('TIER')) return 1
              return 0
            })
            .map((label) => {
              return {
                key: label,
                title: LABEL_TRANSLATION[label as keyof typeof LABEL_TRANSLATION],
                tooltip: LABEL_TOOLTIP_TRANSLATION[label as keyof typeof LABEL_TOOLTIP_TRANSLATION],
              }
            })
          return (
            <Accordion
              key={_data.account + _data.protocol}
              header={_tableSettings[0].render?.(_data)}
              subHeader={
                <Box>
                  {labels != null && !!_tableSettings.find((v) => v.id === 'labels') && (
                    <Flex sx={{ gap: 1, flexWrap: 'wrap', pb: 2 }}>
                      <TraderLabels labels={labels} showedItems={4} />
                    </Flex>
                  )}
                  <Box sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    {headerColumns.map((setting) => {
                      const isAvailable = fieldsAllowed.includes(setting.id)
                      const requiredPlan = getColumnRequiredPlan({
                        columnData: setting,
                        explorerPermission: pagePermission,
                      })
                      const tooltipId = getPermissionTooltipId({ requiredPlan })
                      return (
                        <Fragment key={setting.id}>
                          <StatsItem
                            label={setting.text}
                            value={setting.render?.(_data)}
                            isAvailable={isAvailable}
                            tooltipId={tooltipId}
                          />
                        </Fragment>
                      )
                    })}
                  </Box>
                </Box>
              }
              body={
                <Box>
                  <Box pt={2} sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    {bodyColumns.map((setting, index) => {
                      const isAvailable = fieldsAllowed.includes(setting.id)
                      const requiredPlan = getColumnRequiredPlan({
                        columnData: setting,
                        explorerPermission: pagePermission,
                      })
                      const tooltipId = getPermissionTooltipId({ requiredPlan })
                      return (
                        <Fragment key={setting.id}>
                          <StatsItem
                            label={setting.text}
                            value={setting.render?.(_data, index, externalSource)}
                            isAvailable={isAvailable}
                            tooltipId={tooltipId}
                          />
                        </Fragment>
                      )
                    })}
                  </Box>
                  {!isEliteUser && (
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <PermissionBG />
                      <Flex sx={{ height: 52, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <ShortUpgradePrompt
                          requiredPlan={userNextPlan}
                          description={<Trans>to unlock more metric</Trans>}
                        />
                      </Flex>
                    </Box>
                  )}
                </Box>
              }
            />
          )
        })}
      </Box>
    </Box>
  )
}

function PermissionBG() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        filter: 'blur(10px)',
        userSelect: 'none',
        px: 3,
        display: 'grid',
        gap: 12,
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
    >
      <StatsItem label={'Label'} value={<Type.Caption>{Math.random() * 1000}</Type.Caption>} isAvailable tooltipId="" />
      <StatsItem label={'Label'} value={<Type.Caption>{Math.random() * 1000}</Type.Caption>} isAvailable tooltipId="" />
      <StatsItem label={'Label'} value={<Type.Caption>{Math.random() * 1000}</Type.Caption>} isAvailable tooltipId="" />
    </Box>
  )
}

function StatsItem({
  label,
  value,
  isAvailable,
  tooltipId,
}: {
  label: ReactNode
  value: ReactNode
  isAvailable: boolean
  tooltipId: string
}) {
  return (
    <Box
      sx={isAvailable ? {} : { '& > *:nth-child(2)': { filter: 'blur(6px)', userSelect: 'none' } }}
      // className={isAvailable ? undefined : tooltipId}
    >
      <Type.Caption color="neutral3" mb={1} display="block" sx={{ lineHeight: '16px', '*': { lineHeight: '16px' } }}>
        {label}
      </Type.Caption>
      {value}
    </Box>
  )
}

function Accordion({ header, subHeader, body }: { header: ReactNode; subHeader: ReactNode; body: ReactNode }) {
  const [isExpand, setIsExpand] = useState(false)
  return (
    <Box px={3} py={12} sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
      <Box>
        <Flex mb={12} sx={{ gap: 3, alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>{header}</Box>
          <Button
            variant="ghostPrimary"
            onClick={() => setIsExpand((prev) => !prev)}
            sx={{ fontWeight: 'normal', p: 0, height: 24 }}
          >
            {isExpand ? (
              <>
                Collapse <IconBox icon={<CaretUp weight="bold" size={16} />} height={BASE_LINE_HEIGHT} />
              </>
            ) : (
              <>
                Expand <IconBox icon={<CaretDown weight="bold" size={16} height={BASE_LINE_HEIGHT} />} />
              </>
            )}
          </Button>
        </Flex>
        {subHeader}
      </Box>
      <Box
        sx={{
          height: 'max-content',
          maxHeight: isExpand ? '999px' : '0px',
          transition: isExpand ? 'max-height 1s ease-in-out' : 'max-height 0.5s cubic-bezier(0, 1, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {body}
      </Box>
    </Box>
  )
}

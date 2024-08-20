import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

import { mobileTableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { ExternalTraderListSource } from 'components/@trader/TraderExplorerTableView/types'
import NoFavoriteFound from 'components/@ui/NoDataFound/NoFavoriteFound'
import { TraderData } from 'entities/trader'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

import { useExplorerColumnsMobile } from './useExplorerColumnsMobile'

export default function TraderExplorerListview({
  data,
  isLoading,
}: {
  data: TraderData[] | undefined
  isLoading: boolean
}) {
  const { columnKeys } = useExplorerColumnsMobile()

  const _tableSettings = mobileTableSettings.filter((data) => columnKeys.includes(data.id))

  const mobileScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mobileScrollRef.current?.scrollTo(0, 0)
  }, [data])

  const externalSource: ExternalTraderListSource = {
    isMarketsLeft: true,
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }} ref={mobileScrollRef}>
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
        {!isLoading && !data?.length && <NoFavoriteFound sx={{ pt: 5 }} />}

        {data?.map((_data) => {
          return (
            <Accordion
              key={_data.account}
              header={_tableSettings[0].render?.(_data)}
              subHeader={
                <Box sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {_tableSettings.slice(1, 4).map((setting) => {
                    return (
                      <Fragment key={_data.id}>
                        <StatsItem label={setting.text} value={setting.render?.(_data)} />
                      </Fragment>
                    )
                  })}
                </Box>
              }
              body={
                <Box pt={2} sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {_tableSettings.slice(4).map((setting, index) => {
                    return (
                      <Fragment key={_data.id}>
                        <StatsItem label={setting.text} value={setting.render?.(_data, index, externalSource)} />
                      </Fragment>
                    )
                  })}
                </Box>
              }
            />
          )
        })}
      </Box>
    </Box>
  )
}

function StatsItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Box>
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
                Collapse <CaretUp weight="bold" size={16} style={{ verticalAlign: 'middle' }} />
              </>
            ) : (
              <>
                Expand <CaretDown weight="bold" size={16} style={{ verticalAlign: 'middle' }} />
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

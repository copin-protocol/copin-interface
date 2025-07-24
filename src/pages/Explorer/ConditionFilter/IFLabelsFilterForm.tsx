import { Trans } from '@lingui/macro'
import { Trash } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import isEqual from 'lodash/isEqual'
import { useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { GridProps } from 'styled-system'

import { getAllNoteLabelsApi } from 'apis/traderNoteApis'
import Divider from 'components/@ui/Divider'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import { InputSearch } from 'theme/Input'
import { Box, Flex, Grid, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'

import { formatIFLabelsRangesWithAnd } from '../helpers/formatRanges'
import useTradersContext from '../useTradersContext'
import ResultEstimated from './ResultEstimated'
import { FilterTabEnum } from './configs'

function SelectLabelWithSearch({
  allItems,
  selectedItems,
  handleToggleItem,
  handleClearAllItems,
}: {
  allItems: string[]
  selectedItems: string[]
  handleToggleItem: (key: string) => void
  handleClearAllItems: () => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  limit?: number
}) {
  const [keyword, setKeyword] = useState<string>('')
  const inputSearchRef = useRef<HTMLInputElement>(null)

  const viewItems = useMemo(() => {
    return allItems.filter((l) => l.toLowerCase().includes(keyword?.toLowerCase() ?? ''))
  }, [allItems, keyword])

  if (!allItems.length) return <></>

  return (
    <>
      <Box sx={{ position: 'sticky', top: 0, bg: ['black', 'black', 'black', 'neutral7'], zIndex: 2, px: 3, pt: 3 }}>
        <InputSearch
          ref={inputSearchRef}
          placeholder={'SEARCH TAG'}
          sx={{
            padding: 2,
            width: '100%',
            height: 'max-content',
            borderColor: 'neutral5',
            borderRadius: 'xs',
          }}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          onClear={() => {
            setKeyword('')
            if (inputSearchRef.current) {
              inputSearchRef.current.value = ''
            }
          }}
        />
        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            mt: 3,
          }}
        >
          <Type.Caption>Match any tags below</Type.Caption>
          <ButtonWithIcon
            sx={{ p: 0, gap: 1 }}
            variant="ghostInactive"
            icon={<Trash size={16} />}
            onClick={() => handleClearAllItems()}
          >
            <Trans>CLEAR ALL</Trans>
          </ButtonWithIcon>
        </Flex>
        <Divider mt={2} color="neutral5" />
      </Box>

      <Box my={2} px={3}>
        {viewItems.length === 0 && (
          <Type.Caption color="neutral3" mb={2}>
            <Trans>No labels found</Trans>
          </Type.Caption>
        )}
        <Box>
          <Grid alignItems="center" sx={{ gridTemplateColumns: '1fr 1fr', columnGap: 3, rowGap: 2 }}>
            {viewItems.map((item) => {
              const isChecked = selectedItems.includes(item)
              return (
                <Box py={2} key={item}>
                  <ControlledCheckbox
                    checked={isChecked}
                    label={item}
                    size={16}
                    onChange={() => handleToggleItem(item)}
                  />
                </Box>
              )
            })}
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default function IFLabelsFilterForm({
  labels,
  handleClose,
  handleChangeOption,
  currentTab,
  lastFilterTab,
}: {
  handleClose?: () => void
  handleChangeOption: (labels: string[]) => void
  labels: string[]
  currentTab: FilterTabEnum
  lastFilterTab: FilterTabEnum
}) {
  const { data } = useQuery(QUERY_KEYS.GET_ALL_NOTE_LABELS, () => getAllNoteLabelsApi())

  const [pickingLabels, setPickingLabels] = useState<string[]>(labels)
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { timeOption } = useTradersContext()
  const { sm } = useResponsive()

  const handleApply = () => {
    handleChangeOption(pickingLabels)
    toast.success('Save filter success')
    handleClose && handleClose()
  }

  const handleReset = () => {
    setPickingLabels([])
    handleChangeOption([])
    toast.success('Reset filter success')
    handleClose && handleClose()
  }

  // const isEnabledApply = useMemo(() => {
  //   return currentTab === FilterTabEnum.LABELS
  // }, [currentTab])

  const hasChanged = !isEqual(labels, pickingLabels)

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box sx={sm ? {} : { position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2 }}>
        <ResultEstimated
          ranges={formatIFLabelsRangesWithAnd(pickingLabels)}
          protocols={selectedProtocols ?? []}
          type={timeOption.id}
          filterTab={FilterTabEnum.IF_LABELS}
        />
      </Box>

      <Box flex="1 0 0" sx={{ overflow: 'auto', '.select__menu': { minWidth: 'max-content' } }}>
        <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
          <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
            {!!data && (
              <SelectLabelWithSearch
                allItems={data ?? []}
                selectedItems={pickingLabels}
                handleToggleItem={(label) => {
                  setPickingLabels((prev) => {
                    if (prev.includes(label)) {
                      return prev.filter((l) => l !== label)
                    }
                    return [...prev, label]
                  })
                }}
                handleClearAllItems={() => {
                  setPickingLabels([])
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              width: '100%',
              px: 3,
            }}
          >
            <Flex
              sx={{
                justifyContent: 'right',
                alignItems: 'center',
                height: 40,
                width: '100%',
                borderTop: 'small',
                borderTopColor: 'neutral4',
                gap: 12,
              }}
            >
              <Button px={0} variant="ghost" mr={3} onClick={handleReset} sx={{ fontWeight: 'normal' }}>
                Reset Default
              </Button>
              <Button
                px={0}
                variant="ghostPrimary"
                onClick={handleApply}
                disabled={
                  !(currentTab === FilterTabEnum.IF_LABELS && lastFilterTab !== FilterTabEnum.IF_LABELS) && !hasChanged
                }
                sx={{ fontWeight: 'normal' }}
              >
                Apply & Save
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

import { Trans } from '@lingui/macro'
import { Plus, Trash, X } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import isEqual from 'lodash/isEqual'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { InputSearch } from 'theme/Input'
import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { TRADER_LABELS } from 'utils/config/enums'
import { LABEL_CATEGORY_TRANSLATION, LABEL_TOOLTIP_TRANSLATION, LABEL_TRANSLATION } from 'utils/config/translations'

import { formatLabelsRanges } from '../helpers/formatRanges'
import useTradersContext from '../useTradersContext'
import ResultEstimated from './ResultEstimated'
import { FilterTabEnum } from './configs'

function LabelTag({ label, onRemove }: { label?: string; onRemove?: (item: string) => void }) {
  if (!label) return <></>
  return (
    <Flex
      alignItems="center"
      sx={{
        borderRadius: 'xs',
        px: 2,
        py: 1,
        backgroundColor: 'neutral5',
        lineHeight: 0,
        gap: 1,
      }}
    >
      <Type.Caption>{LABEL_TRANSLATION[label]}</Type.Caption>
      {onRemove && (
        <IconButton
          variant="ghost"
          size={16}
          icon={<X size={16} color={themeColors.neutral3} />}
          onClick={() => onRemove(label)}
        />
      )}
    </Flex>
  )
}

function SelectLabelWithSearch({
  allItems,
  selectedItems,
  viewItems,
  keyword,
  handleToggleItem,
  handleClearAllItems,
  handleChangeKeyword,
  menuSx = {},
  placement = 'bottomLeft',
  limit = 4,
}: {
  allItems: string[]
  viewItems: string[]
  selectedItems: string[]
  keyword?: string
  handleToggleItem: (key: string) => void
  handleClearAllItems: () => void
  handleChangeKeyword: (keyword?: string) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  limit?: number
}) {
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const selectedCategories = useMemo(() => {
    if (!selectedItems.length) return []
    return TRADER_LABELS.filter((category) => {
      return selectedItems.some((label) => category.labels.includes(label))
    })
  }, [selectedItems])

  const viewCategories = useMemo(() => {
    if (!viewItems.length) return []
    return TRADER_LABELS.filter((category) => {
      return category.labels.some((label) => viewItems.includes(label))
    })
  }, [viewItems])

  if (!allItems.length) return <></>

  return (
    <>
      {selectedCategories.map((category, index) => {
        return (
          <Box display={{ _: 'block', xl: 'flex' }} key={category.key} mb={2} mt={index === 0 ? 0 : 3}>
            <Type.Caption color="neutral2" width={150} mb={{ _: 2, xl: 0 }} sx={{ lineHeight: '26px' }}>
              {index === 0 ? '' : 'AND'} {LABEL_CATEGORY_TRANSLATION[category.key]}
            </Type.Caption>
            <Flex flex="1" alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
              {selectedItems
                .filter((label) => category.labels.includes(label))
                .map((item) => {
                  const label = allItems.find((e) => e === item)
                  return (
                    <Box key={item}>
                      <LabelTag label={label} onRemove={handleToggleItem} />
                    </Box>
                  )
                })}
            </Flex>
          </Box>
        )
      })}

      <Dropdown
        buttonVariant="ghostPrimary"
        buttonSx={{ px: 0, my: 1 }}
        menuSx={{
          width: 350,
          height: 324,
          overflow: 'auto',
          px: 2,
          pb: 2,
          ...menuSx,
        }}
        hasArrow={false}
        dismissible={false}
        menuDismissible
        menu={
          <>
            <Box sx={{ position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2, pt: 2 }}>
              <InputSearch
                ref={inputSearchRef}
                placeholder={'SEARCH LABEL'}
                sx={{
                  padding: 2,
                  width: '100%',
                  height: 'max-content',
                  borderColor: 'neutral5',
                  borderRadius: 'xs',
                }}
                value={keyword}
                onChange={(e) => {
                  handleChangeKeyword(e.target.value)
                }}
                onClear={() => handleChangeKeyword(undefined)}
              />
              <ButtonWithIcon
                sx={{ p: 0, my: 2, gap: 1 }}
                variant="ghostInactive"
                icon={<Trash size={16} />}
                onClick={() => handleClearAllItems()}
              >
                <Trans>CLEAR ALL</Trans>
              </ButtonWithIcon>
              <Divider mt={2} color="neutral5" />
            </Box>

            <Box mt={3} mb={2}>
              {viewCategories.length === 0 && (
                <Type.Caption color="neutral3" mb={2}>
                  <Trans>No labels found</Trans>
                </Type.Caption>
              )}
              {viewCategories.map((category, index) => {
                return (
                  <Box key={category.key}>
                    <Type.Caption color="neutral3" mb={2} mt={index === 0 ? 0 : 3}>
                      {LABEL_CATEGORY_TRANSLATION[category.key]} <Trans>LABELS</Trans>
                    </Type.Caption>
                    <Grid alignItems="center" sx={{ gridTemplateColumns: '1fr 1fr', columnGap: 3, rowGap: 2 }}>
                      {viewItems
                        .filter(
                          (e) => e.toLowerCase().includes(keyword?.toLowerCase() ?? '') && category.labels.includes(e)
                        )
                        .map((item) => {
                          const isChecked = selectedItems.includes(item)
                          return (
                            <Box py={2} key={item}>
                              <ControlledCheckbox
                                checked={isChecked}
                                label={
                                  <LabelWithTooltip id={item} tooltip={LABEL_TOOLTIP_TRANSLATION[item]}>
                                    {LABEL_TRANSLATION[item]}
                                  </LabelWithTooltip>
                                }
                                size={16}
                                onChange={() => handleToggleItem(item)}
                              />
                            </Box>
                          )
                        })}
                    </Grid>
                  </Box>
                )
              })}
            </Box>
          </>
        }
        placement={placement}
      >
        <Flex alignItems="center" sx={{ gap: 1, mt: selectedCategories?.length ? 2 : 0 }}>
          <IconBox icon={<Plus size={16} />} />
          <Trans>ADD LABEL</Trans>
        </Flex>
      </Dropdown>
    </>
  )
}

export default function LabelsFilterForm({
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
  const [viewItems, setViewItems] = useState<string[]>(Object.keys(LABEL_TRANSLATION))
  const [pickingLabels, setPickingLabels] = useState<string[]>(labels)
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const pnlWithFeeEnabled = useUserPreferencesStore((state) => state.pnlWithFeeEnabled)
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
          ranges={formatLabelsRanges(pickingLabels, pnlWithFeeEnabled)}
          protocols={selectedProtocols ?? []}
          type={timeOption.id}
          filterTab={FilterTabEnum.LABELS}
        />
      </Box>

      <Box flex="1 0 0" sx={{ overflow: 'auto', '.select__menu': { minWidth: 'max-content' } }}>
        <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
          <Box flex="1 0 0" sx={{ overflow: 'auto', p: 3 }}>
            <SelectLabelWithSearch
              allItems={Object.keys(LABEL_TRANSLATION)}
              viewItems={viewItems}
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
              handleChangeKeyword={(keyword) => {
                setViewItems(
                  Object.keys(LABEL_TRANSLATION).filter((l) =>
                    LABEL_TRANSLATION[l]?.toLowerCase().includes(keyword?.toLowerCase() ?? '')
                  )
                )
              }}
            />
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
                  !(currentTab === FilterTabEnum.LABELS && lastFilterTab !== FilterTabEnum.LABELS) && !hasChanged
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

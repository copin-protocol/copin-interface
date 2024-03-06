import { Trans } from '@lingui/macro'
import { X } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import React, { Fragment, useRef } from 'react'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import IconButton from 'theme/Buttons/IconButton'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { InputSearch } from 'theme/Input'
import { Box, Flex, Grid, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

export default function SelectMarketWithSearch({
  allItems,
  selectedItems,
  keyword,
  handleToggleItem,
  handleSelectAllItems,
  handleChangeKeyword,
  menuSx = {},
  placement = 'bottomLeft',
  limit = 4,
}: {
  allItems: { label: string; value: string }[]
  selectedItems: string[]
  keyword?: string
  handleToggleItem: (key: string) => void
  handleSelectAllItems: (isSelectedAll: boolean) => void
  handleChangeKeyword: (keyword?: string) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  limit?: number
}) {
  const inputSearchRef = useRef<HTMLInputElement>(null)
  if (!allItems.length) return <></>
  const isSelectedAll = !!allItems.length && allItems.every((item) => selectedItems.includes(item.value))

  return (
    <Dropdown
      menuSx={{
        width: 280,
        height: 324,
        overflow: 'auto',
        p: 2,
        ...menuSx,
      }}
      dismissible={false}
      menuDismissible
      menu={
        <>
          <InputSearch
            ref={inputSearchRef}
            placeholder={'Search'}
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
          <Divider my={2} />
          <Flex sx={{ gap: 1, alignItems: 'center' }}>
            <ControlledCheckbox
              checked={isSelectedAll}
              label={
                <Type.CaptionBold color="neutral3">
                  <Trans>Select all</Trans>
                </Type.CaptionBold>
              }
              size={16}
              onChange={(event) => {
                const value = event.target.checked
                if (value) {
                  handleSelectAllItems(false)
                } else {
                  handleSelectAllItems(true)
                }
              }}
            />
          </Flex>
          <Divider mt={2} />
          <Fragment>
            <Grid
              sx={{
                gridTemplateColumns: '1fr 1fr 1fr',
                columnGap: 3,
                rowGap: 2,
              }}
            >
              {allItems
                .filter((e) => e.label?.toLowerCase().includes(keyword?.toLowerCase() ?? ''))
                .map((item) => {
                  const key = item.value
                  if (key == null) return <></>
                  const isChecked = selectedItems.includes(key)
                  return (
                    <Box py={2} key={key.toString()}>
                      <ControlledCheckbox
                        checked={isChecked}
                        label={item.label}
                        size={16}
                        onChange={() => handleToggleItem(key)}
                      />
                    </Box>
                  )
                })}
            </Grid>
          </Fragment>
        </>
      }
      buttonSx={{
        border: 'none',
      }}
      placement={placement}
    >
      {isSelectedAll || !selectedItems?.length ? (
        <MarketTag label="ALL MARKETS" value="all" />
      ) : (
        <Flex alignItems="center" sx={{ gap: 2 }}>
          {selectedItems.slice(0, limit).map((item) => {
            const market = allItems.find((e) => e.value === item)
            return (
              <Box key={item}>
                <MarketTag label={market?.label} value={market?.value} onRemove={handleToggleItem} />
              </Box>
            )
          })}
          {selectedItems.length > limit ? (
            <Type.Caption sx={{ borderRadius: 'xs', px: 2, py: 1, backgroundColor: 'neutral5' }}>
              {`+${selectedItems.length - limit}`}
            </Type.Caption>
          ) : null}
        </Flex>
      )}
    </Dropdown>
  )
}

function MarketTag({ label, value, onRemove }: { label?: string; value?: string; onRemove?: (item: string) => void }) {
  if (!label || !value) return <></>
  return (
    <Flex
      alignItems="center"
      sx={{
        borderRadius: 'xs',
        px: 2,
        py: 1,
        backgroundColor: 'neutral5',
        lineHeight: 0,
        textTransform: 'uppercase',
        gap: 1,
      }}
    >
      <Type.Caption>{label}</Type.Caption>
      {onRemove && (
        <IconButton
          variant="ghost"
          size={16}
          icon={<X size={16} color={themeColors.neutral3} />}
          onClick={() => onRemove(value)}
        />
      )}
    </Flex>
  )
}

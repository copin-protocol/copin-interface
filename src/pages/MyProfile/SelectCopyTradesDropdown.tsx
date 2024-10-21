import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import React, { useMemo, useState } from 'react'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import InputSearchText from 'components/@ui/InputSearchText'
import { CopyTradeData } from 'entities/copyTrade'
import useDebounce from 'hooks/helpers/useDebounce'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'

export default function SelectCopyTradesDropdown({
  allCopyTrades,
  selectedCopyTrades,
  handleToggleCopyTrade,
  handleSelectAllCopyTrades,
  menuSx = {},
  placement = 'bottomRight',
}: {
  allCopyTrades: CopyTradeData[]
  selectedCopyTrades: CopyTradeData[]
  handleToggleCopyTrade: (key: CopyTradeData) => void
  handleSelectAllCopyTrades: (isSelectedAll: boolean) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}) {
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)

  const options = useMemo(() => {
    return allCopyTrades?.filter((option) => {
      return option?.title?.toLowerCase().includes(debounceSearchText.toLowerCase())
    })
  }, [allCopyTrades, debounceSearchText])

  const isSelectedAll =
    !!allCopyTrades.length &&
    allCopyTrades.every((copyTrade) => selectedCopyTrades?.map((e) => e.id).includes(copyTrade.id))

  return (
    <Dropdown
      menuSx={{
        width: ['100%', 400],
        height: 350,
        overflow: 'auto',
        p: 2,
        ...menuSx,
      }}
      dismissible={false}
      menuDismissible
      menu={
        <>
          <Flex sx={{ gap: 1, alignItems: 'center' }}>
            <SwitchInput
              checked={isSelectedAll}
              onChange={(event) => {
                const value = event.target.checked
                if (value) {
                  handleSelectAllCopyTrades(false)
                } else {
                  handleSelectAllCopyTrades(true)
                }
              }}
            />
            <Type.CaptionBold color="neutral3">
              <Trans>Select all</Trans> (
              <Type.Caption>
                <Trans>Includes deleted data</Trans>
              </Type.Caption>
              )
            </Type.CaptionBold>
          </Flex>
          <Divider my={2} />
          <InputSearchText placeholder="Search copytrades..." searchText={searchText} setSearchText={setSearchText} />
          <Divider mt={2} />
          <Grid
            sx={{
              gridTemplateColumns: ['1fr', '1fr 1fr'],
              columnGap: 3,
              rowGap: 2,
            }}
          >
            {options.map((item) => {
              const key = item.id
              if (key == null) return <></>
              const isChecked = selectedCopyTrades.findIndex((e) => e.id === item.id) !== -1
              return (
                <Box py={2} key={key.toString()}>
                  <ControlledCheckbox
                    checked={isChecked}
                    label={item.title}
                    size={16}
                    onChange={() => handleToggleCopyTrade(item)}
                  />
                </Box>
              )
            })}
          </Grid>
        </>
      }
      buttonSx={{
        border: 'none',
        height: 50,
      }}
      placement={placement}
    >
      {selectedCopyTrades.length}/{allCopyTrades.length} active {allCopyTrades.length > 1 ? 'copytrades' : 'copytrade'}
    </Dropdown>
  )
}

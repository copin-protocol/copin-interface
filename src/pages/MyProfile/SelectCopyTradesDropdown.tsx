import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import React, { useMemo, useState } from 'react'
import { GridProps } from 'styled-system'

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
      buttonVariant="ghost"
      // buttonSx={{
      //   textTransform: 'none',
      // }}
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
          <InputSearchText placeholder="SEARCH COPYTRADE" searchText={searchText} setSearchText={setSearchText} />
          <Flex sx={{ gap: 2, alignItems: 'center', my: 2 }}>
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
            <Type.CaptionBold color="neutral2">
              <Trans>SELECT ALL</Trans>
              <Type.Caption color="neutral3" ml={1}>
                (<Trans>Includes deleted data</Trans>)
              </Type.Caption>
            </Type.CaptionBold>
          </Flex>
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
      placement={placement}
    >
      {selectedCopyTrades.length}/{allCopyTrades.length} Active {allCopyTrades.length > 1 ? 'Copytrades' : 'Copytrade'}
    </Dropdown>
  )
}

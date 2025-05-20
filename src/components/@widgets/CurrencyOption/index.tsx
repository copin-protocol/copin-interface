// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { Props } from 'react-select'

import useIsMobile from 'hooks/helpers/useIsMobile'
import Select from 'theme/Select'
import { Box } from 'theme/base'
import { TokenOptionProps } from 'utils/config/trades'

export default function CurrencyOption({
  options,
  currentOption,
  handleChangeOption,
  selectProps,
}: {
  options: TokenOptionProps[]
  currentOption: TokenOptionProps
  handleChangeOption: (option: TokenOptionProps) => void
  selectProps?: Omit<Props, 'theme'>
}) {
  const isMobile = useIsMobile()
  return (
    <Box className="currency_option" sx={{ width: 88, position: 'relative', zIndex: 8 }}>
      <Select
        isSearchable={isMobile ? false : true}
        menuPlacement="auto"
        maxMenuHeight={236}
        menuPosition="fixed"
        {...(selectProps ?? {})}
        variant="outlinedSecondary"
        options={options}
        value={currentOption}
        noOptionsMessage={() => t`No Data`}
        onChange={(newValue) => handleChangeOption(newValue as TokenOptionProps)}
      />
    </Box>
  )
}

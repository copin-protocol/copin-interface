import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Input from 'theme/Input'
import { Box, IconBox, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'
import { formatPrice } from 'utils/helpers/format'

export default function TokenDropdown({
  token,
  tokens,
  groupId,
}: {
  token: string
  tokens: string[]
  groupId?: string
}) {
  const { prices, hlPrices } = useGetUsdPrices()
  const currentPrice = prices?.[token] ?? hlPrices?.[token]
  const [searchValue, setSearchValue] = useState('')

  const filteredTokens = useMemo(() => {
    if (!searchValue.trim()) return tokens
    return tokens.filter((t) => t.toLowerCase().includes(searchValue.toLowerCase()))
  }, [tokens, searchValue])

  return (
    <Dropdown
      buttonVariant="ghost"
      placement="bottom"
      menuSx={{ width: '300px' }}
      menu={
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {/* Search input */}
          <Box
            p={2}
            sx={{ position: 'sticky', top: 0, bg: 'neutral7', zIndex: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              affix={<IconBox icon={<MagnifyingGlass size={16} />} color="neutral3" />}
              suffix={
                searchValue !== '' ? (
                  <IconButton
                    variant="ghostInactive"
                    icon={<X size={16} />}
                    size={24}
                    onClick={() => setSearchValue('')}
                  />
                ) : undefined
              }
              placeholder="Enter token name"
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              block
            />
          </Box>

          {/* Token list */}
          <Box>
            {filteredTokens.length > 0 ? (
              filteredTokens.map((tokenItem) => (
                <Link
                  to={`${ROUTES.TOKEN_TERMINAL.path.replace(':token', tokenItem)}${
                    groupId ? `?groupId=${groupId}` : ''
                  }`}
                  key={tokenItem}
                  onClick={() => setSearchValue('')}
                >
                  <DropdownItem>{tokenItem}</DropdownItem>
                </Link>
              ))
            ) : (
              <Box p={2} textAlign="center">
                <Type.Body color="neutral3" fontSize="14px">
                  No tokens found
                </Type.Body>
              </Box>
            )}
          </Box>
        </Box>
      }
    >
      <Type.Head>
        {token}
        <Box as="span" ml={2} sx={{ fontWeight: 'normal' }} color="neutral2">
          {formatPrice(currentPrice)}
        </Box>
      </Type.Head>
    </Dropdown>
  )
}

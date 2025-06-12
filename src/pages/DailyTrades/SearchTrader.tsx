import { Warning } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import useDebounce from 'hooks/helpers/useDebounce'
import { InputSearch } from 'theme/Input'
import { Box, IconBox, Type } from 'theme/base'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { isAddress } from 'utils/web3/contracts'

export default function SearchTrader({
  address,
  setAddress,
  requiredPlan,
}: {
  address: string | undefined
  setAddress: (address: string) => void
  requiredPlan?: SubscriptionPlanEnum
}) {
  const [searchText, setSearchText] = useState('')
  const [error, setError] = useState(false)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!!requiredPlan) return
    setSearchText(e.target.value.trim())
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  const debounceSearchText = useDebounce<string>(searchText ?? '', 300)

  useEffect(() => {
    if (!debounceSearchText) {
      if (!!address) {
        setAddress('')
      }
      setError(false)
      return
    }
    let _address = ''
    try {
      _address = isAddress(debounceSearchText)
    } catch {}
    if (_address) {
      setAddress(_address)
      setError(false)
    } else {
      setError(true)
    }
  }, [debounceSearchText])
  return (
    <>
      <Box
        sx={{ position: 'relative', width: 'max-content', maxWidth: '220px' }}
        // data-tooltip-id="search_required_plan"
      >
        <InputSearch
          placeholder="SEARCH ADDRESS"
          sx={{
            width: requiredPlan ? 170 : 'auto',
            height: 'max-content',
            border: 'none',
            borderRadius: 'xs',
            backgroundColor: 'transparent !important',
          }}
          disabled={!!requiredPlan}
          value={searchText}
          onChange={handleSearchChange}
          onClear={requiredPlan ? undefined : handleClearSearch}
          suffix={
            requiredPlan ? (
              <IconBox
                sx={{
                  flexShrink: 0,
                  transform: ['translateX(-8px)', 'translateX(-8px)', 'translateX(-8px)', 'none'],
                }}
                icon={
                  <PlanUpgradeIndicator
                    requiredPlan={requiredPlan}
                    learnMoreSection={SubscriptionFeatureEnum.LIVE_TRADES}
                  />
                }
              />
            ) : undefined
          }
        />
        {error && (
          <Type.Caption
            color="red1"
            sx={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              right: 0,
              transform: 'translateY(100%)',
              p: 2,
              bg: 'neutral5',
              display: 'flex',
              alignItems: ['start', 'center'],
              gap: 1,
              zIndex: 1,
            }}
          >
            <Warning size={16} style={{ flexShrink: 0, height: '22px' }} />
            <Box as="span">Please enter a correct user address</Box>
          </Type.Caption>
        )}
      </Box>
      {/* {!!requiredPlan && (
        <Tooltip id={'search_required_plan'} clickable>
          <PlanUpgradePrompt
            title={<Trans>Upgrade To Unlock Search</Trans>}
            description={<Trans>Available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]} plan</Trans>}
            requiredPlan={SubscriptionPlanEnum.ELITE}
            showTitleIcon
          />
        </Tooltip>
      )} */}
    </>
  )
}

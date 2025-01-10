import { Trans } from '@lingui/macro'
import { CrownSimple, Gear } from '@phosphor-icons/react'
import { useState } from 'react'

import Divider from 'components/@ui/Divider'
import { TraderData } from 'entities/trader'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import { RANKING_FIELDS_COUNT, useRankingCustomizeStore } from 'hooks/store/useRankingCustomize'
import { Button } from 'theme/Buttons'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'

export default function CustomizeRankingColumn() {
  const [menuVisible, setMenuVisible] = useState(false)
  const { customizedRanking, setVisibleRanking } = useRankingCustomizeStore()
  const [rankingFields, setRankingFields] = useState(customizedRanking)
  const { checkIsPremium } = useIsPremiumAndAction()
  const toggleVisibleRanking = (key: keyof TraderData) => {
    setRankingFields((prev) => {
      if (prev.includes(key)) {
        return prev.filter((name) => name !== key)
      }
      if (prev.length < RANKING_FIELDS_COUNT) {
        return [...prev, key]
      }
      return prev
    })
  }
  const handleApply = () => {
    setMenuVisible(false)
    if (!checkIsPremium()) return
    setVisibleRanking(rankingFields)
  }
  return (
    <>
      <Dropdown
        inline
        menuSx={{
          width: 190,
          p: 3,
          pr: 0,
          position: 'relative',
        }}
        visible={menuVisible}
        setVisible={setMenuVisible}
        hasArrow={false}
        dismissible={false}
        menuDismissible
        menu={
          <>
            <Flex sx={{ flexDirection: 'column', gap: 2, maxHeight: 250, overflowY: 'auto', pr: 3 }}>
              {rankingFieldOptions.map((item) => {
                const disabled = rankingFields.length === RANKING_FIELDS_COUNT && !rankingFields.includes(item.value)
                const checked = rankingFields.includes(item.value)
                return (
                  <Box
                    key={item.value}
                    data-tooltip-id="tt_ranking_field"
                    data-tooltip-offset={0}
                    data-tooltip-delay-show={360}
                    data-tooltip-content={item.tooltipContent}
                  >
                    <ControlledCheckbox
                      disabled={disabled}
                      checked={checked}
                      label={item.label}
                      size={16}
                      onChange={() => toggleVisibleRanking(item.value)}
                    />
                  </Box>
                )
              })}
              <Tooltip
                id="tt_ranking_field"
                place="top"
                type="dark"
                clickable={false}
                style={{ fontSize: '12px', maxWidth: '300px' }}
              ></Tooltip>
            </Flex>
            <Divider my={2} />
            <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, pr: 3 }}>
              <Type.Caption color="neutral2">
                <Trans>Selected:</Trans> {rankingFields.length}/{RANKING_FIELDS_COUNT}
              </Type.Caption>
              <Button
                variant="ghostPrimary"
                size="sm"
                sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 2 }}
                onClick={handleApply}
                disabled={rankingFields.length < RANKING_FIELDS_COUNT}
              >
                <Box as="span">
                  <Trans>Apply</Trans>
                </Box>
                <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
              </Button>
            </Flex>
          </>
        }
        buttonSx={{
          '& > *': {
            height: 22,
            width: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        placement="bottomRight"
      >
        <Gear size={18} />
      </Dropdown>
    </>
  )
}

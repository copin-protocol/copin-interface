import { Trans } from '@lingui/macro'
import { Info, Sliders } from '@phosphor-icons/react'
import React, { ReactNode, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

import SectionTitle from 'components/@ui/SectionTitle'
import Checkbox from 'theme/Checkbox'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'

export default function SettingTrigger() {
  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4', gap: 2 }}>
        <SectionTitle
          icon={Sliders}
          title={
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <Trans>ALERT TRIGGER</Trans>
              <IconBox
                icon={<Info size={20} />}
                size={20}
                color="neutral3"
                data-tip="React-tooltip"
                data-tooltip-id={'tt-alert-trigger'}
                data-tooltip-delay-show={360}
              />
              <Tooltip id={'tt-alert-trigger'}>
                <Type.Caption color="orange2" sx={{ maxWidth: 300 }}>
                  *These actions are selected by default from the system. You cannot change them in the current version.
                </Type.Caption>
              </Tooltip>
            </Flex>
          }
          sx={{ mb: 0 }}
        />
      </Flex>
      <Box p={3}>
        <CheckboxItem isChecked disabled label={'Position'} tooltipContent={`Can't modify yet`} />
        <Flex pt={2} pb={3} pl={3} flexDirection="column" sx={{ gap: 2 }}>
          <CheckboxItem isChecked disabled label={'Open new position'} tooltipContent={`Can't modify yet`} />
          <CheckboxItem isChecked disabled label={'Increase a position'} tooltipContent={`Can't modify yet`} />
          <CheckboxItem isChecked disabled label={'Decrease a position'} tooltipContent={`Can't modify yet`} />
          <CheckboxItem isChecked disabled label={'Close a position'} tooltipContent={`Can't modify yet`} />
          <CheckboxItem isChecked={false} disabled label={'Modify margin a position'} tooltipContent={'Coming Soon'} />
        </Flex>
        <CheckboxItem isChecked={false} disabled label={'Balance'} tooltipContent={'Coming Soon'} />
        <Flex pt={2} pl={3} flexDirection="column" sx={{ gap: 2 }}>
          <CheckboxItem isChecked={false} disabled label={'Receive assets'} tooltipContent={'Coming Soon'} />
          <CheckboxItem isChecked={false} disabled label={'Send assets'} tooltipContent={'Coming Soon'} />
        </Flex>
      </Box>
    </Flex>
  )
}

function CheckboxItem({
  label,
  isChecked = true,
  disabled,
  tooltipContent,
}: {
  label: string
  isChecked: boolean
  disabled?: boolean
  tooltipContent?: ReactNode
}) {
  const tooltipId = useMemo(() => uuid(), [])
  return (
    <>
      <Checkbox
        checked={isChecked}
        disabled={disabled}
        wrapperSx={{ height: 'auto' }}
        data-tip="React-tooltip"
        data-tooltip-id={tooltipId}
        data-tooltip-delay-show={360}
      >
        <Type.Caption color="neutral1">{label}</Type.Caption>
      </Checkbox>
      {tooltipContent && (
        <Tooltip id={tooltipId}>
          <Type.Caption color="neutral2">{tooltipContent}</Type.Caption>
        </Tooltip>
      )}
    </>
  )
}

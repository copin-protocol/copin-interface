import { SystemStyleObject } from '@styled-system/css'
import React from 'react'
import { GridProps } from 'styled-system'

import { useEnsName } from 'hooks/useEnsName'
import Tooltip from 'theme/Tooltip'
import { Flex, TextProps, Type } from 'theme/base'
import { addressShorten, shortenEnsName } from 'utils/helpers/format'

const AddressText = ({
  address,
  shouldShowFullText = false,
  shouldShowTooltip = true,
  ...props
}: {
  address: string
  textSx?: SystemStyleObject & GridProps
  shouldShowFullText?: boolean
  shouldShowTooltip?: boolean
} & TextProps) => {
  const { ensName } = useEnsName(address)
  const ensTooltipId = `ens-tooltip-${address}`
  return (
    <>
      <Type.Caption
        color="neutral1"
        data-tip="React-tooltip"
        data-tooltip-id={ensTooltipId}
        data-tooltip-offset={0}
        {...props}
      >
        {ensName
          ? shouldShowFullText
            ? ensName
            : shortenEnsName(ensName)
          : shouldShowFullText
          ? address
          : addressShorten(address, 3, 5)}
      </Type.Caption>
      {ensName && shouldShowTooltip && (
        <Tooltip id={ensTooltipId} clickable={false}>
          <Flex flexDirection="column" sx={{ gap: 1 }}>
            <Type.Caption>{ensName}</Type.Caption>
            <Type.Caption>{shouldShowFullText ? address : addressShorten(address, 3, 5)}</Type.Caption>
          </Flex>
        </Tooltip>
      )}
    </>
  )
}

export default AddressText

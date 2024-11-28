import React from 'react'
import { useForm } from 'react-hook-form'

import { isMobile } from 'hooks/helpers/useIsMobile'
import useSearchParams from 'hooks/router/useSearchParams'
import { useWhatIfStore } from 'hooks/store/useWhatIf'
import Dropdown from 'theme/Dropdown'
import SliderInput from 'theme/SliderInput'
import { Box, Flex, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

export default function WhatIf({
  txHash,
  account,
  logId,
  isLong,
  protocol,
  id,
  ...props
}: {
  protocol: ProtocolEnum
  txHash: string
  account: string
  logId: number
  isLong: boolean
  id?: string
} & BoxProps) {
  const { searchParams, setSearchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined
  const { nextHours, setNextHours } = useWhatIfStore()
  const { control, watch, setValue } = useForm<{ amount?: number }>({
    defaultValues: { amount: nextHoursParam ?? nextHours },
  })
  const amount = watch('amount')

  return (
    <Box {...props}>
      <Dropdown
        menuSx={{
          width: [300, 400],
          p: 2,
          bg: 'neutral5',
        }}
        hasArrow={true}
        dismissible={false}
        menu={
          <Box px={2} py={2} mb={24}>
            <Flex mb={2} alignItems="center" justifyContent="space-between">
              <Type.Caption>
                Next times:{' '}
                <Box as="span" color="primary1">
                  {amount ? amount : '--'} hours
                </Box>
              </Type.Caption>
            </Flex>
            <form>
              <SliderInput
                name="amount"
                control={control}
                error=""
                minValue={0}
                maxValue={48}
                stepValue={1}
                marksStep={isMobile ? 8 : 4}
                marksUnit={'h'}
              />
            </form>
          </Box>
        }
        sx={{ height: '100%', justifyContent: 'center' }}
        buttonSx={{
          border: 'none',
          height: '100%',
          p: 0,
          ':hover': {
            filter: 'brightness(140%)',
          },
        }}
        iconColor="primary1"
        iconSize={12}
        placement="bottomRight"
        onReset={() => {
          setValue('amount', 0)
          setNextHours(undefined)
          setSearchParams({ [URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]: null })
          window.history.replaceState(
            null,
            '',
            generatePositionDetailsRoute({ protocol, txHash, account, logId, isLong, id })
          )
        }}
        onSubmit={() => {
          setNextHours(amount)
          window.history.replaceState(
            null,
            '',
            generatePositionDetailsRoute({ id, protocol, txHash, account, logId, isLong, nextHours: amount })
          )
          // setSearchParams({ [URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]: amount ? amount.toString() : null })
        }}
      >
        <Type.Caption color="neutral1">
          What If
          {!amount ? '?' : ': '}{' '}
          {!!amount && <Type.Caption color="primary1">{formatNumber(amount, 0)} hours</Type.Caption>}
        </Type.Caption>
      </Dropdown>
    </Box>
  )
}

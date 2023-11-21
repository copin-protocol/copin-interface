import { Trans } from '@lingui/macro'
import React from 'react'

import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import NoDataFound from 'components/@ui/NoDataFound'
import { TraderAlertData } from 'entities/alert'
import IconButton from 'theme/Buttons/IconButton'
import AlertOffIcon from 'theme/Icons/AlerOffIcon'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { formatLocalRelativeDate } from 'utils/helpers/format'

const AlertListDesktop = ({
  data,
  isLoading,
  submitting,
  onSelect,
}: {
  data?: TraderAlertData[]
  isLoading?: boolean
  submitting?: boolean
  onSelect: (data?: TraderAlertData) => void
}) => {
  return (
    <Box
      width="100%"
      minHeight={578}
      sx={{
        position: 'relative',
        overflow: 'auto',
      }}
      p={3}
      pb={40}
    >
      <Box textAlign={'center'}>
        {isLoading && <Loading />}
        {!isLoading && !data?.length && (
          <NoDataFound message={<Trans>You do not have any trader&apos;s alert</Trans>} />
        )}
      </Box>

      <Box>
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <Flex key={index} justifyContent={'space-between'} alignItems={'center'} mb={2} sx={{ gap: [3, 40] }}>
              <AccountWithProtocol protocol={item.protocol} address={item.address} />
              <Flex flex={1}>
                <Type.Caption color="neutral3">
                  <Trans>Added</Trans> {formatLocalRelativeDate(item.createdAt ?? '')}
                </Type.Caption>
              </Flex>
              <IconButton
                variant="ghost"
                icon={<AlertOffIcon color="red2" />}
                sx={{ p: 0 }}
                size={32}
                isLoading={submitting}
                disabled={isLoading || submitting}
                onClick={() => onSelect(item)}
              />
            </Flex>
          ))}
      </Box>
    </Box>
  )
}

export default AlertListDesktop

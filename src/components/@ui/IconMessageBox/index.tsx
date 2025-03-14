import { Trans } from '@lingui/macro'
import { Icon } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import DashedArrow from 'theme/Icons/DashedArrow'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { Colors } from 'theme/types'

type IconMessageBoxProps = {
  title?: ReactNode
  message: ReactNode
  width?: number | string
  height?: number | string
  messageSize?: number | string
  messageColor?: keyof Colors
  icons: { icon: ReactNode | Icon; description: ReactNode }[]
}

export function IconMessageBox({
  title,
  message,
  icons,
  width = '100%',
  height = 180,
  messageColor = 'neutral3',
  messageSize = '14px',
}: IconMessageBoxProps) {
  return (
    <Flex p={3} flexDirection="column" width={width} height={height} justifyContent="center" alignItems="center">
      {title && (
        <Type.CaptionBold display="block">
          <Trans>{title}</Trans>
        </Type.CaptionBold>
      )}
      <Box fontSize={messageSize} color={messageColor} display="block" mb={3} textAlign="center">
        <Trans>{message}</Trans>
      </Box>
      <Flex sx={{ width: '100%', maxWidth: 450, alignItems: 'stretch', justifyContent: 'space-between' }}>
        {icons.map((item, index) => (
          <>
            <IconWrapper key={index} icon={item.icon} description={item.description} />
            {index < icons.length - 1 && (
              <Box pt={3}>
                <DashedArrow />
              </Box>
            )}
          </>
        ))}
      </Flex>
    </Flex>
  )
}

function IconWrapper({ icon, description }: { icon: ReactNode | Icon; description: ReactNode }) {
  return (
    <Flex sx={{ flexShrink: 0, width: 85, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <IconBox
        icon={typeof icon === 'function' ? icon({ size: 24 }) : icon}
        sx={{
          color: 'neutral3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          bg: 'neutral5',
          borderRadius: '6px',
        }}
      />
      <Type.Small color="neutral3" textAlign="center">
        {description}
      </Type.Small>
    </Flex>
  )
}

import { CheckCircle } from '@phosphor-icons/react'
import styled from 'styled-components/macro'

import { Flex, IconBox, Type } from 'theme/base'

const InfoItem = styled(Flex)`
  align-items: flex-start;
  margin-bottom: 8px;
  text-align: left;
  gap: 6px;
`

const BulletItem = ({
  bullet = <CheckCircle size={16} />,
  children,
  color = 'primary1',
}: {
  bullet?: React.ReactNode
  children: React.ReactNode
  color?: string
}) => {
  return (
    <InfoItem>
      <IconBox color={color} icon={bullet} />
      <Type.Caption flex="1">{children}</Type.Caption>
    </InfoItem>
  )
}

export default BulletItem

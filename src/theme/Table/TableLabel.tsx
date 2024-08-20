import styled from 'styled-components/macro'

import { Type } from 'theme/base'

const TableLabel = styled(Type.BodyBold)`
  border-left: 4px solid;
  border-color: ${({ theme }) => theme.colors.primary1};
  padding-left: 8px;
`

export default TableLabel

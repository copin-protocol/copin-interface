import { ReactNode } from 'react'
import styled, { DefaultTheme } from 'styled-components/macro'

import { Type } from 'theme/base'

const CheckListDot = styled.span<{ isDone?: boolean }>`
  display: inline-block;
  width: 7px;
  height: 8px;
  border-radius: 8px;
  margin-right: 8px;
  flex: 0 0 8px;
  background: ${({ theme, isDone }: { theme: DefaultTheme; isDone?: boolean }) =>
    isDone ? theme.colors.green2 : 'transparent'};
  border: 1px solid
    ${({ theme, isDone }: { theme: DefaultTheme; isDone?: boolean }) =>
      isDone ? theme.colors.green2 : theme.colors.neutral5};
`
const CheckListItem = styled.div`
  &:not(:first-child) {
    margin-top: 8px;
  }
  display: flex;
  align-items: center;
  color: ${({ theme, isDone }: { theme: DefaultTheme; isDone?: boolean }) =>
    isDone ? theme.colors.green2 : theme.colors.neutral1};
`

const CheckList = ({ items, doneKeys }: { items: { key: string; value: ReactNode }[]; doneKeys: string[] }) => (
  <>
    {items.map((item) => (
      <CheckListItem key={item.key} isDone={doneKeys.includes(item.key)}>
        <CheckListDot isDone={doneKeys.includes(item.key)} />
        <Type.Caption>{item.value}</Type.Caption>
      </CheckListItem>
    ))}
  </>
)

export default CheckList

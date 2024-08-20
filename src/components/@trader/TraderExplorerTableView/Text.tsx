import { Type } from 'theme/base'

export default function Text({ text, ...props }: { text: string | number | undefined } & Record<string, any>) {
  return <Type.Caption {...props}>{!!text ? text : '--'}</Type.Caption>
}

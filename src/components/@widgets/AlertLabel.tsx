import { Type } from 'theme/base'

interface AlertLabelProps {
  alertLabel: string
  sx?: any
}

export const AlertLabel = ({ alertLabel, sx }: AlertLabelProps) => {
  return (
    <>
      {alertLabel && (
        <Type.Caption
          px={2}
          py={1}
          bg="neutral5"
          sx={{
            color: 'neutral1',
            borderRadius: 20,
            width: 'fit-content',
            display: 'inline-block',
            ...sx,
          }}
        >
          {alertLabel}
        </Type.Caption>
      )}
    </>
  )
}

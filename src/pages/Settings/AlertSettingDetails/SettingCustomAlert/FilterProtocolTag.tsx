import ProtocolGroup from 'components/@ui/ProtocolGroup'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

export default function FilterProtocolTag({
  protocols,
  onClear,
  tagSx,
}: {
  protocols: ProtocolEnum[] | undefined
  onClear?: () => void
  tagSx?: any
}) {
  return (
    <TagWrapper onClear={protocols?.length && !!onClear ? onClear : undefined} sx={tagSx}>
      <Type.Caption>Protocol:</Type.Caption>
      {protocols?.length ? (
        <ProtocolGroup protocols={protocols} hasTooltip />
      ) : (
        <Box>
          <Type.Caption color="primary1">All protocols</Type.Caption>
        </Box>
      )}
    </TagWrapper>
  )
}

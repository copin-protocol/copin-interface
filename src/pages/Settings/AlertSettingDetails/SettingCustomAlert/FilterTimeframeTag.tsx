import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Box, Type } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'

export default function FilterTimeframeTag({ type, tagSx }: { type: TimeFilterByEnum; tagSx?: any }) {
  return (
    <TagWrapper sx={tagSx}>
      <Type.Caption>Last:</Type.Caption>
      <Type.Caption>
        <Box as="span" color="primary1">
          {TIME_FILTER_OPTIONS.find((e) => e.id === type)?.text}
        </Box>
      </Type.Caption>
    </TagWrapper>
  )
}

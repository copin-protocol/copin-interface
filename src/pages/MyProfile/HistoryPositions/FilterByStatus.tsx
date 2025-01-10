import Checkbox from 'theme/Checkbox'
import { Flex, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'

export default function FilterByStatus({
  selected,
  handleChangeStatus,
  vertical = false,
}: {
  selected: PositionStatusEnum[]
  handleChangeStatus: (status: PositionStatusEnum) => void
  vertical?: boolean
}) {
  return (
    <Flex alignItems="center" sx={{ flexShrink: 0, gap: 2, flexDirection: vertical ? ['column', 'row'] : 'row' }}>
      <Type.Caption color="neutral2" sx={{ flexShrink: 0, display: vertical ? ['none', 'block'] : 'block' }}>
        STATUS:
      </Type.Caption>
      {FILTER_OPTIONS.map((status) => {
        const isChecked = selected?.includes(status)
        return (
          <Checkbox key={status} checked={isChecked} onChange={() => handleChangeStatus(status)}>
            <Type.Caption lineHeight="16px" sx={{ textTransform: 'capitalize' }}>
              {PositionStatusEnum[status]}
            </Type.Caption>
          </Checkbox>
        )
      })}
    </Flex>
  )
}
const FILTER_OPTIONS = [PositionStatusEnum.OPEN, PositionStatusEnum.CLOSE]

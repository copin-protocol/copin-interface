import { Trans } from '@lingui/macro'
import { Flag } from '@phosphor-icons/react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import { useToggleReportPerpDEXModal } from 'hooks/store/useToggleReportPerpDEXModal'
import { Flex, IconBox, Type } from 'theme/base'

const ReportPerpDEX = ({ data }: { data: PerpDEXSourceResponse }) => {
  const { isOpen, setIsOpen, setPerpDEX } = useToggleReportPerpDEXModal()

  return (
    <Flex pt={2}>
      <Trans>
        <Type.Small color="neutral2">
          Data wrong?
          <Type.Small
            color="primary1"
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
              pl: 1,
              ':hover': { color: 'primary2' },
            }}
            onClick={() => {
              setPerpDEX(data)
              setIsOpen(!isOpen)
            }}
          >
            Report
          </Type.Small>
        </Type.Small>
      </Trans>
    </Flex>
  )
}

export default ReportPerpDEX

export function ReportPerpDEXFlag({ data, size = 16 }: { data: PerpDEXSourceResponse; size?: number }) {
  const { isOpen, setIsOpen, setPerpDEX } = useToggleReportPerpDEXModal()
  return (
    <IconBox
      role="button"
      icon={<Flag size={size} />}
      onClick={() => {
        setPerpDEX(data)
        setIsOpen(!isOpen)
      }}
      sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
    />
  )
}

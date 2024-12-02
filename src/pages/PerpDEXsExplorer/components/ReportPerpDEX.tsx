import { Trans } from '@lingui/macro'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import { useToggleReportPerpDEXModal } from 'hooks/store/useToggleReportPerpDEXModal'
import { Flex, Type } from 'theme/base'

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

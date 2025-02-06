import { Trans } from '@lingui/macro'
import { FileCsv } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { exportTradersCsvApi } from 'apis/traderApis'
import { normalizeTraderPayload, transformRealisedField } from 'apis/traderApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import { useCustomizeColumns } from 'components/@trader/TraderExplorerTableView/useCustomiseColumns'
import ToastBody from 'components/@ui/ToastBody'
import { getFiltersFromFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { TraderData } from 'entities/trader'
import useMyProfileStore from 'hooks/store/useMyProfile'
import useTradersContext from 'pages/Explorer/useTradersContext'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Flex, IconBox, Type } from 'theme/base'
import { TOOLTIP_KEYS } from 'utils/config/keys'

import TooltipContent from './TooltipContent'

interface ExportCsvButtonProps {
  hasTitle?: boolean
}

const ExportCsvButton = ({ hasTitle }: ExportCsvButtonProps) => {
  const { md } = useResponsive()
  const { visibleColumns } = useCustomizeColumns()
  const handleClickLogin = useClickLoginButton()
  const { timeOption, selectedProtocols, currentSort, filters } = useTradersContext()
  const { myProfile } = useMyProfileStore()

  const { mutate: getCSVData, isLoading: isExportLoading } = useMutation(exportTradersCsvApi, {
    onSuccess: (csvContent) => {
      const date = dayjs(new Date()).format('YYYY-MM-DD')
      // Create a Blob from the CSV string
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Copin-traders-${date}.csv`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      // Show success toast
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Export CSV has been succeeded</Trans>} />)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onExportCSV = () => {
    const ranges = getFiltersFromFormValues(filters)
    const fieldData = visibleColumns.map((data) => transformRealisedField(data))
    const payload = {
      protocols: selectedProtocols,
      queries: [{ fieldName: 'type', value: timeOption.id }],
      ranges,
      sortBy: currentSort?.sortBy,
      sortType: currentSort?.sortType,
      fields: fieldData,
    }
    const { ranges: rangeData, sortBy, sortType } = normalizeTraderPayload(payload)

    if (rangeData) {
      payload.ranges = rangeData
      payload.sortBy = sortBy as keyof TraderData | undefined
      payload.sortType = sortType
    }

    getCSVData(payload)
  }

  const handleExportCSV = () => {
    if (!myProfile) {
      handleClickLogin()
      return
    }

    onExportCSV()
  }

  return (
    <>
      <Flex
        sx={{
          px: md ? '6px' : 0,
          mr: ['-4px', '-2px', '-2px', 0],
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        {!isExportLoading && (
          <IconBox icon={<FileCsv size={18} />} color="neutral3" onClick={handleExportCSV} sx={{ cursor: 'pointer' }} />
        )}
        <Button
          isLoading={isExportLoading}
          px={0}
          variant="ghost"
          onClick={handleExportCSV}
          sx={{ fontWeight: 'normal', marginRight: 'auto', color: 'neutral3' }}
          data-tooltip-id={TOOLTIP_KEYS.EXPORT_TRADERS_CSV}
        >
          {hasTitle ? <Type.Caption color={'neutral1'}>Export CSV</Type.Caption> : ''}
        </Button>
      </Flex>
      {!!myProfile && (
        <Tooltip id={TOOLTIP_KEYS.EXPORT_TRADERS_CSV} clickable={true}>
          <Type.Caption sx={{ maxWidth: 300 }}>
            <TooltipContent myProfile={myProfile} />
          </Type.Caption>
        </Tooltip>
      )}
    </>
  )
}

export default ExportCsvButton

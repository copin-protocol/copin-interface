import { Trans } from '@lingui/macro'
import { FileCsv } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { exportTradersCsvApi, preExportTradersCsvApi } from 'apis/traderApis'
import { normalizeTraderPayload, transformRealisedField } from 'apis/traderApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import ToastBody from 'components/@ui/ToastBody'
import { getFiltersFromFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { TraderData } from 'entities/trader'
import useBenefitModalStore from 'hooks/features/subscription/useBenefitModalStore'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { useTraderExplorerTableColumns } from 'hooks/store/useTraderCustomizeColumns'
import useTradersContext from 'pages/Explorer/useTradersContext'
import { Button } from 'theme/Buttons'
import { Flex, IconBox, Type } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import ExportCsvConfirmModal from './ExportCsvConfirmModal'

interface ExportCsvButtonProps {
  hasTitle?: boolean
}

const ExportCsvButton = ({ hasTitle }: ExportCsvButtonProps) => {
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { md } = useResponsive()
  const { columnKeys } = useTraderExplorerTableColumns()
  const handleClickLogin = useClickLoginButton()
  const { timeOption, currentSort, filters } = useTradersContext()
  const { myProfile } = useMyProfileStore()
  const { enableExport, planToExport } = useExplorerPermission()
  const { setConfig } = useBenefitModalStore()
  const [confirmingData, setConfirmingData] = useState<{
    estimatedQuota: number
    remainingQuota: number
  } | null>(null)

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

  const getRequest = () => {
    const ranges = getFiltersFromFormValues(filters)
    const fieldData = columnKeys.map((data) => transformRealisedField(data))
    const payload = {
      protocols: selectedProtocols ?? [],
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
    return payload
  }

  const onExportCSV = () => {
    const payload = getRequest()
    getCSVData(payload)
  }

  const handleExportCSV = async () => {
    if (!myProfile) {
      handleClickLogin()
      return
    }
    if (!enableExport) {
      setConfig(SubscriptionFeatureEnum.TRADER_EXPLORER, planToExport)
      return
    }
    const payload = getRequest()
    const data = await preExportTradersCsvApi(payload)
    if (data.estimatedQuota === 0) {
      toast.error(
        <ToastBody title={<Trans>Error</Trans>} message={<Trans>Can&apos;t retrieve any data to export</Trans>} />
      )
      return
    }
    setConfirmingData(data)
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
        {!isExportLoading && !confirmingData && (
          <IconBox icon={<FileCsv size={18} />} color="neutral3" onClick={handleExportCSV} sx={{ cursor: 'pointer' }} />
        )}
        <Button
          isLoading={isExportLoading || !!confirmingData}
          px={0}
          variant="ghost"
          onClick={handleExportCSV}
          sx={{ fontWeight: 'normal', marginRight: 'auto', color: 'neutral3' }}
        >
          {hasTitle ? <Type.Caption color={'neutral1'}>Export CSV</Type.Caption> : ''}
        </Button>
      </Flex>

      {!!confirmingData && confirmingData.remainingQuota >= confirmingData.estimatedQuota && (
        <ExportCsvConfirmModal
          isOpen={!!confirmingData}
          onClose={() => setConfirmingData(null)}
          onConfirm={() => {
            setConfirmingData(null)
            onExportCSV()
          }}
          confirmingData={confirmingData}
        />
      )}
      {!!confirmingData && confirmingData.remainingQuota < confirmingData.estimatedQuota && (
        <UpgradeModal
          isOpen={!!confirmingData}
          onDismiss={() => {
            setConfirmingData(null)
          }}
          title={<Trans>Export Limit Exceeded</Trans>}
          descriptionSx={{
            textAlign: 'center',
          }}
          description={
            <Trans>
              You need {formatNumber(confirmingData.estimatedQuota)} quota, but your current plan only includes{' '}
              {formatNumber(confirmingData.remainingQuota)}. Please upgrade to export this data.
            </Trans>
          }
        />
      )}
    </>
  )
}

export default ExportCsvButton

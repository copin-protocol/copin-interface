import { Trans } from '@lingui/macro'
import { cloneElement, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMyCopySourcePositionDetailApi } from 'apis/copyPositionApis'
import ToastBody from 'components/@ui/ToastBody'
import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useSearchParams from 'hooks/router/useSearchParams'
import { PositionStatusEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

import CloseCopyPositionModal from '../CloseCopyPositionModal'
import CopyPositionDetailsDrawer from '../CopyPositionDetailsDrawer'
import TraderPositionDetailsDrawer from '../TraderPositionDetailsDrawer'

export default function CopyPositionsContainer({
  onClosePositionSuccess,
  children,
}: {
  onClosePositionSuccess: () => void
  children: any
}) {
  const { copyWallets } = useCopyWalletContext()
  const { allCopyTrades: copyTrades } = useAllCopyTrades()
  const { prices } = useGetUsdPrices()
  const [openSourceDrawer, setOpenSourceDrawer] = useState(false)
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [openCloseModal, setOpenCloseModal] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopyPositionData | undefined>()
  const [sourcePosition, setSourcePosition] = useState<PositionData | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined

  const handleSelectSourceItem = useCallback(
    async (data: CopyPositionData, event?: any) => {
      event?.stopPropagation()
      setCurrentCopyPosition(data)
      const isCopyOpen = data.status === PositionStatusEnum.OPEN
      try {
        setSubmitting(true)
        const positionDetail = await getMyCopySourcePositionDetailApi({
          copyId: data?.id ?? '',
          isOpen: isCopyOpen,
        })
        const isOpen = positionDetail.status === PositionStatusEnum.OPEN
        setSubmitting(false)
        if (!positionDetail || (!isOpen && isCopyOpen) || (isOpen && !isCopyOpen)) throw Error(`Can't find data`)
        setSourcePosition(positionDetail)
        if (isCopyOpen) {
          setOpenSourceDrawer(true)
          window.history.replaceState(
            null,
            '',
            generatePositionDetailsRoute({ ...positionDetail, txHash: positionDetail.txHashes?.[0] })
          )
        } else {
          setOpenSourceDrawer(true)
          window.history.replaceState(
            null,
            '',
            generatePositionDetailsRoute({
              ...positionDetail,
              txHash: positionDetail.txHashes?.[0],
              nextHours: nextHoursParam,
            })
          )
        }
      } catch (error: any) {
        if (error?.message?.includes(`Can't find data`)) {
          if (isCopyOpen) {
            setOpenCloseModal(true)
          } else {
            toast.error(
              <ToastBody
                title={<Trans>Warning</Trans>}
                message={<Trans>No link to the trader’s original position was found.</Trans>}
              />
            )
          }
        }
        setSubmitting(false)
      }
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenSourceDrawer(false)
  }

  const handleSelectCopyItem = (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }

  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
  }

  return (
    <>
      {cloneElement(children, {
        externalSource: {
          copyWallets,
          copyTrades,
          prices,
          submitting,
          currentId: currentCopyPosition?.id,
          onViewSource: handleSelectSourceItem,
          handleSelectCopyItem,
        },
      })}
      <TraderPositionDetailsDrawer
        isOpen={openSourceDrawer}
        onDismiss={handleDismiss}
        protocol={sourcePosition?.protocol}
        id={sourcePosition?.id}
        chartProfitId="my-profile-position"
      />
      <CopyPositionDetailsDrawer isOpen={openCopyDrawer} onDismiss={handleCopyDismiss} id={currentCopyPosition?.id} />
      {openCloseModal && currentCopyPosition?.id && (
        <CloseCopyPositionModal
          copyId={currentCopyPosition?.id}
          onDismiss={() => setOpenCloseModal(false)}
          onSuccess={onClosePositionSuccess}
        />
      )}
    </>
  )
}

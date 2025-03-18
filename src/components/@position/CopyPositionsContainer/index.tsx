import { Trans } from '@lingui/macro'
import { ReactNode, cloneElement, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMyCopySourcePositionDetailApi } from 'apis/copyPositionApis'
import { closeHlPosition, closeLitePositionApi } from 'apis/liteApis'
import ConfirmModal from 'components/@ui/ConfirmModal'
import ToastBody from 'components/@ui/ToastBody'
import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import useAllCopyTrades from 'hooks/features/copyTrade/useAllCopyTrades'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useSearchParams from 'hooks/router/useSearchParams'
import { PositionStatusEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { getErrorMessage } from 'utils/helpers/handleError'

import CopyPositionDetailsDrawer from '../CopyPositionDetailsDrawer'
import TraderPositionDetailsDrawer from '../TraderPositionDetailsDrawer'
import UnlinkCopyPositionModal from '../UnlinkCopyPositionModal'
import { ExternalSourceCopyPositions } from '../types'

export default function CopyPositionsContainer({
  onClosePositionSuccess,
  children,
}: {
  onClosePositionSuccess: () => void
  children: any
}) {
  const { copyWallets, embeddedWallet } = useCopyWalletContext()
  const { allCopyTrades: copyTrades } = useAllCopyTrades()
  const [openSourceDrawer, setOpenSourceDrawer] = useState(false)
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [openUnlinkModal, setOpenUnlinkModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{ message: ReactNode; data: any } | undefined>(undefined)
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
            setOpenUnlinkModal(true)
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

  const handleCloseCopyItem = async (data: CopyPositionData) => {
    setConfirmModal({
      message: <Trans>Do you want to close this position?</Trans>,
      data,
    })
  }

  const closeCopyItem = async (data: CopyPositionData) => {
    if (!embeddedWallet?.hyperliquid?.embeddedWallet) return
    setSubmitting(true)
    try {
      if (data.openingPositionType === 'onlyLiveHyper') {
        await closeHlPosition({
          walletAddress: embeddedWallet.hyperliquid.embeddedWallet,
          isLong: !!data.isLong,
          size: data.totalSizeDelta ?? 0,
          symbol: data.pair ?? '',
        })
      } else {
        await closeLitePositionApi(data.id ?? '')
      }
      onClosePositionSuccess()
      setConfirmModal(undefined)
    } catch (err) {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    }
    setSubmitting(false)
  }

  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
  }

  const handleUnlinkCopyPosition = (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenUnlinkModal(true)
  }

  return (
    <>
      {cloneElement<{ externalSource: ExternalSourceCopyPositions }>(children, {
        externalSource: {
          copyWallets,
          copyTrades,
          submitting,
          currentId: currentCopyPosition?.id,
          onViewSource: handleSelectSourceItem,
          handleSelectCopyItem,
          handleCloseCopyItem,
          handleUnlinkCopyPosition,
        },
      })}
      <TraderPositionDetailsDrawer
        isOpen={openSourceDrawer}
        onDismiss={handleDismiss}
        protocol={sourcePosition?.protocol}
        id={sourcePosition?.id}
        chartProfitId="my-profile-position"
      />
      <CopyPositionDetailsDrawer isOpen={openCopyDrawer} onDismiss={handleCopyDismiss} data={currentCopyPosition} />
      {openUnlinkModal && currentCopyPosition?.id && (
        <UnlinkCopyPositionModal
          copyId={currentCopyPosition?.id}
          exchange={currentCopyPosition?.exchange}
          onDismiss={() => setOpenUnlinkModal(false)}
          onSuccess={onClosePositionSuccess}
        />
      )}

      {!!confirmModal && (
        <ConfirmModal
          isConfirming={submitting}
          message={confirmModal.message}
          onConfirm={() => closeCopyItem(confirmModal.data)}
          onDismiss={() => {
            setConfirmModal(undefined)
          }}
        />
      )}
    </>
  )
}

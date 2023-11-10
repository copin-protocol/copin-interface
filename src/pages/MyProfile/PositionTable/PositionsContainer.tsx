import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { cloneElement, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMyCopySourcePositionDetailApi } from 'apis/copyPositionApis'
import Container from 'components/@ui/Container'
import ToastBody from 'components/@ui/ToastBody'
import CopyTradePositionDetails from 'components/CopyTradePositionDetails'
import PositionDetails from 'components/PositionDetails'
import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useSearchParams from 'hooks/router/useSearchParams'
import useUsdPrices, { UsdPrices } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { PositionStatusEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { generateClosedPositionRoute, generateOpeningPositionRoute } from 'utils/helpers/generateRoute'

import ClosePositionModal from './ClosePositionModal'

export type ExternalSource = {
  prices: UsdPrices
  submitting: boolean
  currentId: string
  onViewSource: (data: CopyPositionData, event?: any) => void
  handleSelectCopyItem: (data: CopyPositionData) => void
}
export default function PositionsContainer({
  onClosePositionSuccess,
  children,
}: {
  onClosePositionSuccess: () => void
  children: any
}) {
  const isMobile = useIsMobile()
  const { prices } = useUsdPrices()
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
      const isOpen = data.status === PositionStatusEnum.OPEN
      try {
        setSubmitting(true)
        const positionDetail = await getMyCopySourcePositionDetailApi({
          copyId: data?.id ?? '',
          isOpen,
        })
        setSubmitting(false)
        if (
          !positionDetail ||
          (positionDetail.status && positionDetail.status !== PositionStatusEnum.OPEN && isOpen) ||
          (((!positionDetail.status && !positionDetail.id) || positionDetail.status === PositionStatusEnum.OPEN) &&
            !isOpen)
        )
          throw Error(`Can't find data`)
        setSourcePosition(positionDetail)
        if (isOpen) {
          setOpenSourceDrawer(true)
          window.history.replaceState(null, '', generateOpeningPositionRoute(positionDetail))
        } else {
          setOpenSourceDrawer(true)
          window.history.replaceState(
            null,
            '',
            generateClosedPositionRoute({
              protocol: positionDetail.protocol,
              id: positionDetail.id,
              nextHours: nextHoursParam,
            })
          )
        }
      } catch (error: any) {
        if (error?.message?.includes(`Can't find data`)) {
          if (isOpen) {
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
    setSourcePosition(undefined)
    setCurrentCopyPosition(undefined)
  }

  const handleSelectCopyItem = (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }

  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
    setCurrentCopyPosition(undefined)
  }

  return (
    <>
      {cloneElement(children, {
        externalSource: {
          prices,
          submitting,
          currentId: currentCopyPosition?.id,
          onViewSource: handleSelectSourceItem,
          handleSelectCopyItem,
        },
      })}
      {openSourceDrawer && sourcePosition && (
        <Drawer
          isOpen={openSourceDrawer}
          onDismiss={handleDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral6"
        >
          <Container sx={{ position: 'relative' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3 }}
              onClick={handleDismiss}
            />
            <PositionDetails
              protocol={sourcePosition.protocol}
              id={sourcePosition.status === PositionStatusEnum.OPEN ? undefined : sourcePosition?.id}
              account={sourcePosition?.account}
              indexToken={sourcePosition?.indexToken}
              dataKey={sourcePosition?.key}
              isShow={openSourceDrawer}
            />
          </Container>
        </Drawer>
      )}
      {openCopyDrawer && currentCopyPosition && (
        <Drawer
          isOpen={openCopyDrawer}
          onDismiss={handleCopyDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral5"
        >
          <Container sx={{ position: 'relative', height: '100%' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
              onClick={handleCopyDismiss}
            />
            <CopyTradePositionDetails id={currentCopyPosition?.id} />
          </Container>
        </Drawer>
      )}
      {openCloseModal && currentCopyPosition?.id && (
        <ClosePositionModal
          copyId={currentCopyPosition?.id}
          onDismiss={() => setOpenCloseModal(false)}
          onSuccess={onClosePositionSuccess}
        />
      )}
    </>
  )
}

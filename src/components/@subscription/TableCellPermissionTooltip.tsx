import { useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import { PlanUpgradeContent } from 'components/@subscription/PlanUpgradeIndicator'
import Tooltip from 'theme/Tooltip'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function TableCellPermissionTooltip({ anchorSelect }: { anchorSelect: string }) {
  return (
    <>
      <PermissionTooltip requiredPlan={SubscriptionPlanEnum.STARTER} anchorSelect={anchorSelect} />
      <PermissionTooltip requiredPlan={SubscriptionPlanEnum.PRO} anchorSelect={anchorSelect} />
      <PermissionTooltip requiredPlan={SubscriptionPlanEnum.ELITE} anchorSelect={anchorSelect} />
    </>
  )
}

function PermissionTooltip({
  requiredPlan,
  anchorSelect,
}: {
  requiredPlan: SubscriptionPlanEnum
  anchorSelect: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  return (
    <Tooltip
      anchorSelect={`.${anchorSelect}${requiredPlan}`}
      clickable
      delayShow={360}
      openEvents={{ click: true }}
      closeEvents={{ click: true }}
      isOpen={visible}
      setIsOpen={setVisible}
    >
      <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
        <PlanUpgradeContent requiredPlan={requiredPlan} />
      </OutsideClickHandler>
    </Tooltip>
  )
}

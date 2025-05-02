import { useHistory } from 'react-router-dom'

import ROUTES from 'utils/config/routes'

export default function useLiteClickDepositFund() {
  const history = useHistory()
  const handleClickDeposit = () => {
    history.push(`${ROUTES.LITE.path}?tab=wallet&wallet=deposit&force_shake=1`)
  }
  return handleClickDeposit
}

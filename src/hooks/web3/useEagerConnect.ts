import { useEffect } from 'react'

import { useAuthContext } from 'hooks/web3/useAuth'

const useEagerConnect = () => {
  const { eagerAuth } = useAuthContext()
  useEffect(() => {
    if (eagerAuth) {
      eagerAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useEagerConnect

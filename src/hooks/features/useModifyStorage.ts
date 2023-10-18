import { useEffect } from 'react'

import { STORAGE_KEYS } from 'utils/config/keys'

export default function useModifyStorage() {
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.CONDITIONAL_FILTERS)
  }, [])
}

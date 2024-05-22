import { memo } from 'react'
import { useHistory } from 'react-router-dom'

import { parsedQueryString } from 'hooks/router/useParsedQueryString'
import { TimeFilterByEnum } from 'utils/config/enums'
import { createUrlWithParams } from 'utils/helpers/generateRoute'

const RemoveTimeFilter = memo(function RemoveTimeFilterMemo() {
  const history = useHistory()
  const searchParams = parsedQueryString(history?.location?.search)
  if (
    (searchParams?.time as string)?.toLowerCase?.() ===
    (TimeFilterByEnum.ALL_TIME as unknown as string).toLocaleLowerCase()
  ) {
    delete searchParams.time
  }
  const url = createUrlWithParams({ url: history.location.pathname, params: searchParams })
  history.replace(url)
  return null
})

export default RemoveTimeFilter

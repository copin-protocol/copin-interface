import { useQuery } from 'react-query'

import { getUserLogDetailsByModelIdApi } from 'apis/userLogsApis'
import { QUERY_KEYS } from 'utils/config/keys'

const useUserLogDetails = ({ modelId }: { modelId?: string }) => {
  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_USER_LOG_DETAILS_BY_MODEL_ID, modelId],
    () => getUserLogDetailsByModelIdApi(modelId ?? ''),
    { keepPreviousData: true, retry: 0, enabled: !!modelId }
  )

  return { data, isLoading: isFetching }
}

export default useUserLogDetails

import NoDataFound from 'components/@ui/NoDataFound'
import UserLogItem from 'components/@widgets/UserLogItem'
import { CopyPositionData } from 'entities/copyTrade.d'
import useUserLogDetails from 'hooks/features/copyTrade/useUserLogDetails'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'

export default function CopyPositionHistories({ position }: { position: CopyPositionData }) {
  const { data, isLoading } = useUserLogDetails({ modelId: position?.id })
  return (
    <Box px={3} sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
      <Flex pb={3} flexDirection="column">
        {isLoading && <Loading />}
        {!isLoading && !data?.length && <NoDataFound />}
        {!isLoading &&
          !!data?.length &&
          data.map((log) => {
            return <UserLogItem key={log.id} data={log} />
          })}
      </Flex>
    </Box>
  )
}

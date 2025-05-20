import { Box, Flex, Image, Type } from 'theme/base'
import { PlanConfig } from 'utils/config/subscription'

const PlanInfoCard = ({ plan, days, isActive = false }: { plan: PlanConfig; days: number; isActive?: boolean }) => {
  return (
    <Flex
      variant="card"
      flex="1"
      sx={{
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        border: 'small',
        borderColor: isActive ? plan.color : 'neutral4',
        borderRadius: 'md',
      }}
    >
      <Image height={32} src={`/images/subscriptions/${plan.title}.png`} />
      <Box textAlign="left">
        <Type.BodyBold color={plan.color} display="block">
          {plan.title} PLAN
        </Type.BodyBold>

        <Type.Caption>{days} days</Type.Caption>
      </Box>
    </Flex>
  )
}

export default PlanInfoCard

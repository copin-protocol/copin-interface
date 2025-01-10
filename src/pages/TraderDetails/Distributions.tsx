import { ChartPieSlice } from '@phosphor-icons/react'
import React from 'react'

import SectionTitle from 'components/@ui/SectionTitle'
import { Box } from 'theme/base'

const Distributions = () => {
  return (
    <Box height="fit-content" px={12} py={16}>
      <SectionTitle icon={ChartPieSlice} title="Distributions" />
    </Box>
  )
}

export default Distributions

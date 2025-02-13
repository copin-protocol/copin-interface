import React from 'react'

import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'

import Overview from './Overview'

export default function StatsCEXPage() {
  return (
    <>
      <CustomPageTitle title="CEX Depth" />
      <Container p={3} height="100%">
        <Overview />
      </Container>
    </>
  )
}

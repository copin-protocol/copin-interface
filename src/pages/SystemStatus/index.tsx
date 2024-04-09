import React from 'react'

import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'

import Overview from './Overview'

export default function SystemStatus() {
  return (
    <>
      <CustomPageTitle title="System Status" />
      <Container p={3}>
        <Overview />
      </Container>
    </>
  )
}

import CustomPageTitle from 'components/@ui/CustomPageTitle'

import Layout from './Layouts/Layout'
import Referral from './Referral'

export default function Settings() {
  return (
    <>
      <CustomPageTitle title="Settings" />
      <Layout referral={<Referral />} />
    </>
  )
}

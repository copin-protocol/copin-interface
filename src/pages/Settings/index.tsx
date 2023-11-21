import CustomPageTitle from 'components/@ui/CustomPageTitle'

import AlertList from './AlertList'
import Layout from './Layouts/Layout'
import Referral from './Referral'
import UserSubscription from './UserSubscription'

export default function Settings() {
  return (
    <>
      <CustomPageTitle title="Settings" />
      <Layout referral={<Referral />} userSubscription={<UserSubscription />} botAlert={<AlertList />} />
    </>
  )
}

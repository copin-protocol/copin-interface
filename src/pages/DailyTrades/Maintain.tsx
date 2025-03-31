import AlertBanner from 'theme/Alert/AlertBanner'
import { Flex, Type } from 'theme/base'

export default function Maintain() {
  return (
    <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
      <AlertBanner
        id="live-trade-maintain"
        type="warning"
        message={
          <Type.Caption>
            This feature is under maintenance due to high resource usage affecting data accuracy. We&apos;re optimizing
            it for better performance. Thanks for your understanding!
          </Type.Caption>
        }
      />
    </Flex>
  )
}

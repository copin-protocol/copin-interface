import { Trans } from '@lingui/macro'

import CreateWalletAction from 'components/CreateWalletAction'
import { CopyWalletData } from 'entities/copyWallet'
import Loading from 'theme/Loading'
import { Flex, Type } from 'theme/base'

export default function CheckingWalletRenderer({
  loadingCopyWallets,
  copyWallets,
  children,
}: {
  children: JSX.Element
  loadingCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
}) {
  if (loadingCopyWallets) return <Loading />

  if (!loadingCopyWallets && !copyWallets?.length)
    return (
      <Flex mt={[3, 100]} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Type.LargeBold mb={1}>
          <Trans>You don&apos;t have any wallet</Trans>
        </Type.LargeBold>
        <Type.Caption mb={24} color="neutral2">
          <Trans>Please create a wallet to start copy</Trans>
        </Type.Caption>
        <Flex
          sx={{
            flexDirection: ['column', 'row'],
            maxWidth: 600,
            gap: 3,
            '& > *': {
              flex: 1,
              flexDirection: 'column',
              border: 'small',
              borderColor: 'neutral4',
              borderRadius: 'xs',
              '& > *:nth-child(2)': { flex: 1 },
            },
          }}
        >
          <CreateWalletAction />
        </Flex>
      </Flex>
    )

  return children
}

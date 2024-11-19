import { Trans } from '@lingui/macro'

import CreateWalletAction from 'components/@wallet/CreateWalletAction'
import { CopyWalletData } from 'entities/copyWallet'
import Loading from 'theme/Loading'
import { Flex, Type } from 'theme/base'

export enum CreateTypeWalletEnum {
  FULL = 'FULL',
  CEX = 'CEX',
  DCP = 'DCP',
}
export default function CheckingWalletRenderer({
  loadingCopyWallets,
  copyWallets,
  children,
  type = CreateTypeWalletEnum.FULL,
}: {
  children: JSX.Element
  loadingCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
  type?: CreateTypeWalletEnum
}) {
  if (loadingCopyWallets) return <Loading />

  if (!loadingCopyWallets && !copyWallets?.length)
    return (
      <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, height: '100%' }}>
        <Type.LargeBold mb={1}>
          {type === CreateTypeWalletEnum.DCP ? (
            <Trans>You don&apos;t have any wallet</Trans>
          ) : (
            <Trans>You don&apos;t have any API</Trans>
          )}
        </Type.LargeBold>
        <Type.Caption mb={24} color="neutral2">
          {type === CreateTypeWalletEnum.DCP ? (
            <Trans>Please create a wallet to start copy</Trans>
          ) : (
            <Trans>Please connect a API to start copy</Trans>
          )}
        </Type.Caption>
        <Flex
          sx={{
            flexWrap: [undefined, 'wrap'],
            maxWidth: ['100svw', '80%'],
            flexDirection: ['column', 'row'],
            gap: 3,
            '& > *': {
              flex: 1,
              flexDirection: 'column',
              border: 'small',
              borderColor: 'neutral4',
              borderRadius: 'xs',
              '& > *:nth-child(2)': { flex: 1 },
            },
            overflow: 'auto',
          }}
        >
          <CreateWalletAction type={type} />
        </Flex>
      </Flex>
    )

  return children
}

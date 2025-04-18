import { Trans } from '@lingui/macro'

import { CopyExchangeAlertBanner } from 'components/@systemConfig/SystemAlertBanner'
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
      <Flex sx={{ flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <CopyExchangeAlertBanner />
        <Flex
          flex="1 0 0"
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            p: 3,
          }}
        >
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
      </Flex>
    )

  return children
}

// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { PencilSimpleLine } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { EditText } from 'react-edit-text'
// eslint-disable-next-line no-restricted-imports
import 'react-edit-text/dist/index.css'

import TitleWithIcon from 'components/@ui/TilleWithIcon'
import { CopyWalletData } from 'entities/copyWallet'
import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'
import Colors from 'theme/colors'
import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { getColorFromText } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'

import DeleteWalletAction from './DeleteWalletAction'
import WalletInfo from './WalletInfo'

interface WalletDetailsProps {
  data: CopyWalletData
  hasBorderTop?: boolean
  handleUpdate: ({
    copyWalletId,
    name,
    previousValue,
    callback,
  }: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => void
}
export default function WalletDetailsCard({ data, hasBorderTop, handleUpdate }: WalletDetailsProps) {
  const isAPIKey = data.exchange === CopyTradePlatformEnum.BINGX
  const [walletName, setWalletName] = useState(parseWalletName(data))

  return (
    <Flex
      p={3}
      flexDirection="column"
      sx={{ borderTop: hasBorderTop ? 'small' : 'none', borderBottom: 'small', borderColor: 'neutral4', gap: 20 }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <TitleWithIcon
          color={getColorFromText(data.id)}
          title={
            <EditText
              value={walletName}
              showEditButton
              editButtonContent={<PencilSimpleLine size={20} />}
              editButtonProps={{ style: { backgroundColor: 'transparent', color: Colors(true).primary1 } }}
              style={{
                margin: 0,
                padding: '0px',
                fontSize: '13px',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderColor: Colors(true).neutral3,
                minHeight: '25px',
              }}
              onChange={(e) => {
                const value = e.target.value
                if (value && value.length > WALLET_NAME_MAX_LENGTH) return
                setWalletName(e.target.value)
              }}
              onSave={({ value, previousValue }) => {
                if (!!value) {
                  handleUpdate({ copyWalletId: data.id, name: value, previousValue, callback: setWalletName })
                } else {
                  setWalletName(previousValue)
                }
              }}
            />
          }
        />
        {isAPIKey ? (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <Type.CaptionBold>API Key:</Type.CaptionBold>
              <Type.Caption color="neutral3">{addressShorten(data?.bingX?.apiKey ?? '')}</Type.Caption>
            </Flex>
            <DeleteWalletAction data={data} />
          </Flex>
        ) : (
          <Flex alignItems="center" sx={{ gap: 20 }}>
            <Button type="button" variant="ghostPrimary" sx={{ p: 0 }}>
              <Trans>Deposit</Trans>
            </Button>
            <Button type="button" variant="ghostPrimary" sx={{ p: 0 }}>
              <Trans>Withdraw</Trans>
            </Button>
          </Flex>
        )}
      </Flex>
      <WalletInfo data={data} sx={{ width: '100%' }} />
    </Flex>
  )
}

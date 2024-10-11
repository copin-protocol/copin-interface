import { Trans } from '@lingui/macro'
import { CheckCircle, Warning, WarningOctagon, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getReferralRewardApi, getReferralStatisticApi } from 'apis/referralManagement'
import { checkBeforeAddRefApi, getMyProfileApi } from 'apis/userApis'
import InputReferral from 'components/@auth/InputReferral'
import { GradientText } from 'components/@ui/GradientText'
import ToastBody from 'components/@ui/ToastBody'
import { UserData } from 'entities/user'
import useReferralActions from 'hooks/features/useReferralActions'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { linearGradient1 } from 'theme/colors'
import { TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { compactNumber, formatNumber } from 'utils/helpers/format'

export default function ReferralStats() {
  const { isAuthenticated, profile } = useAuthContext()
  const { sm } = useResponsive()
  const { data: statistic } = useQuery(
    [QUERY_KEYS.GET_REFERRAL_DATA, 'statistic', isAuthenticated, profile?.username],
    () => getReferralStatisticApi(),
    { enabled: !!isAuthenticated }
  )
  const data = statistic?.[TimeFilterByEnum.ALL_TIME]
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplate: [
          `
            "item-1 item-2" 108px
            "item-3 item-4" 108px
            "item-5 item-6" 108px
            "item-7 item-7" 164px
          `,
          `
            "item-1 item-2" 108px
            "item-3 item-4" 108px
            "item-5 item-6" 108px
            "item-7 item-7" 164px
          `,
          `
            "item-1 item-2 item-3 item-7" 108px
            "item-4 item-5 item-6 item-7" 108px
          `,
          `
            "item-1 item-2" 84px
            "item-3 item-4" 84px
            "item-5 item-6" 84px
            "item-7 item-7" 164px
          `,
          `
            "item-1 item-2 item-3 item-7" 1fr
            "item-4 item-5 item-6 item-7" 1fr
          `,
        ],
        gridTemplateColumns: ['1fr 1fr', '1fr 1fr', 'repeat(4, 1fr)', '1fr 1fr', 'repeat(4, 1fr)'],
        '& > *': { outline: '1px solid', outlineColor: 'neutral4' },
      }}
    >
      <Box sx={{ gridArea: 'item-1' }}>
        <NormalStatsItemContainer label="F1 Referrals" value={data?.f1Referrals ?? 0} />
      </Box>
      <Box sx={{ gridArea: 'item-2' }}>
        <NormalStatsItemContainer label="F2 Referrals" value={data?.f2Referrals ?? 0} />
      </Box>
      <Box sx={{ gridArea: 'item-3' }}>
        <NormalStatsItemContainer
          label="Total Earned (USDT)"
          value={
            <ValueWithCurrency
              value={
                <StatsValue isGradient>
                  {sm ? formatNumber(data?.totalEarned ?? 0, 2, 2) : compactNumber(data?.totalEarned ?? 0, 2)}
                </StatsValue>
              }
            />
          }
        />
      </Box>
      <Box sx={{ gridArea: 'item-4' }}>
        <NormalStatsItemContainer
          label="F1 Commission (USDT)"
          value={
            <ValueWithCurrency
              value={sm ? formatNumber(data?.f1Commissions ?? 0, 2, 2) : compactNumber(data?.f1Commissions ?? 0, 2)}
            />
          }
        />
      </Box>
      <Box sx={{ gridArea: 'item-5' }}>
        <NormalStatsItemContainer
          label="F2 Commission (USDT)"
          value={
            <ValueWithCurrency
              value={sm ? formatNumber(data?.f2Commissions ?? 0, 2, 2) : compactNumber(data?.f2Commissions ?? 0, 2)}
            />
          }
        />
      </Box>
      <Box sx={{ gridArea: 'item-6' }}>
        <NormalStatsItemContainer
          label={<RebateTitle />}
          value={
            <ValueWithCurrency
              value={sm ? formatNumber(data?.feeRebates ?? 0, 2, 2) : compactNumber(data?.feeRebates ?? 0, 2)}
            />
          }
        />
      </Box>
      <Box sx={{ gridArea: 'item-7' }}>
        <ClaimableStatsItem profile={profile} />
      </Box>
    </Box>
  )
}
function ValueWithCurrency({ value }: { value: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      <Box as="span">{value}</Box>
      {/* <IconUsdt /> */}
    </Flex>
  )
}

function StatsLabel({ children }: { children: ReactNode }) {
  return (
    <Type.Body color="neutral3" sx={{ fontSize: ['13px', '16px'], lineHeight: '24px' }}>
      {children}
    </Type.Body>
  )
}
function StatsValue({
  children,
  isGradient = false,
  sx = {},
  suffix,
}: {
  children: ReactNode
  isGradient?: boolean
  sx?: any
  suffix?: ReactNode
}) {
  return (
    <Type.H5 sx={{ lineHeight: '1em', ...sx }}>
      {isGradient ? <GradientText bg={linearGradient1}>{children}</GradientText> : children}
      {suffix}
    </Type.H5>
  )
}
function NormalStatsItemContainer({ label, value, sx = {} }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Flex
      width="100%"
      height="100%"
      sx={{
        flexDirection: 'column',
        gap: 12,
        justifyContent: 'center',
        px: 3,
        bg: 'neutral6',
        ...sx,
      }}
    >
      <StatsLabel>{label}</StatsLabel>
      <StatsValue>{value}</StatsValue>
    </Flex>
  )
}
function ClaimableStatsItem({ profile }: { profile: UserData | null }) {
  const { data } = useQuery([QUERY_KEYS.GET_REFERRAL_DATA, 'reward', profile?.username], getReferralRewardApi, {
    enabled: !!profile?.username,
  })
  return (
    <Flex
      width="100%"
      height="100%"
      sx={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        position: 'relative',
        bg: 'neutral6',
      }}
    >
      <Type.Body color="neutral3">Total Unclaim (USDT)</Type.Body>
      <Box mt={2} />
      <StatsValue sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {formatNumber(data?.totalUnclaim ?? 0, 2, 2)}
      </StatsValue>
      <Box
        mt={[3, 3, 24]}
        sx={{
          px: 24,
          py: 2,
          borderRadius: '40px',
          overflow: 'hidden',
          fontWeight: 'normal',
          position: 'relative',
          cursor: 'not-allowed',
          '.gradient': {
            rotate: '0deg',
            transition: '0.5s',
            transformOrigin: '50% 50%',
          },
          '&:hover .gradient': {
            rotate: '180deg',
          },
        }}
      >
        <Box
          className="gradient"
          sx={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            bg: 'neutral6',
            width: '300px',
            height: '300px',
            // transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 1,
            background: linearGradient1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '1px',
            left: '1px',
            right: '1px',
            bottom: '1px',
            bg: 'neutral6',
            borderRadius: '38px',
            zIndex: 2,
          }}
        />
        <Type.Caption sx={{ display: 'block', position: 'relative', zIndex: 3, fontWeight: 600 }} color="neutral3">
          Claim {formatNumber(data?.claimable ?? 0, 2, 2)} USDT
        </Type.Caption>
      </Box>
      <Type.Small mt={2} color="neutral3">
        Pending: {formatNumber(data?.pending ?? 0, 2, 2)} USDT
      </Type.Small>
    </Flex>
  )
}

function RebateTitle() {
  const { myProfile, setMyProfile } = useMyProfileStore()
  const { refetch } = useQuery('get_user_profile_after_change_referrer', getMyProfileApi, {
    enabled: false,
    onSuccess: (data) => {
      if (!data) return
      setMyProfile(data)
    },
  })
  const [openModal, setOpenModal] = useState(false)
  const { data: isEligibleAddReferrer } = useQuery(
    [QUERY_KEYS.GET_REFERRAL_DATA, 'eligible', myProfile?.username],
    checkBeforeAddRefApi,
    {
      retry: 0,
      enabled: !!myProfile?.username,
    }
  )
  return (
    <>
      <Box
        as="span"
        data-tooltip-id="referral_rebates_referral_code"
        sx={
          myProfile?.username
            ? { borderBottom: '1px dashed', borderBottomColor: isEligibleAddReferrer ? 'primary1' : 'neutral3' }
            : {}
        }
      >
        Fee Rebates (USDT)
      </Box>
      {myProfile?.username && (
        <>
          <Tooltip id="referral_rebates_referral_code" clickable={isEligibleAddReferrer ? true : false}>
            {myProfile?.referralFromUserAddress ? (
              <Flex sx={{ gap: 1, alignItems: 'start', maxWidth: 150, color: 'green1' }}>
                <IconBox icon={<CheckCircle size={16} />} sx={{ flexShrink: 0 }} />
                <Type.Small color="neutral1" sx={{ lineHeight: '16px' }}>
                  You were referred by 
                  <Box as="span" color="neutral1">
                    {myProfile.referralFromUserAddress}
                  </Box>
                </Type.Small>
              </Flex>
            ) : (
              <>
                {isEligibleAddReferrer ? (
                  <>
                    <Flex sx={{ gap: 1, alignItems: 'start' }}>
                      <IconBox icon={<WarningOctagon size={16} />} sx={{ flexShrink: 0, color: 'primary1' }} />
                      <Type.Small color="neutral1" sx={{ lineHeight: '16px' }}>
                        <Box as="span" display="block">
                          You have no referrer
                        </Box>
                        <Box
                          as="span"
                          color="primary1"
                          sx={{ display: 'inline-block', borderBottom: 'small', borderBottomColor: 'primary1' }}
                          onClick={() => setOpenModal(true)}
                          role="button"
                        >
                          Enter now
                        </Box>
                      </Type.Small>
                    </Flex>
                  </>
                ) : (
                  <Flex sx={{ gap: 1, alignItems: 'start', maxWidth: 210 }}>
                    <IconBox icon={<Warning size={16} />} sx={{ flexShrink: 0 }} />
                    <Type.Small color="neutral1" sx={{ lineHeight: '16px' }}>
                      <Box as="span">You have no referrer</Box>
                      <Box as="span" color="neutral3" display="block">
                        If you, your F1 or F2 already have copy trading on Copin, you cannot add referrer. You will also
                        not receive fee rebate.
                      </Box>
                    </Type.Small>
                  </Flex>
                )}
              </>
            )}
          </Tooltip>
          <EditReferrerModal isOpen={openModal} onDismiss={() => setOpenModal(false)} onSuccess={refetch} />
        </>
      )}
    </>
  )
}
function EditReferrerModal({
  isOpen,
  onDismiss,
  onSuccess,
}: {
  isOpen: boolean
  onDismiss: () => void
  onSuccess: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ referralCode: string }>({
    mode: 'onChange',
    shouldFocusError: true,
  })
  const referralCode = watch('referralCode')

  const _onSuccess = () => {
    toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Add referrer successful!</Trans>} />)
    onSuccess()
    onDismiss()
  }
  const { addReferral, submitting } = useReferralActions({ onSuccess: _onSuccess })

  const _handleSubmit = () =>
    handleSubmit((formValue) => {
      addReferral.mutate(formValue.referralCode?.toUpperCase())
    })()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} width="500px" maxWidth="500px">
      <Box p={3}>
        <Flex mb={24} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
          <Type.BodyBold>Enter the code of your referrer</Type.BodyBold>
          <IconBox
            role="button"
            icon={<XCircle size={20} />}
            sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
            onClick={onDismiss}
          />
        </Flex>
        <InputReferral
          value={referralCode}
          label={'Enter Code'}
          placeholder={`Enter referral code`}
          error={errors.referralCode?.message}
          register={register}
        />
        <Type.Caption my={24} color="neutral3">
          Once you have successfully added a referrer code, you cannot change it.
        </Type.Caption>
        <Flex sx={{ gap: 3 }}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            sx={{ flex: 1 }}
            size="lg"
            variant="primary"
            type="submit"
            onClick={_handleSubmit}
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting || !referralCode}
          >
            {submitting ? <Trans>Confirming...</Trans> : <Trans>Confirm</Trans>}
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}

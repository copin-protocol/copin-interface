import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { customRefCodeApi, getMyProfileApi } from 'apis/userApis'
import actionSuccess from 'assets/images/success-img.png'
import InputReferral from 'components/@auth/InputReferral'
import { DifferentialBar } from 'components/@ui/DifferentialBar'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ToastBody from 'components/@ui/ToastBody'
import { RestrictPremiumFeature } from 'components/@widgets/SubscriptionRestrictModal'
import { useIsPremium } from 'hooks/features/subscription/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import WaveHandIcon from 'theme/Icons/WaveHandIcon'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { LINKS, MAX_REFERRAL_CODE_LENGTH, MIN_REFERRAL_CODE_LENGTH } from 'utils/config/constants'
import { ReferralTierEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'
import { referRewardImage } from 'utils/helpers/transform'

import { InviteButton } from './InviteButton'
import ReferralLinks from './ReferralLinks'
import ShareReferralLinks from './ShareReferralLinks'
import { TIER_SYSTEM } from './configs'

export default function UserReferralTier() {
  const { isAuthenticated, profile, setProfile } = useAuthContext()
  const referralCode = profile?.referralCode ?? ''
  const { refetch } = useQuery('get_user_profile_after_change_referrer', getMyProfileApi, {
    enabled: false,
    onSuccess: (data) => {
      if (!data) return
      setProfile(data)
    },
  })
  useEffect(() => {
    if (!isAuthenticated) return
    refetch()
  }, [isAuthenticated, profile?.username])
  const tierNumber = Number(profile?.referralTier?.split('_')?.[1] ?? 1)
  const nextTierNumber = tierNumber >= Object.keys(ReferralTierEnum).length ? tierNumber : tierNumber + 1
  const nextTier = `TIER_${nextTierNumber}` as unknown as ReferralTierEnum
  const currentTier = TIER_SYSTEM[profile?.referralTier ?? ReferralTierEnum.TIER_1]
  const nextTierConfig = TIER_SYSTEM[nextTier]
  const nextTierTotalFee = nextTierConfig.totalFee
  const totalFeeLast30Days = profile?.totalFeeLast30Days ?? 0
  const feeRate = Math.max((totalFeeLast30Days / nextTierTotalFee) * 100, 2)

  return (
    <Box p={3} minHeight={272}>
      {isAuthenticated ? (
        <>
          <Flex width="100%" sx={{ alignItems: 'center', gap: 2 }}>
            <ReferralTierBadge tier={tierNumber} />
            <Box flex="1">
              <Flex mb={1} sx={{ alignItems: 'center' }}>
                <LabelWithTooltip
                  id="referral_tier"
                  tooltipSx={{ textAlign: 'left', maxWidth: 200 }}
                  tooltip={
                    <Box as="span">
                      Calculated by total fee paid by F0+F1+F2 in last 30 days{' '}
                      <Box color="neutral3">(Updated at 00:00 UTC every day)</Box>
                    </Box>
                  }
                  dashed
                  sx={{
                    fontSize: '14px',
                    lineHeight: '24px',
                    fontWeight: 700,
                  }}
                >
                  MY REFERRAL TIER: #{tierNumber}{' '}
                </LabelWithTooltip>

                <Type.Caption color="neutral3" sx={{ marginLeft: 2, fontWeight: 'normal', verticalAlign: 'middle' }}>
                  (LAST 30 DAYS)
                </Type.Caption>
              </Flex>
              <Flex mb={'2px'} sx={{ width: '100%', justifyContent: 'space-between' }}>
                <LabelWithTooltip
                  id="referral_current_paid_fees"
                  tooltipSx={{ textAlign: 'left', maxWidth: 260 }}
                  tooltip={
                    <Box
                      sx={{ '& *': { fontSize: '12px', lineHeight: '16px' }, ul: { pl: 2 }, 'li span': { ml: '-4px' } }}
                    >
                      <Box as="span">Current Referral Tier #{tierNumber}:</Box>
                      <Box as="ul">
                        <Box as="li">
                          <span>F1 Commission: {currentTier.commissionF1}%</span>
                        </Box>
                        <Box as="li">
                          <span>F2 Commission: {currentTier.commissionF2}%</span>
                        </Box>
                        <Box as="li">
                          <span>Fee Rebates: {currentTier.rebateF0}%</span>
                        </Box>
                      </Box>
                    </Box>
                  }
                  dashed
                  sx={{
                    display: 'block',
                    width: 'max-content',
                    height: 20,
                    borderBottom: 'none',
                  }}
                >
                  {formatNumber(totalFeeLast30Days, 2, 2)} USDC
                </LabelWithTooltip>
                <LabelWithTooltip
                  id="referral_next_paid_fees"
                  tooltipSx={{ textAlign: 'left', maxWidth: 260 }}
                  tooltip={
                    <Box
                      sx={{ '& *': { fontSize: '12px', lineHeight: '16px' }, ul: { pl: 2 }, 'li span': { ml: '-4px' } }}
                    >
                      <Box as="span">Next Referral Tier #{nextTierNumber}:</Box>
                      <Box as="ul">
                        <Box as="li">
                          <span>F1 Commission: {nextTierConfig.commissionF1}%</span>
                        </Box>
                        <Box as="li">
                          <span>F2 Commission: {nextTierConfig.commissionF2}%</span>
                        </Box>
                        <Box as="li">
                          <span>Fee Rebates: {nextTierConfig.rebateF0}%</span>
                        </Box>
                      </Box>
                    </Box>
                  }
                  dashed
                  sx={{
                    display: 'block',
                    width: 'max-content',
                    height: 20,
                    borderBottom: 'none',
                  }}
                >
                  {formatNumber(nextTierTotalFee, 2, 2)} USDC
                </LabelWithTooltip>
              </Flex>
              <DifferentialBar
                sourceRate={feeRate}
                targetRate={100 - feeRate}
                sourceColor="linear-gradient(90deg, #A9AFFF 0%, #FFAEFF 100%)"
                targetColor={themeColors.neutral4}
              />
            </Box>
          </Flex>

          <Box mb={24} />
          <UserReferralCode
            referralCode={referralCode}
            onCustomReferralCodeSuccess={refetch}
            lastEdit={profile?.lastCustomRefCode}
          />

          <Box mb={12} />

          <ReferralLinks referralCode={referralCode} />

          {/* <Box mb={3} />
          <Box display={['none', 'none', 'none', 'block']}>
            <InviteButton />
          </Box> */}

          <Box mb={10} />
          <ShareReferralLinks referralCode={referralCode} />
          {/* <Box mb={3} />
          <EditReferrerCode myProfile={profile} onEditSuccess={refetch} /> */}
        </>
      ) : (
        <>
          <Flex mb={2} color="primary2" sx={{ alignItems: 'center', gap: 2 }}>
            <WaveHandIcon size={16} />
            <Type.Caption>Hi, Copier!</Type.Caption>
          </Flex>
          <Type.Caption mb={1} sx={{ fontWeight: 600 }}>
            To invite friends and unlock more rewards, connect your wallet now.
          </Type.Caption>
          <Type.Caption color="neutral3">
            By logging in to Copin, you agree to our{' '}
            <Box
              as="a"
              href={LINKS.termOfUse}
              target="_blank"
              color="inherit"
              sx={{ textDecoration: 'underline', '&:hover': { color: 'neutral2' } }}
            >
              Terms of Service
            </Box>
             and 
            <Box
              sx={{ textDecoration: 'underline', color: 'inherit', '&:hover': { color: 'neutral2' } }}
              as="a"
              href={LINKS.policy}
              target="_blank"
            >
              Privacy Policy
            </Box>
          </Type.Caption>
          <Box mt={3} display={['none', 'none', 'none', 'block']}>
            <InviteButton />
          </Box>
        </>
      )}
    </Box>
  )
}

function ReferralTierBadge({ tier }: { tier: string | number }) {
  return <Image src={referRewardImage(tier)} width={60} height={60} />
}

function UserReferralCode({
  referralCode,
  lastEdit,
  onCustomReferralCodeSuccess,
}: {
  referralCode: string
  lastEdit: string | undefined
  onCustomReferralCodeSuccess: () => void
}) {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Type.Body>YOUR REFERRAL CODE</Type.Body>
        {!lastEdit && (
          <Flex
            role="button"
            sx={{ alignItems: 'center', gap: 2, color: 'primary1', '&:hover': { color: 'primary2' } }}
            onClick={() => setOpenModal(true)}
          >
            <PencilSimpleLine size={16} />
            <Type.Caption>CUSTOM CODE</Type.Caption>
          </Flex>
        )}
      </Flex>
      <EditReferralCodeModal
        isOpen={openModal}
        onDismiss={() => setOpenModal(false)}
        referralCode={referralCode}
        onSuccess={onCustomReferralCodeSuccess}
      />
    </>
  )
}

// =======

function EditReferralCodeModal({
  isOpen,
  onDismiss,
  referralCode,
  onSuccess,
}: {
  isOpen: boolean
  onDismiss: () => void
  referralCode: string
  onSuccess: () => void
}) {
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<{ referralCode: string }>({
    mode: 'onChange',
    shouldFocusError: true,
  })
  const isPremiumUser = useIsPremium()
  const _referralCode = watch('referralCode')

  const { mutate, isLoading: submitting } = useMutation(customRefCodeApi, {
    onError: (error) => {
      setError('referralCode', { type: 'validate', message: getErrorMessage(error) })
    },
    onSuccess: () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Custom referral code successful!</Trans>} />
      )
      onSuccess()
      setStep(2)
    },
  })

  const _handleSubmit = () =>
    handleSubmit((formValue) => {
      mutate({ data: { referralCode: formValue.referralCode?.toUpperCase() } })
    })()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} width="500px" maxWidth="500px">
      <Box p={3}>
        {isPremiumUser ? (
          <>
            {step === 1 && (
              <>
                <Flex mb={24} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                  <Type.BodyBold>Edit your referral code</Type.BodyBold>
                  <IconBox
                    role="button"
                    icon={<XCircle size={20} />}
                    sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
                    onClick={onDismiss}
                  />
                </Flex>
                <Type.Caption mb={12}>
                  Current code:{' '}
                  <Box as="span" color="primary1">
                    {referralCode}
                  </Box>
                </Type.Caption>
                <InputReferral
                  value={_referralCode}
                  label={'Your New Referral Code'}
                  placeholder={`Your New Referral Code`}
                  register={register}
                  error={errors.referralCode?.message}
                />
                <Box
                  mt={24}
                  as="ol"
                  type="1"
                  color="neutral3"
                  sx={{
                    px: 3,
                    listStyleType: 'decimal',
                    listStylePosition: 'outside',
                    li: { fontSize: '12px', lineHeight: '24px' },
                  }}
                >
                  <li>
                    Your referral code must be between {MIN_REFERRAL_CODE_LENGTH} and {MAX_REFERRAL_CODE_LENGTH}{' '}
                    characters long and can only include letters and numbers (no special characters).
                  </li>
                  <li>You can only change your referral code once.</li>
                  <li>
                    Please do not use someone else&apos;s name as your referral code. If this rule is violated, the
                    custom referral code will be revoked.
                  </li>
                </Box>

                <Flex mt={24} sx={{ gap: 3 }}>
                  <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
                    Cancel
                  </Button>
                  <Button
                    sx={{ flex: 1 }}
                    variant="primary"
                    type="submit"
                    onClick={_handleSubmit}
                    isLoading={submitting}
                    disabled={Object.keys(errors).length > 0 || submitting || !_referralCode}
                  >
                    {submitting ? <Trans>Confirming...</Trans> : <Trans>Change Referral Code</Trans>}
                  </Button>
                </Flex>
              </>
            )}
            {step === 2 && (
              <>
                <Flex mb={24} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                  <Box />
                  <IconBox
                    role="button"
                    icon={<XCircle size={20} />}
                    sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
                    onClick={onDismiss}
                  />
                </Flex>
                <Box mx="auto" mb={3} width="max-content">
                  <ActionSuccess />
                </Box>
                <Box mb={3}>
                  <Type.Caption display="block" mb={1} color="neutral3" textAlign="center">
                    You have changed your referral code successfully
                  </Type.Caption>
                  <Type.Body display="block" textAlign="center" sx={{ fontWeight: 500 }} color="primary1">
                    {_referralCode}
                  </Type.Body>
                </Box>
                <ReferralLinks referralCode={_referralCode} />
                <Box mb={4} />
                <ShareReferralLinks referralCode={_referralCode} />
              </>
            )}
          </>
        ) : (
          <>
            <Flex mb={24} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Box />
              <IconBox
                role="button"
                icon={<XCircle size={20} />}
                sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
                onClick={onDismiss}
              />
            </Flex>
            <RestrictPremiumFeature />
          </>
        )}
      </Box>
    </Modal>
  )
}

function ActionSuccess() {
  return <Image height={200} src={actionSuccess} />
}

// function EditReferrerCode({ myProfile, onEditSuccess }: { myProfile: UserData | null; onEditSuccess: () => void }) {
//   const [openModal, setOpenModal] = useState(false)
//   const { data: isEligibleAddReferrer } = useQuery(
//     [QUERY_KEYS.GET_REFERRAL_DATA, 'eligible', myProfile?.username],
//     checkBeforeAddRefApi,
//     {
//       retry: 0,
//       enabled: !!myProfile?.username,
//     }
//   )
//   return (
//     <Flex sx={{ gap: 1 }}>
//       {myProfile?.referralFromUserAddress ? (
//         <Type.Body color="neutral2">
//           You were referred by
//           <Box as="span" color="neutral1">
//             {myProfile.referralFromUserAddress}
//           </Box>
//         </Type.Body>
//       ) : (
//         <>
//           {isEligibleAddReferrer ? (
//             <>
//               <Type.Body>You have no referrer </Type.Body>
//               <Type.Body
//                 role="button"
//                 color="primary1"
//                 sx={{
//                   '&:hover': { color: 'primary2' },
//                   borderBottom: 'small',
//                   borderBottomColor: 'primary1',
//                 }}
//                 onClick={() => setOpenModal(true)}
//               >
//                 Enter now
//               </Type.Body>
//               <EditReferrerModal isOpen={openModal} onDismiss={() => setOpenModal(false)} onSuccess={onEditSuccess} />
//             </>
//           ) : (
//             <LabelWithTooltip
//               id={uuid()}
//               dashed
//               tooltip={
//                 <Box maxWidth={250}>
//                   If you&apos;ve made a transaction or a referral, you can&apos;t add the referrer
//                 </Box>
//               }
//             >
//               <Type.Body>You have no referrer </Type.Body>
//             </LabelWithTooltip>
//           )}
//         </>
//       )}
//     </Flex>
//   )
// }
// function EditReferrerModal({
//   isOpen,
//   onDismiss,
//   onSuccess,
// }: {
//   isOpen: boolean
//   onDismiss: () => void
//   onSuccess: () => void
// }) {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<{ referralCode: string }>({
//     mode: 'onChange',
//     shouldFocusError: true,
//   })
//   const referralCode = watch('referralCode')

//   const _onSuccess = () => {
//     toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Add referrer successful!</Trans>} />)
//     onSuccess()
//     onDismiss()
//   }
//   const { addReferral, submitting } = useReferralActions({ onSuccess: _onSuccess })

//   const _handleSubmit = () =>
//     handleSubmit((formValue) => {
//       addReferral.mutate(formValue.referralCode?.toUpperCase())
//     })()

//   return (
//     <Modal isOpen={isOpen} onDismiss={onDismiss} width="500px" maxWidth="500px">
//       <Box p={3}>
//         <Flex mb={24} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
//           <Type.BodyBold>Enter the code of your referrer</Type.BodyBold>
//           <IconBox
//             role="button"
//             icon={<XCircle size={20} />}
//             sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
//             onClick={onDismiss}
//           />
//         </Flex>
//         <InputReferral
//           value={referralCode}
//           label={'Enter Code'}
//           placeholder={`Enter referral code`}
//           error={errors.referralCode?.message}
//           register={register}
//         />
//         <Type.Caption my={24} color="neutral3">
//           Once you have successfully added a referrer code, you cannot change it.
//         </Type.Caption>
//         <Flex sx={{ gap: 3 }}>
//           <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
//             Cancel
//           </Button>
//           <Button
//             sx={{ flex: 1 }}
//             size="lg"
//             variant="primary"
//             type="submit"
//             onClick={_handleSubmit}
//             isLoading={submitting}
//             disabled={Object.keys(errors).length > 0 || submitting || !referralCode}
//           >
//             {submitting ? <Trans>Confirming...</Trans> : <Trans>Confirm</Trans>}
//           </Button>
//         </Flex>
//       </Box>
//     </Modal>
//   )
// }

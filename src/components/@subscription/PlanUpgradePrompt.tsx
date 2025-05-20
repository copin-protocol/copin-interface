import { Trans } from '@lingui/macro'
import { Lock } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import useBenefitModalStore from 'hooks/features/subscription/useBenefitModalStore'
import useCheckFeature from 'hooks/features/subscription/useCheckFeature'
import { Button } from 'theme/Buttons'
import { Size, Variant } from 'theme/Buttons/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

import SubscriptionIcon from './SubscriptionIcon'
import UpgradeButton from './UpgradeButton'

const lockIcon = <IconBox icon={<Lock size={14} weight="fill" />} color="neutral3" />

export default function PlanUpgradePrompt({
  requiredPlan,
  title,
  noLoginTitle,
  requiredLogin,
  showTitleIcon,
  showNoLoginTitleIcon,
  description,
  noLoginDescription,
  confirmText = <Trans>UPGRADE</Trans>,
  confirmButtonVariant = 'primary',
  cancelText = <Trans>MAYBE LATTER</Trans>,
  cancelButtonVariant = 'outline',
  onCancel,
  showLearnMoreButton = false,
  inline = false,
  buttonsWrapperSx = {},
  buttonSize = 'xs',
  descriptionSx = {},
  titleSx = {},
  useLockIcon,
  onClickLearnMore,
  learnMoreSection,
  target,
}: {
  requiredPlan: SubscriptionPlanEnum
  title?: ReactNode
  showTitleIcon?: boolean
  requiredLogin?: boolean
  noLoginTitle?: ReactNode
  showNoLoginTitleIcon?: boolean
  description?: ReactNode
  noLoginDescription?: ReactNode
  confirmText?: ReactNode
  confirmButtonVariant?: Variant
  showLearnMoreButton?: boolean
  cancelText?: ReactNode
  cancelButtonVariant?: Variant
  onCancel?: () => void
  inline?: boolean
  buttonsWrapperSx?: any
  titleSx?: any
  descriptionSx?: any
  buttonSize?: Size
  useLockIcon?: boolean
  onClickLearnMore?: () => void
  learnMoreSection?: SubscriptionFeatureEnum
  target?: any
}) {
  const { isAuthenticated, isAvailableFeature } = useCheckFeature({ requiredPlan })
  const handleClickLogin = useClickLoginButton()
  const linkToSubscription = `${ROUTES.SUBSCRIPTION.path}?plan=${requiredPlan}`
  const _textSx: any = {
    mr: inline ? '1ch' : 0,
    display: inline ? 'inline' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5ch',
    textAlign: 'center',
  }
  const _buttonsWrapperSx: any = {
    display: inline ? 'inline' : 'flex',
    width: inline ? 'max-content' : '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
  const { setConfig } = useBenefitModalStore()

  const handleClickLearnMore = () => setConfig(learnMoreSection, requiredPlan, target)
  return (
    <>
      {requiredLogin && !isAuthenticated ? (
        <>
          <Box sx={{ position: 'relative' }}>
            {!!noLoginTitle && (
              <Type.CaptionBold sx={{ ..._textSx, ...titleSx }}>
                {showNoLoginTitleIcon && lockIcon} {noLoginTitle}
              </Type.CaptionBold>
            )}
            {!!noLoginDescription && (
              <Type.Caption
                mt={inline ? 0 : 2}
                mb={inline ? 0 : 12}
                color="neutral2"
                sx={{ ..._textSx, ...descriptionSx }}
              >
                {noLoginDescription}
              </Type.Caption>
            )}
            <Box
              mt={inline ? 0 : 1}
              sx={{
                ..._buttonsWrapperSx,
                ...buttonsWrapperSx,
              }}
            >
              <Button variant={confirmButtonVariant} onClick={handleClickLogin} size={buttonSize}>
                <Type.CaptionBold>
                  <Trans>Login</Trans>
                </Type.CaptionBold>
              </Button>
            </Box>
          </Box>
        </>
      ) : isAvailableFeature ? null : (
        <>
          <Box sx={{ position: 'relative' }}>
            {title != null && (
              <Type.CaptionBold sx={{ ..._textSx, ...titleSx }}>
                {showTitleIcon && (useLockIcon ? lockIcon : <SubscriptionIcon plan={requiredPlan} />)} {title}
              </Type.CaptionBold>
            )}
            {!!description && (
              <Type.Caption
                color="neutral2"
                mt={inline ? 0 : 2}
                mb={inline ? 0 : 12}
                sx={{ ..._textSx, ...descriptionSx }}
              >
                {description}
              </Type.Caption>
            )}
            <Box
              mt={inline ? 0 : 1}
              sx={{
                ..._buttonsWrapperSx,
                ...buttonsWrapperSx,
              }}
            >
              {showLearnMoreButton && (
                <>
                  <Button
                    variant="outline"
                    size={buttonSize}
                    mr={3}
                    onClick={onClickLearnMore ?? (learnMoreSection ? handleClickLearnMore : undefined)}
                  >
                    <Type.CaptionBold>
                      <Trans>Learn More</Trans>
                    </Type.CaptionBold>
                  </Button>
                </>
              )}
              {!!onCancel && (
                <Button onClick={onCancel} variant={cancelButtonVariant} size={buttonSize} mr={3}>
                  <Type.CaptionBold>{cancelText}</Type.CaptionBold>
                </Button>
              )}
              <Button
                variant={confirmButtonVariant}
                as={Link}
                to={linkToSubscription}
                target={target}
                size={buttonSize}
              >
                <Type.CaptionBold>{confirmText}</Type.CaptionBold>
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export function ShortUpgradePrompt({
  requiredPlan,
  description,
  wrapperSx = {},
}: {
  requiredPlan: SubscriptionPlanEnum
  description: ReactNode
  wrapperSx?: any
}) {
  return (
    <Flex sx={{ alignItems: 'center', ...wrapperSx }}>
      <UpgradeButton requiredPlan={requiredPlan} />
      <Type.Caption>{description}</Type.Caption>
    </Flex>
  )
}

export function EnterpriseUpgradePrompt({
  title,
  showTitleIcon,
  description,
  confirmText = <Trans>CONTACT US</Trans>,
  confirmButtonVariant = 'primary',
  showLearnMoreButton = false,
  inline = false,
  buttonsWrapperSx = {},
  buttonSize = 'xs',
  descriptionSx = {},
  titleSx = {},
  useLockIcon,
  onClickLearnMore,
  learnMoreSection,
}: {
  title?: ReactNode
  showTitleIcon?: boolean
  description?: ReactNode
  confirmText?: ReactNode
  confirmButtonVariant?: Variant
  showLearnMoreButton?: boolean
  inline?: boolean
  buttonsWrapperSx?: any
  titleSx?: any
  descriptionSx?: any
  buttonSize?: Size
  useLockIcon?: boolean
  onClickLearnMore?: () => void
  learnMoreSection?: SubscriptionFeatureEnum
}) {
  const _textSx: any = {
    mr: inline ? '1ch' : 0,
    display: inline ? 'inline' : 'block',
    textAlign: 'center',
  }
  const _buttonsWrapperSx: any = {
    display: inline ? 'inline' : 'flex',
    width: inline ? 'max-content' : '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
  const { setConfig } = useBenefitModalStore()

  const handleClickLearnMore = () => setConfig(learnMoreSection)
  return (
    <Box sx={{ position: 'relative' }}>
      {title != null && (
        <Type.CaptionBold sx={{ ..._textSx, ...titleSx }}>
          {showTitleIcon && (useLockIcon ? lockIcon : <SubscriptionIcon plan={SubscriptionPlanEnum.ELITE} />)} {title}
        </Type.CaptionBold>
      )}
      {!!description && (
        <Type.Caption color="neutral2" mt={inline ? 0 : 2} mb={inline ? 0 : 12} sx={{ ..._textSx, ...descriptionSx }}>
          {description}
        </Type.Caption>
      )}
      <Box
        mt={inline ? 0 : 1}
        sx={{
          ..._buttonsWrapperSx,
          ...buttonsWrapperSx,
        }}
      >
        {showLearnMoreButton && (
          <>
            <Button
              variant="outline"
              size={buttonSize}
              mr={3}
              onClick={onClickLearnMore ?? (learnMoreSection ? handleClickLearnMore : undefined)}
            >
              <Type.CaptionBold>
                <Trans>Learn More</Trans>
              </Type.CaptionBold>
            </Button>
          </>
        )}

        <a href={LINKS.support} target="_blank" rel="noreferrer">
          <Button variant={confirmButtonVariant} size={buttonSize}>
            <Type.CaptionBold>{confirmText}</Type.CaptionBold>
          </Button>
        </a>
      </Box>
    </Box>
  )
}

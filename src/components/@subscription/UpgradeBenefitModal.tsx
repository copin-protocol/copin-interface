import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode, memo } from 'react'

import useBenefitModalStore from 'hooks/features/subscription/useBenefitModalStore'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { Z_INDEX } from 'utils/config/zIndex'

import UpgradeButton from './UpgradeButton'
import { UPGRADE_BENEFIT_CONFIG } from './upgradeBenefitConfig'

export type UpgradeBenefitConfig = { title: ReactNode; description: ReactNode; imageSrc: string }

const UpgradeBenefitModal = memo(function UpgradeBenefitModal() {
  const { config, requiredPlan, setConfig } = useBenefitModalStore()
  const benefitConfig = config ? UPGRADE_BENEFIT_CONFIG[config] : undefined
  const { sm } = useResponsive()
  if (!config) return null
  return (
    <Modal
      isOpen
      width="100vw"
      maxWidth={`${benefitConfig?.modalMaxWidth ?? 660}px`}
      title={
        <Type.H5 fontSize={['16px', '24px']} lineHeight={['24px', '32px']}>
          {benefitConfig?.title}
        </Type.H5>
      }
      onDismiss={() => setConfig(null)}
      hasClose
      titleWrapperSx={{ pb: 2 }}
      background="neutral6"
      zIndex={Z_INDEX.UPGRADE_BENEFIT_MODAL + 1}
    >
      <Box sx={{ px: [3, 24], pb: [3, 24] }}>
        <Type.Caption color="neutral2" mb={3}>
          {benefitConfig?.description}
        </Type.Caption>
        <Flex sx={{ gap: 3, flexWrap: 'wrap' }} mb={3}>
          {benefitConfig?.listBenefitConfig.map((config, index) => {
            return (
              <Box
                key={index}
                sx={{ p: 2, border: 'small', borderColor: 'neutral5', borderRadius: '4px', flex: '1 1 130px' }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      backgroundImage: `url(${config.imageSrc})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                    }}
                  ></Box>
                  <Box sx={{ position: 'relative', bottom: 0, left: 0, right: 0, pt: 76 }}>
                    <Type.CaptionBold mb={2} display="block">
                      {config.title}
                    </Type.CaptionBold>
                    <Type.Caption color="neutral2">{config.description}</Type.Caption>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Flex>
        <Flex sx={{ width: '100%', justifyContent: 'end' }}>
          <UpgradeButton
            showIcon={false}
            variant="primary"
            text={<Trans>UPGRADE NOW</Trans>}
            requiredPlan={requiredPlan ? requiredPlan : undefined}
            onClick={() => setConfig(null)}
            block={sm ? undefined : true}
            target="_blank"
          />
        </Flex>
      </Box>
    </Modal>
  )
})

export default UpgradeBenefitModal

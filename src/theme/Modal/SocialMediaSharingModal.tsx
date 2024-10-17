import { FacebookLogo, TelegramLogo, TwitterLogo } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useState } from 'react'
import styled from 'styled-components/macro'

import { ImageData } from 'entities/image'
import CopyButton from 'theme/Buttons/CopyButton'
import IconButtonTheme from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import { Box, Flex, Image, Type } from 'theme/base'
import { addressShorten, generateImageUrl } from 'utils/helpers/format'

interface Props {
  link: string
  isOpen: boolean
  onDismiss: () => void
  isGeneratingLink: boolean
  image?: ImageData | null
  title?: ReactNode
}

export const FACEBOOK_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php'
export const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet'
export const TELEGRAM_SHARE_URL = 'https://telegram.me/share/'

const SocialMediaSharingModal = ({ title, link, isOpen, onDismiss, isGeneratingLink, image }: Props) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { sm } = useResponsive()
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      hasClose
      title={title ?? 'Share'}
      maxWidth="500px"
      dangerouslyBypassFocusLock
    >
      <Box p={3} pt={0}>
        {isGeneratingLink ? (
          <>
            <Loading />
            <Type.Body mt={3} display="block" textAlign="center">
              Generating link to share
            </Type.Body>
          </>
        ) : (
          <Flex flexDirection="column">
            {image && (
              <Box mb={4}>
                {loading && !error && <Box sx={{ width: '100%', aspectRatio: '1220/640' }}></Box>}
                <Box display={loading && !error ? 'none' : 'block'}>
                  <Image
                    src={image.url?.includes('blob:') ? image.url : generateImageUrl(image)}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false)
                      setError(true)
                    }}
                  />
                </Box>
              </Box>
            )}
            <SocialLinksToShare link={link} />

            <Box mb={4} />

            <CopyButton
              type="button"
              value={link}
              size="sm"
              py="2px"
              px={12}
              width="fit-content"
              mx="auto"
              sx={{ color: 'neutral1' }}
            >
              {addressShorten(link, sm ? 15 : 10)}
            </CopyButton>
          </Flex>
        )}
      </Box>
    </Modal>
  )
}

export default SocialMediaSharingModal

const IconButton = styled(IconButtonTheme)`
  ${({ theme }) => `
    background-color: ${theme.colors.neutral4};
    color: ${theme.colors.neutral1};
    &:hover:not([disabled]) {
      color: ${theme.colors.primary1};
      background-color: ${theme.colors.neutral4};
    }
  `}
`

export function SocialLinksToShare({
  link,
  iconSize = 20,
  buttonSize = 32,
  sx = {},
}: {
  link: string
  iconSize?: number
  buttonSize?: number
  sx?: any
}) {
  return (
    <Flex justifyContent="center" sx={{ gap: 32, ...sx }}>
      {/* need a quote */}
      <a href={`${FACEBOOK_SHARE_URL}?u=${encodeURIComponent(link)}&quote=`} target="_blank" rel="noreferrer">
        <IconButton variant="white" size={buttonSize} icon={<FacebookLogo size={iconSize} weight="fill" />} />
      </a>
      <a href={`${TWITTER_SHARE_URL}?url=${encodeURIComponent(link)}&text=`} target="_blank" rel="noreferrer">
        <IconButton size={buttonSize} variant="white" icon={<TwitterLogo size={iconSize} weight="fill" />} />
      </a>
      <a href={`${TELEGRAM_SHARE_URL}?url=${encodeURIComponent(link)}&text=`} target="_blank" rel="noreferrer">
        <IconButton size={buttonSize} variant="white" icon={<TelegramLogo size={iconSize} weight="fill" />} />
      </a>
    </Flex>
  )
}

import { Trans } from '@lingui/macro'
import { Image, XCircle } from '@phosphor-icons/react'
import { ForwardedRef, TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import IconButton from 'theme/Buttons/IconButton'
import { InputWrapper } from 'theme/Input'
import { Box, Flex, IconBox, Image as ImageTag, Type } from 'theme/base'
import { SxProps } from 'theme/types'

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff', 'image/bmp']

type TextareaProps = {
  block?: boolean
  error?: any
  variant?: string
  uploadImage?: boolean
  hintUploadImage?: string
  imageController?: any
  previewImage: string | null
  handleClearImage?: () => void
  autoFocus?: boolean
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const StyledTextarea = styled.textarea`
  background: transparent !important;
  padding: 0;
  border: none;
  width: 100%;
`

const RichTextarea = forwardRef(
  (
    {
      block,
      sx,
      variant,
      hintUploadImage,
      imageController,
      previewImage,
      handleClearImage,
      error,
      autoFocus,
      ...props
    }: TextareaProps & SxProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      if (autoFocus && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    return (
      <InputWrapper
        disabled={props.disabled}
        variant={variant}
        block={block}
        sx={sx}
        onClick={({ target }: { target: HTMLDivElement }) => {
          if (target?.querySelector('input')) {
            target?.querySelector('input')?.focus()
          }
        }}
      >
        {previewImage ? (
          <Flex flexDirection={'column'} width={'100%'}>
            <StyledTextarea {...props} ref={textareaRef} />
            <Box sx={{ width: '100%', height: '1px', borderBottom: '1px dashed', my: 2 }} color={'neutral4'} />
            <Box sx={{ position: 'relative', width: 'fit-content' }}>
              <ImageTag src={previewImage} alt="Preview" width={120} height={70} />
              <IconButton
                variant="filled"
                onClick={handleClearImage}
                color="neutral1"
                icon={<XCircle size={18} color="neutral1" />}
                size={18}
                sx={{ position: 'absolute', top: 0, right: 0 }}
              />
            </Box>
          </Flex>
        ) : (
          <Flex flexDirection={'column'} width={'100%'}>
            <StyledTextarea {...props} ref={textareaRef} />
            <Flex alignItems={'center'} sx={{ gap: 2 }}>
              <IconBox
                icon={<Image size={18} />}
                color="primary1"
                onClick={() => {
                  document.getElementById('images')?.click()
                }}
              />
              <input
                id="images"
                type="file"
                style={{ display: 'none' }}
                accept={SUPPORTED_FORMATS.join(',')}
                {...imageController}
              />

              {hintUploadImage && (
                <Trans>
                  <Type.Small color={'neutral3'}>{hintUploadImage}</Type.Small>
                </Trans>
              )}
            </Flex>
            {!!error && (
              <Type.Caption color="red1" mt={1} display="block">
                {error}
              </Type.Caption>
            )}
          </Flex>
        )}
      </InputWrapper>
    )
  }
)

RichTextarea.displayName = 'RichTextarea'

export default RichTextarea

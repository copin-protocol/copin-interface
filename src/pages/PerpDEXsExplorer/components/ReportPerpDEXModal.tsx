import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { reportPerpDexApi } from 'apis/perpDex'
import { reportPerpdexSchema } from 'components/@copyTrade/yupSchemas'
import ToastBody from 'components/@ui/ToastBody'
import { useToggleReportPerpDEXModal } from 'hooks/store/useToggleReportPerpDEXModal'
import RichTextarea from 'pages/PerpDEXsExplorer/components/RichTextarea'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { MAX_PERPDEX_ISSUE_DESCRIPTION } from 'utils/config/constants'
import { getErrorMessage } from 'utils/helpers/handleError'

const ZOOM_INPUT_RATIO = 1.2308 // 16/13
const SCALE_INPUT_RATIO = 0.8125 // 13/16
const MARGIN_RATIO = ((1 - SCALE_INPUT_RATIO) / SCALE_INPUT_RATIO) * 100

interface ReportPerpDEXFormData {
  perpdex: string
  description: string
  images: FileList
  telegramAccount?: string
}

const ReportPerpDEXsModal = () => {
  const { isOpen, setPerpDEX, perpdex, setIsOpen } = useToggleReportPerpDEXModal()
  const [preview, setPreview] = useState<string | null>(null)
  const mutation = useMutation(reportPerpDexApi, {
    onSuccess: async () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Send report successfully</Trans>} />)
      handleClose()
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ReportPerpDEXFormData>({
    resolver: yupResolver(reportPerpdexSchema),
  })
  const description = watch('description')

  useEffect(() => {
    if (perpdex) {
      setValue('perpdex', perpdex.perpdex)
    }
  }, [perpdex, setValue])

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleClearImage = () => {
    setPreview(null)
    reset({ ...watch(), images: undefined })
  }

  const handleClose = () => {
    setIsOpen(false)
    reset()
    setPreview(null)
    setPerpDEX(null)
  }

  const onSubmit = async (data: ReportPerpDEXFormData) => {
    try {
      const formData = new FormData()
      formData.append('perpdex', data.perpdex)
      formData.append('description', data.description)
      if (data.telegramAccount) {
        formData.append('telegramAccount', data.telegramAccount)
      }
      if (data.images) {
        formData.append('images', data.images[0])
      }

      // Call API to submit report
      await mutation.mutateAsync(formData)
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={<Trans>Flag Incorrect Data</Trans>}
      dismissable={true}
      hasClose={true}
      onDismiss={handleClose}
      maxWidth={'530px'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={[12, 24]}>
          <Trans>
            <Type.Caption color="neutral2" mb={3}>
              Please provide details about the issue you noticed. You can also attach an image and share your contact
              information if you want us to follow up
            </Type.Caption>
          </Trans>

          <Flex flexDirection={'column'} sx={{ gap: 3 }}>
            <Flex flexDirection={'column'} sx={{ gap: 2 }}>
              <Trans>
                <Flex sx={{ gap: 2 }}>
                  <Type.Caption color="neutral1" fontWeight={600}>
                    The Issue Description*
                  </Type.Caption>
                  <Type.Caption color="neutral3">{`(${
                    description?.length || 0
                  }/${MAX_PERPDEX_ISSUE_DESCRIPTION})`}</Type.Caption>
                </Flex>
              </Trans>

              <RichTextarea
                block
                rows={5}
                placeholder={`Report PerpDEX`}
                sx={{
                  textarea: {
                    fontSize: 16,
                    width: `${100 * ZOOM_INPUT_RATIO}%`,
                    height: `${100 * ZOOM_INPUT_RATIO}%`,
                    transform: `scale(${SCALE_INPUT_RATIO})`,
                    transformOrigin: '0 50%',
                    marginRight: `-${MARGIN_RATIO}%`,
                  },
                }}
                imageController={register('images', {
                  onChange: handleImageChange,
                })}
                hintUploadImage="*Only JPEG, PNG, WEBP, GIF, TIFF, BMP. Max 10mb file size"
                previewImage={preview}
                handleClearImage={handleClearImage}
                tabIndex={100}
                autoFocus={true}
                value={description}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('description', value)
                }}
              />
            </Flex>
            {!!errors?.description?.message && (
              <Type.Caption color="red1" display="block">
                {errors?.description?.message}
              </Type.Caption>
            )}
            {!!errors?.images?.message && (
              <Type.Caption color="red1" display="block">
                {errors?.images?.message}
              </Type.Caption>
            )}

            <Flex flexDirection={'column'} sx={{ gap: 2 }}>
              <Trans>
                <Type.Caption color="neutral1" fontWeight={600}>
                  Telegram Contact
                </Type.Caption>
              </Trans>
              <InputField
                placeholder={'Enter your Telegram handle (optional)'}
                block
                maxLength={200}
                autoFocus
                fontSize="13px"
                {...register('telegramAccount')}
              />
            </Flex>
          </Flex>

          <Flex justifyContent="flex-end">
            <Button
              block
              type="submit"
              width={180}
              variant="primary"
              my={3}
              isLoading={isSubmitting}
              sx={{
                backgroundColor: 'primary1',
                ':hover': { backgroundColor: 'primary2' },
                fontWeight: '600',
                fontSize: '13px',
                py: '10px',
              }}
            >
              <Trans>Send Report</Trans>
            </Button>
          </Flex>
        </Box>
      </form>
    </Modal>
  )
}

export default ReportPerpDEXsModal

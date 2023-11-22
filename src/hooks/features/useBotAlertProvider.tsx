import React, { ReactNode, createContext, useContext, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { generateLinkBotAlertApi, getBotAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import LinkBotAlertModal from 'components/Modal/LinkBotAlertModal'
import { BotAlertData } from 'entities/alert'
import useMyProfile from 'hooks/store/useMyProfile'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

export interface BotAlertContextValues {
  botAlert?: BotAlertData
  isLoading: boolean
  isGeneratingLink: boolean
  isOpenLinkBotModal: boolean
  currentState?: string
  setIsOpenLinkBotModal: (data: boolean) => void
  handleGenerateLinkBot: () => void
}

export const BotAlertContext = createContext({} as BotAlertContextValues)

export function BotAlertProvider({ children }: { children: ReactNode }) {
  const { myProfile } = useMyProfile()
  const [isOpenLinkBotModal, setIsOpenLinkBotModal] = useState(false)
  const [currentState, setCurrentState] = useState<string | undefined>()

  const { data: botAlert, isLoading } = useQuery([QUERY_KEYS.GET_BOT_ALERT, myProfile?.id], () => getBotAlertApi(), {
    enabled: !!myProfile?.id,
    retry: 0,
  })

  const { mutate: generateLinkBot, isLoading: isGeneratingLink } = useMutation(generateLinkBotAlertApi, {
    onSuccess: (state?: string) => {
      setIsOpenLinkBotModal(true)
      setCurrentState(state)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const handleGenerateLinkBot = () => {
    generateLinkBot()
  }

  const contextValue: BotAlertContextValues = {
    botAlert,
    isLoading,
    isGeneratingLink,
    isOpenLinkBotModal,
    setIsOpenLinkBotModal,
    currentState,
    handleGenerateLinkBot,
  }

  return (
    <BotAlertContext.Provider value={contextValue}>
      {children}
      {isOpenLinkBotModal && currentState && (
        <LinkBotAlertModal state={currentState} onDismiss={() => setIsOpenLinkBotModal(false)} />
      )}
    </BotAlertContext.Provider>
  )
}

const useBotAlertContext = () => useContext(BotAlertContext)
export default useBotAlertContext

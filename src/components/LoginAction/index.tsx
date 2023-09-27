// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import React, { useState } from 'react'

import { Button } from 'theme/Buttons'
import { NAVBAR_HEIGHT } from 'utils/config/constants'

import ModalLogin from './ModalLogin'
import ModalRegister from './ModalRegister'
import ModalResetPassword from './ModalResetPassword'

const LOGIN_BUTTON_ID = 'login_button__id'

const LoginAction = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [openResetModal, setOpenResetModal] = useState(false)
  const [isVerifyOTP, setIsVerifyOTP] = useState(false)

  return (
    <>
      <Button
        id={LOGIN_BUTTON_ID}
        width={120}
        variant="ghostPrimary"
        type="button"
        sx={{ height: NAVBAR_HEIGHT }}
        onClick={() => setOpenLoginModal(true)}
      >
        <Trans>Login</Trans>
      </Button>
      {openLoginModal && (
        <ModalLogin
          setIsVerifyOTP={setIsVerifyOTP}
          switchRegisterModal={() => setOpenRegisterModal(true)}
          switchResetModal={() => setOpenResetModal(true)}
          onDismiss={() => setOpenLoginModal(false)}
        />
      )}
      {openRegisterModal && (
        <ModalRegister
          isVerifyOTP={isVerifyOTP}
          setIsVerifyOTP={setIsVerifyOTP}
          onDismiss={() => setOpenRegisterModal(false)}
        />
      )}
      {openResetModal && <ModalResetPassword onDismiss={() => setOpenResetModal(false)} />}
    </>
  )
}

export default LoginAction

export function useClickLoginButton() {
  const handleClickLogin = () => {
    const loginButton = document.getElementById(LOGIN_BUTTON_ID)
    if (!loginButton) return
    loginButton.click()
  }
  return handleClickLogin
}

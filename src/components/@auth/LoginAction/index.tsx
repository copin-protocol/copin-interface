import ConnectButton from './ConnectButton'

const LOGIN_BUTTON_ID = 'login_button__id'

const LoginAction = () => {
  return (
    <>
      <ConnectButton id={LOGIN_BUTTON_ID} px={3} />
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

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  email?: string
  password?: string
  otp?: string
  referralCode?: string
}

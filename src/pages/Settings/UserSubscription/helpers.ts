export const getRemainingDays = (expiredTime?: string) => {
  if (!expiredTime) return 0

  const now = new Date()
  const expiry = new Date(expiredTime)
  const diffTime = Math.max(0, expiry.getTime() - now.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

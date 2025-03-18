export const isIphone =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 430px) and (max-height: 932px)').matches &&
  /iPhone|iPod/.test(navigator.userAgent)

const useIsIphone = (): boolean => {
  return isIphone
}

export default useIsIphone

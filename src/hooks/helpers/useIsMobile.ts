export const isMobile = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)

const useIsMobile = () => {
  return isMobile
}

export default useIsMobile

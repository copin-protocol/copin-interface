import { useResponsive } from 'ahooks'
import ContentLoader from 'react-content-loader'
import styled from 'styled-components/macro'

import { Box } from 'theme/base'

const Loading = styled(Box)<{ size?: number }>`
  border: 2px solid ${({ theme }) => theme.colors.neutral6};
  border-top: 2px solid ${({ theme }) => theme.colors.primary1};
  border-radius: 50%;
  width: ${({ size }) => size ?? 24}px;
  height: ${({ size }) => size ?? 24}px;
  animation: spin 1s linear infinite;
  margin: 10px auto;
`

export const CoverPhotoLoading = () => {
  const { md } = useResponsive()
  const size = md ? 200 : 150
  return (
    <ContentLoader speed={2} viewBox={`0 0 ${size} ${size}`}>
      <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
    </ContentLoader>
  )
}

export default Loading

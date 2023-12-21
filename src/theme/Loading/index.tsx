import { useResponsive } from 'ahooks'
import ContentLoader from 'react-content-loader'
import styled from 'styled-components/macro'

import { Box } from 'theme/base'
import { Colors } from 'theme/types'

const Loading = styled(Box)<{ size?: number; background?: keyof Colors; indicatorColor?: keyof Colors }>`
  border: 2px solid
    ${({ theme, background }) => (background ? (theme.colors[background] as any) : theme.colors.neutral6)};
  border-top: 2px solid
    ${({ theme, indicatorColor }) => (indicatorColor ? (theme.colors[indicatorColor] as any) : theme.colors.primary1)};
  border-radius: 50%;
  width: ${({ size }) => size ?? 24}px;
  height: ${({ size }) => size ?? 24}px;
  animation: spin 1s linear infinite;
  margin: 10px auto;
`

export const LineLoading = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary1};
  transform: scaleX(0);
  transform-origin: center left;
  animation: cubic-bezier(0.85, 0, 0.15, 1) 2s infinite line-horizontal-animation;
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

import { createGlobalStyle } from 'styled-components/macro'

import { Box } from 'theme/base'

const GlobalStyle = createGlobalStyle`
  @keyframes live_data_icon_ani {
    0% {
      opacity: 0;
      transform: scale(0.1, 0.1);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1.2, 1.2);
    }
  }
`

export default function LiveDataIcon({ size = 16, disabled = false }: { size?: number; disabled?: boolean }) {
  return (
    <Box width={`${size}px`} height={`${size}px`} sx={{ position: 'relative' }}>
      <GlobalStyle />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: 'normal',
          borderColor: 'green2',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          opacity: 0,
          animation: disabled
            ? 'none'
            : '1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite normal none running live_data_icon_ani',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: `${size / 4}px`,
          left: `${size / 4}px`,
          bg: disabled ? 'neutral3' : 'green2',
          width: `${size / 2}px`,
          height: `${size / 2}px`,
          borderRadius: '50%',
        }}
      />
    </Box>
  )
}

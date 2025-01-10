import css from '@styled-system/css'
import styled from 'styled-components/macro'

import { Box } from 'theme/base'
import { sx } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'

export const BottomWrapperMobile = styled(Box)(
  css({
    display: ['flex', 'flex', 'none'],
    height: 40,
    bg: 'neutral8',
    width: '100%',
    alignItems: 'center',
    borderTop: 'small',
    borderTopColor: 'neutral4',
    '& .tab-header': {
      width: '100%',
    },
    '& .tab-header > *': {
      width: '100%',
    },
  }),
  sx
)

export const TopWrapperMobile = styled(Box)(
  css({
    display: ['flex', 'flex', 'none'],
    height: PAGE_TITLE_HEIGHT,
    bg: 'neutral8',
    width: '100%',
    alignItems: 'center',
    px: 3,
    borderBottom: 'small',
    borderBottomColor: 'neutral4',
  }),
  sx
)

export const BodyWrapperMobile = styled(Box)(
  css({
    pb: 40,
    width: '100%',
    height: '100%',
  }),
  sx
)

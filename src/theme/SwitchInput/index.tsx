import styled from 'styled-components/macro'

import useToggleInput from 'hooks/helpers/useToggleInput'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'

interface StyledSwitchProps {
  active?: boolean
  disabled?: boolean
}

const WIDTH = 28
const HEIGHT = 16
const GAP = 2

const StyledSwitch = styled.div<StyledSwitchProps>`
  display: flex;
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${HEIGHT}px;
    border-radius: ${HEIGHT}px;
    transition: all 160ms ease-out;
    background: ${(props) => (props.active ? props.theme.colors.primary1 : props.theme.colors.neutral3)};
  }
  &:after {
    content: '';
    position: absolute;
    top: ${GAP}px;
    left: ${(props) => (props.active ? WIDTH - HEIGHT + GAP : GAP)}px;
    width: ${HEIGHT - 2 * GAP}px;
    height: ${HEIGHT - 2 * GAP}px;
    border-radius: ${HEIGHT}px;
    transition: all 160ms ease-in;
    background: ${(props) => (props.disabled ? props.theme.colors.neutral5 : props.theme.colors.white)};
  }
`
interface SwitchInputProps {
  defaultActive?: boolean
  disabled?: boolean
  isManual?: boolean
  isActive?: boolean
  onChange?: (value: boolean) => void
  onClick?: () => void
  isLoading?: boolean
}

const SwitchInput = ({
  defaultActive = true,
  disabled,
  onChange,
  isActive,
  isManual = false,
  isLoading,
}: SwitchInputProps) => {
  const { active, toggleActive } = useToggleInput({ defaultActive, onChange, isManual })
  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <StyledSwitch disabled={disabled} onClick={() => !disabled && toggleActive(!isActive)} active={active} />
      {isLoading && (
        <Box sx={{ position: 'absolute', top: '-7px', ...(active ? { right: '3px' } : { left: '3px' }) }}>
          <Loading size={14} />
        </Box>
      )}
    </Box>
  )
}

export default SwitchInput

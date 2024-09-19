import { ChainWithLabel } from 'components/@ui/ChainLogo'
import { Box } from 'theme/base'

// Adjust the import based on your project structure

// Define the props interface
interface ChainOptionBoxProps {
  index: number
  chainOption: {
    chainIdNumber: number
    label: string
    icon: string
  }
  selectedChainId: number
  setSelectedChainId: (chainId: number) => void
  protocolCount: number
}

const ChainOptionBox: React.FC<ChainOptionBoxProps> = ({
  index,
  chainOption,
  selectedChainId,
  setSelectedChainId,
  protocolCount,
}) => {
  return (
    <Box
      key={index}
      px={2}
      py={10}
      sx={{
        backgroundColor: selectedChainId === chainOption.chainIdNumber ? 'neutral5' : 'neutral6',
        borderRadius: 'sm',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'neutral5',
        },
      }}
      onClick={() => setSelectedChainId(chainOption.chainIdNumber)}
    >
      <ChainWithLabel label={`${chainOption.label} (${protocolCount})`} icon={chainOption.icon} />
    </Box>
  )
}

export default ChainOptionBox

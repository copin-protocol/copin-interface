import { Flex } from 'theme/base'
import { generateAvatar } from 'utils/helpers/generateAvatar'

const AddressAvatar = ({ address, size = 48 }: { address: string; size?: number }) => {
  if (!address) return <></>
  // const [isError, setIsError] = useState(false)
  // const text = address.slice(2, address.length).match(/.{1,6}/g) ?? [
  //   '000000',
  //   '000000',
  //   '000000',
  //   '000000',
  //   '000000',
  //   '000000',
  //   '000000',
  //   '0000',
  // ]

  const { emoji, gradient } = generateAvatar(address)

  return (
    <Flex
      width={size}
      height={size}
      fontSize={size * 0.65}
      sx={{
        borderRadius: size / 2,
        overflow: 'hidden',
        background: gradient,
        flexShrink: 0,
      }}
      alignItems="center"
      justifyContent="center"
    >
      {emoji}
      {/* <Avatar
        size={size}
        name={`${text[6]} ${text[5]}`}
        colors={[`#${text[2]}`, `#${text[3]}`, `#${text[2]}`, `#${text[1]}`, `#${text[0]}`]}
        variant="beam"
      /> */}
    </Flex>
  )
}

export default AddressAvatar

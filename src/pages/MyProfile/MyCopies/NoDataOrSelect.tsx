import noSelectCopies from 'assets/images/select-copies.svg'
import noSelectTraders from 'assets/images/select-traders.svg'
import noTraders from 'assets/images/traders-empty.svg'
import { Flex, Image, Type } from 'theme/base'

type ComponentTypes = 'noTraders' | 'noSelectTraders' | 'noSelectCopies'
const configs: { [key in ComponentTypes]: { title: string; content: string; image: string } } = {
  noTraders: {
    title: 'This trader list is empty',
    content: 'Once you starts copy a new trader, you’ll see the trader listed here',
    image: noTraders,
  },
  noSelectTraders: {
    title: 'Please pick trader to view copies detail',
    content: "Find the trader you want in the list of traders, all of the trader's copy settings will be listed here.",
    image: noSelectTraders,
  },
  noSelectCopies: {
    title: 'Please pick copies setting to view positions',
    content: 'To view positions, you can choose from a variety of copy settings',
    image: noSelectCopies,
  },
}

export default function NoDataOrSelect({
  type,
  actionButton,
}: {
  type: ComponentTypes
  actionButton?: JSX.Element | null
}) {
  const config = configs[type]
  return (
    <Flex
      sx={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <Image src={config.image} sx={{ height: 88 }} />
      <Type.CaptionBold mt={20} mb={1}>
        {config.title}
      </Type.CaptionBold>
      <Type.Caption>{config.content}</Type.Caption>
      {actionButton}
    </Flex>
  )
}

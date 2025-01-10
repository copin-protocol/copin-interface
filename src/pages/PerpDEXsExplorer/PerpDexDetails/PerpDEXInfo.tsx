// import { useState } from 'react'
// import { Link } from 'react-router-dom'
import PerpDexLogo from 'components/@ui/PerpDexLogo'
import IconGroup from 'components/@widgets/IconGroup'
import Icon from 'components/@widgets/IconGroup/Icon'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
// import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
// import { ProtocolEnum } from 'utils/config/enums'
// import { generatePerpDEXDetailsRoute } from 'utils/helpers/generateRoute'
import { parseChainImage, parsePlainProtocolImage } from 'utils/helpers/transform'

import { ReportPerpDEXFlag } from '../components/ReportPerpDEX'
import SocialLinkItems from '../components/SocialLinkItems'

// type Option = {
//   perpdex: string
//   protocol: ProtocolEnum | undefined
//   name: string
//   chain: string | undefined
//   chains: string[] | undefined
// }

export default function PerpDEXInfo({
  perpdexData,
  protocolData,
}: {
  perpdexData: PerpDEXSourceResponse | undefined
  protocolData: any
}) {
  // const options = useMemo(() => {
  //   const result =
  //     perpdexData?.protocolInfos?.map((v) => {
  //       const option: Option = {
  //         perpdex: perpdexData.perpdex,
  //         protocol: v.protocol,
  //         chain: v.chain,
  //         name: v.name,
  //         chains: undefined,
  //       }
  //       return option
  //     }) ?? ([] as Option[])
  //   const perpdexOption: Option = {
  //     perpdex: perpdexData?.perpdex ?? '',
  //     protocol: undefined,
  //     name: perpdexData?.name ?? '',
  //     chain: undefined,
  //     chains: perpdexData?.chains ?? undefined,
  //   }
  //   result.unshift(perpdexOption)
  //   return result
  // }, [perpdexData])

  if (!perpdexData) return null

  return (
    <Flex sx={{ alignItems: 'center', width: '100%' }}>
      {protocolData ? (
        <Icon iconName={protocolData.protocol} iconUriFactory={parsePlainProtocolImage} size={40} />
      ) : (
        <PerpDexLogo perpDex={perpdexData.perpdex} size={40} />
      )}
      <Box ml={2}>
        <Flex sx={{ alignItems: 'center', gap: 0 }} mb={1}>
          <Type.BodyBold mr="6px" sx={{ textTransform: 'uppercase' }}>
            {protocolData ? protocolData.name : perpdexData.name}
          </Type.BodyBold>
          {protocolData ? (
            <Icon iconName={protocolData.chain} iconUriFactory={parseChainImage} size={16} />
          ) : (
            <IconGroup iconNames={perpdexData.chains ?? []} iconUriFactory={parseChainImage} size={16} />
          )}
          {/* {!!perpdexData.protocolInfos && <ProtocolSelect options={options} protocol={protocolData?.protocol} />} */}
          <ReportPerpDEXFlag data={perpdexData} />
        </Flex>
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <SocialLinkItems data={protocolData || perpdexData} />
        </Flex>
      </Box>
    </Flex>
  )
}

// function ProtocolSelect({ options, protocol }: { options: Option[]; protocol: ProtocolEnum | undefined }) {
//   const [visible, setVisible] = useState(false)
//   return (
//     <Dropdown
//       visible={visible}
//       setVisible={setVisible}
//       menuDismissible
//       dismissible={false}
//       menuSx={{ width: 150 }}
//       buttonSx={{
//         p: '2px',
//         '& *': { p: 0, m: 0 },
//         borderRadius: '2px',
//         border: 'none',
//         '&:hover': { bg: 'neutral4' },
//       }}
//       menu={<ProtocolSelection options={options} onClickSelection={() => setVisible(false)} protocol={protocol} />}
//       iconSize={16}
//     >
//       {null}
//     </Dropdown>
//   )
// }

// function ProtocolSelection({
//   options,
//   onClickSelection,
//   protocol,
// }: {
//   options: Option[]
//   onClickSelection: () => void
//   protocol: ProtocolEnum | undefined
// }) {
//   return (
//     <Box>
//       {options.map((option) => {
//         const isActive = option.protocol === protocol || (!protocol && !option.protocol)
//         return (
//           <Flex
//             key={`${option.perpdex}${option.protocol}`}
//             as={Link}
//             to={generatePerpDEXDetailsRoute({
//               perpdex: option.perpdex?.toLowerCase(),
//               params: { protocol: option.protocol?.toLowerCase() },
//             })}
//             onClick={onClickSelection}
//             sx={{
//               px: 2,
//               width: '100%',
//               height: '36px',
//               alignItems: 'center',
//               gap: 1,
//               '&:hover': { bg: 'neutral5' },
//               bg: isActive ? 'neutral5' : 'transparent',
//             }}
//           >
//             {!!option.protocol && (
//               <Icon iconName={option.protocol} iconUriFactory={parsePlainProtocolImage} size={24} hasBorder={false} />
//             )}
//             {!option.protocol && !!option.perpdex && <PerpDexLogo perpDex={option.perpdex} size={24} />}

//             <Type.Caption color="neutral1" flexShrink={0}>
//               {option.name}
//             </Type.Caption>
//             {!!option.chain && <Icon iconName={option.chain} iconUriFactory={parseChainImage} size={16} />}
//             {!!option.chains?.length && (
//               <IconGroup iconNames={option.chains ?? []} iconUriFactory={parseChainImage} size={16} />
//             )}
//           </Flex>
//         )
//       })}
//     </Box>
//   )
// }

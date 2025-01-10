import CopierRanking1 from 'assets/icons/copier-rank-1.svg'
import CopierRanking2 from 'assets/icons/copier-rank-2.svg'
import CopierRanking3 from 'assets/icons/copier-rank-3.svg'
import IconRanking1 from 'assets/icons/ic-rank-1.png'
import IconRanking2 from 'assets/icons/ic-rank-2.png'
import IconRanking3 from 'assets/icons/ic-rank-3.png'
import { Image, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function LeaderboardRankingNumber({ ranking }: { ranking: number | undefined }) {
  if (ranking == null) return <>--</>
  switch (ranking) {
    case 1:
      return <Image src={IconRanking1} width={34} height={48} />
    case 2:
      return <Image src={IconRanking2} width={34} height={48} />
    case 3:
      return <Image src={IconRanking3} width={34} height={48} />
    default:
      return <Type.CaptionBold color="neutral3">#{formatNumber(ranking, 0)}</Type.CaptionBold>
  }
}

export function CopierRankingNumber({ ranking }: { ranking: number | undefined }) {
  if (ranking == null) return <>--</>
  switch (ranking) {
    case 1:
      return <Image src={CopierRanking1} width={54} height={44} />
    case 2:
      return <Image src={CopierRanking2} width={54} height={44} />
    case 3:
      return <Image src={CopierRanking3} width={54} height={44} />
    default:
      return (
        <Type.Caption color="neutral3" width={54} textAlign="center">
          #{formatNumber(ranking, 0)}
        </Type.Caption>
      )
  }
}

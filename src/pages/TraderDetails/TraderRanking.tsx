import React from 'react'

import { TraderData } from 'entities/trader'
import { Type } from 'theme/base'

import ScoreChart from './ScoreChart'

const TraderRanking = ({ data }: { data: TraderData }) => {
  if (!data.ranking) return <div></div>
  const avgScore =
    (data.ranking.avgRoi +
      data.ranking.profitRate +
      data.ranking.winRate +
      data.ranking.maxDrawDownRoi +
      data.ranking.totalTrade +
      data.ranking.avgDuration) /
    6
  const ranking = [
    {
      subject: 'Avg ROI',
      value: data.ranking.avgRoi,
      fullMark: 100,
    },

    {
      subject: 'Profit Rate',
      value: data.ranking.profitRate,
      fullMark: 100,
    },
    {
      subject: 'Win Rate',
      value: data.ranking.winRate,
      fullMark: 100,
    },

    {
      subject: 'Risk Control',
      value: data.ranking.maxDrawDownRoi,
      fullMark: 100,
    },
    {
      subject: 'Frequency',
      value: data.ranking.totalTrade,
      fullMark: 100,
    },
    {
      subject: 'Quickly Settled',
      value: data.ranking.avgDuration,
      fullMark: 100,
    },
  ]
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: 24,
      }}
    >
      <ScoreChart data={ranking} width={350} height={236} />
      <Type.CaptionBold
        sx={{
          position: 'absolute',
          width: '100%',
          top: 8,
        }}
        color="neutral1"
        textAlign="center"
      >
        Better than {avgScore.toFixed(0)}% traders in 60 days
      </Type.CaptionBold>
    </div>
  )
}

export default TraderRanking

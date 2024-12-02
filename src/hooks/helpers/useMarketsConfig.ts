import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'

export default function useMarketsConfig() {
  return useSystemConfigContext((c) => c.marketConfigs)
}

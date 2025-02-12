import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'

export default function useMarketsConfig() {
  return useSystemConfigStore((c) => c.marketConfigs ?? {})
}

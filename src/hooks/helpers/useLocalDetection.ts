import axios from 'axios'
import { useQuery } from 'react-query'

interface LocalDetectionResult {
  isVN: boolean | null
  countryCode: string | null | undefined
  countryName: string | null | undefined
  isLoading: boolean
  error: string | null
}

export const useLocalDetection = (): LocalDetectionResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['location'],
    queryFn: () => axios.get('https://ipwhois.app/json/').then((res) => res.data),
    staleTime: Infinity, // Location rarely changes
    retry: 2,
  })

  return {
    isVN: data ? data.country_code === 'VN' : null,
    countryCode: data?.country_code,
    countryName: data?.country,
    isLoading,
    error: error ? 'Failed to detect location' : null,
  }
}

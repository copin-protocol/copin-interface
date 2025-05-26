import axios from 'axios'
import { useQuery } from 'react-query'

interface LocalDetectionResult {
  isVN: boolean | null
  countryCode: string | null
  countryName: string | null
  isLoading: boolean
  error: string | null
}

export const useLocalDetection = (): LocalDetectionResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['location'],
    queryFn: () => axios.get('https://freeipapi.com/api/json'),
    staleTime: Infinity, // Location rarely changes
    retry: 2,
  })

  return {
    isVN: data ? data.data.countryCode === 'VN' : null,
    countryCode: data?.data.countryCode,
    countryName: data?.data.countryName,
    isLoading,
    error: error ? 'Failed to detect location' : null,
  }
}

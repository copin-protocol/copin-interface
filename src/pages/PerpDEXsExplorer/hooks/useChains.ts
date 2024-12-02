import useSearchParams from 'hooks/router/useSearchParams'

export function useChains() {
  const { searchParams, setSearchParams } = useSearchParams()
  const storedChains = localStorage.getItem('perp_dex_chain')?.split('_')
  const paramChains = (searchParams['chains'] as string | undefined)?.split('_')
  const chains = paramChains ?? storedChains
  const changeChains = (chains: string[] | undefined) => {
    if (chains?.length) {
      localStorage.setItem('perp_dex_chain', chains.join('_'))
    } else {
      localStorage.removeItem('perp_dex_chain')
    }
    setSearchParams({ ['chains']: chains?.join('_') })
  }
  return { chains, changeChains, searchParams, setSearchParams }
}

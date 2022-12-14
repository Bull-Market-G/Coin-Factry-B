import { abi as ICoreDexPairABI } from '@core-dex/core/build/ICoreDexPair.json'
import { abi as ICoreDexRouter02ABI } from '@core-dex/periphery/build/ICoreDexRouter02.json'
import { Contract } from '@ethersproject/contracts'
import CORE_COIN_ABI from 'abis/core-erc20.json'
import EIP_2612 from 'abis/eip_2612.json'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import { CoreErc20, EnsPublicResolver, Erc20, Weth } from 'abis/types'
import WETH_ABI from 'abis/weth.json'
import { MULTICALL_NETWORKS, ROUTER_ADDRESS } from 'constants/addresses'
import MULTICALL_ABI from 'constants/multicall/abi.json'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useMemo } from 'react'

import { getContract } from '../utils'
import { useActiveWeb3React } from './web3'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useCoreCoinContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<CoreErc20>(tokenAddress, CORE_COIN_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const { chainId } = useActiveWeb3React()
  return useContract<Weth>(
    chainId ? WRAPPED_NATIVE_CURRENCY[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, ICoreDexPairABI, withSignerIfPossible)
}

export function useRouterContract(): Contract | null {
  return useContract(ROUTER_ADDRESS, ICoreDexRouter02ABI, true)
}

export function useMulticallContract(): Contract | null {
  return useContract(MULTICALL_NETWORKS, MULTICALL_ABI, false)
}

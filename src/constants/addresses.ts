import { FACTORY_ADDRESS } from '@core-dex/sdk'
import { constructSameAddressMap } from 'utils/constructSameAddressMap'

import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const MULTICALL_NETWORKS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  [SupportedChainId.MUMBAI]: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
}

export const FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(FACTORY_ADDRESS, [
  SupportedChainId.MUMBAI,
  SupportedChainId.POLYGON,
])
export const ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0x3584B983Ac30FBdf9Fe21795BBff5e94F66f64C7', [
  SupportedChainId.POLYGON,
  SupportedChainId.MUMBAI,
])

export const POOL_HIDE: string[] = []
export const TOKEN_HIDE: string[] = []

// hide from overview list
export const TOKEN_BLACKLIST = []

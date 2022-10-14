/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAIN = 1,

  POLYGON = 137,
  MUMBAI = 80001,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAIN]: 'ethereum',
  [SupportedChainId.POLYGON]: 'polygon',
  [SupportedChainId.MUMBAI]: 'mumbai',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.POLYGON]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [SupportedChainId.POLYGON, SupportedChainId.MUMBAI] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

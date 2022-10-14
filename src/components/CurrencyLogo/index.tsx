import { SupportedChainId } from 'constants/chains'

type Network = 'polygon'

function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    case SupportedChainId.POLYGON:
      return 'polygon'
    default:
      return 'polygon'
  }
}

export const getTokenLogoURL = (
  address: string,
  chainId: SupportedChainId = SupportedChainId.POLYGON
): string | void => {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [SupportedChainId.POLYGON]
  if (networksWithUrls.includes(chainId)) {
    //if (address == CORE_COIN) {
    //  return `https://raw.githubusercontent.com/CORE-DEX/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
    //} else {}
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }
}

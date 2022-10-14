import { Web3Provider } from '@ethersproject/providers'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import COREDEX_LOGO_URL from 'assets/svg/logo.svg'
import { ALCHEMY_NETWORK_URLS } from 'constants/chainInfo'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import getLibrary from 'utils/getLibrary'

import { NetworkConnector } from './NetworkConnector'

const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

export const network = new NetworkConnector({
  urls: ALCHEMY_NETWORK_URLS,
  defaultChainId: 137,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const gnosisSafe = new SafeAppConnector()

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: ALCHEMY_NETWORK_URLS,
  qrcode: true,
})

export const walletlink = new WalletLinkConnector({
  url: ALCHEMY_NETWORK_URLS[SupportedChainId.POLYGON],
  appName: 'CORE DEX',
  appLogoUrl: COREDEX_LOGO_URL,
  supportedChainIds: [SupportedChainId.POLYGON],
})

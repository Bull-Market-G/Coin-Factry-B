import 'inter-ui'
import '@reach/dialog/styles.css'

import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import store from 'state'
import getLibrary from 'utils/getLibrary'

import { NetworkContextName } from './constants/misc'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import TransactionUpdater from './state/transactions/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <FixedGlobalStyle />
      <HashRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Updaters />
            <ThemeProvider>
              <ThemedGlobalStyle />
              <App />
            </ThemeProvider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register()
}

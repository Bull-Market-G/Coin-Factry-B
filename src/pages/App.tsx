import Header from 'components/Header'
import Polling from 'components/Header/Polling'
import Popups from 'components/Popups'
import Web3ReactManager from 'components/Web3ReactManager'
import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import Aave from './Aave'
import Ape from './Ape'
import Decentraland from './Decentraland'
import Direction from './Direction'
import Home from './Home'
import Maker from './Maker'
import Shibainu from './Shibainu'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow-x: hidden;
  min-height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
  position: fixed;
  justify-content: space-between;
  z-index: 2;
`

const BodyWrapper = styled.div<{ warningActive?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 25px;
  margin-top: ${({ warningActive }) => (warningActive ? '113px' : '73px')};
  align-items: center;
  flex: 1;
  overflow-y: auto;
  z-index: 1;

  @media (max-width: 1080px) {
    padding-top: 2rem;
    margin-top: 150px;
  }
`

const Marginer = styled.div`
  width: 100%;
  height: 35px;
`

// const Hide1080 = styled.div`
//   @media (max-width: 1080px) {
//     display: none;
//   }
// `

const Show1080 = styled.div`
  @media (max-width: 1080px) {
    display: flex;
  }
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <Web3ReactManager>
        <AppWrapper>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>

          <BodyWrapper>
            <Popups />
            <Polling />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/direction" component={Direction} />
              <Route exact path="/ape" component={Ape} />
              <Route exact path="/decentraland" component={Decentraland} />
              <Route exact path="/aave" component={Aave} />
              <Route exact path="/maker" component={Maker} />
              <Route exact path="/shibainu" component={Shibainu} />
            </Switch>
            <Show1080>
              <Marginer />
            </Show1080>
          </BodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </Suspense>
  )
}

import HeaderImg from 'assets/images/header.png'
import HeaderBorderImg from 'assets/images/header_border.png'
import HeaderLargeImg from 'assets/images/header_large.png'
import LogoDark from 'assets/svg/logo_white.svg'
import { darken } from 'polished'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { AutoColumn } from '../Column'
//import Menu from '../Menu'
import Row, { RowBetween, RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import NetworkDropdown from './NetworkDropdown'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 540px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  background-color: ${({ theme }) => theme.bg0};
  background-image: ${`url(${HeaderImg})`};

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    width: calc(100%);
    position: relative;
    background-image: ${`url(${HeaderLargeImg})`};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  @media (max-width: 1080px) {
    display: none;
  }
`

const HeaderRow = styled(RowFixed)`
  @media (max-width: 1080px) {
    width: 100%;
  }

  @media (max-width: 420px) {
    justify-content: start;
  }
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  font-size: 1rem;

  @media (max-width: 1080px) {
    padding: 0.5rem;
    justify-content: flex-end;
    font-size: 1rem;
  }
`

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 20px;
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
`

const CoreDexIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  width: fit-content;
  margin: 0 6px;
  padding: 8px 12px 0 12px;
  font-weight: 500;

  @media (max-width: 550px) {
    margin: 0 3px;
    padding: 8px 6px;
  }

  @media (max-width: 450px) {
    margin: 0 8px;
  }

  &.${activeClassName} {
    border: 10px solid;
    border-image-source: ${`url(${HeaderBorderImg})`};
    border-image-slice: 0 0 100%;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const SmallContentSearch = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 1080px) {
    display: initial;
  }
`

const Spacer = styled.div`
  width: 30px;
`

// function windowState(value: boolean[], innerWidth: number, width: number): boolean {
//   if (innerWidth <= width) {
//     return value[0]
//   } else {
//     return value[1]
//   }
// }

export default function Header() {
  return (
    <HeaderFrame>
      <HeaderRow>
        <Title to={'/'}>
          <CoreDexIcon>
            <img width={'45px'} src={LogoDark} alt="logo" />
          </CoreDexIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`corecoin-nav-link`} to={'/'} isActive={(match, { pathname }) => pathname === '/'}>
            CORE
          </StyledNavLink>
          <StyledNavLink id={`direction-nav-link`} to={'/direction'}>
            Direction
          </StyledNavLink>
          <StyledNavLink id={`ape-nav-link`} to={'/ape'}>
            Ape
          </StyledNavLink>
          <StyledNavLink id={`decentraland-nav-link`} to={'/decentraland'}>
            Decentraland
          </StyledNavLink>
          <StyledNavLink id={`aave-nav-link`} to={'/aave'}>
            Aave
          </StyledNavLink>
          <StyledNavLink id={`maker-nav-link`} to={'/maker'}>
            Maker
          </StyledNavLink>
          <StyledNavLink id={`shibainu-nav-link`} to={'/shibainu'}>
            ShibaInu
          </StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <NetworkDropdown />
        <Web3Status />
        <Spacer />
        {/* <Menu /> */}
      </HeaderControls>
      <SmallContentSearch>
        <AutoColumn gap="sm">
          <RowBetween>
            <NetworkDropdown />
            <Web3Status />
            {/* <Menu /> */}
          </RowBetween>
        </AutoColumn>
      </SmallContentSearch>
    </HeaderFrame>
  )
}

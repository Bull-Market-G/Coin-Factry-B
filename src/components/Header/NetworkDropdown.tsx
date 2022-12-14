import { CHAIN_INFO } from 'constants/chainInfo'
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useParsedQueryString from 'hooks/useParsedQueryString'
import usePrevious from 'hooks/usePrevious'
import { useActiveWeb3React } from 'hooks/web3'
import { ParsedQs } from 'qs'
import React, { useCallback, useEffect, useRef } from 'react'
import { ArrowDownCircle, ChevronDown } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import { addPopup, ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { useAppDispatch } from 'state/hooks'
import styled from 'styled-components'
import { replaceURLParam } from 'utils/routes'
import { switchToNetwork } from 'utils/switchToNetwork'

import { ExternalLink } from '../../theme'

const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`

const FlyoutMenu = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg0};
  border: ${({ theme }) => `2px solid ${theme.border1}`};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  position: absolute;
  top: 64px;
  width: 230px;
  z-index: 99;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
  @media screen and (min-width: 720px) {
    top: 50px;
  }
`

const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.bg1 : 'transparent')};
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
`

const FlyoutRowActiveIndicator = styled.div`
  background-color: ${({ theme }) => theme.green1};
  height: 9px;
  width: 9px;
`

const LinkOutCircle = styled(ArrowDownCircle)`
  transform: rotate(230deg);
  width: 16px;
  height: 16px;
`

const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`

const NetworkLabel = styled.div`
  flex: 1 1 auto;
`

const NetworkRow = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  cursor: pointer;
  padding: 8px;
  width: 100%;
`

const NetworkRowLinkList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  & > a {
    align-items: center;
    color: ${({ theme }) => theme.text2};
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 500;
    justify-content: space-between;
    padding: 8px 0 4px;
    text-decoration: none;
  }
  & > a:first-child {
    margin: 0;
    margin-top: 0px;
    padding-top: 10px;
  }
`

const SelectorLabel = styled(NetworkLabel)`
  display: none;
  @media screen and (min-width: 720px) {
    display: block;
    margin-right: 8px;
  }
`

const SelectorControls = styled.div<{ interactive: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg0};
  border: ${({ theme }) => `1px solid ${theme.border1}`};
  color: ${({ theme }) => theme.text1};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'auto')};
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`

const SelectorLogo = styled(Logo)<{ interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  @media screen and (min-width: 720px) {
    margin-right: 8px;
  }
`

const SelectorWrapper = styled.div`
  @media screen and (min-width: 720px) {
    position: relative;
  }
`

const StyledChevronDown = styled(ChevronDown)`
  width: 16px;
`

const BridgeLabel = ({ chainId }: { chainId: SupportedChainId }) => {
  switch (chainId) {
    case SupportedChainId.POLYGON:
    case SupportedChainId.MUMBAI:
      return <Text>Polygon Bridge</Text>
    default:
      return <Text>Bridge</Text>
  }
}

const ExplorerLabel = ({ chainId }: { chainId: SupportedChainId }) => {
  switch (chainId) {
    case SupportedChainId.POLYGON:
    case SupportedChainId.MUMBAI:
      return <Text>Polygonscan</Text>
    default:
      return <Text>Etherscan</Text>
  }
}

function Row({
  targetChain,
  onSelectChain,
}: {
  targetChain: SupportedChainId
  onSelectChain: (targetChain: number) => void
}) {
  const { library, chainId } = useActiveWeb3React()
  if (!library || !chainId) {
    return null
  }
  const active = chainId === targetChain
  const { explorer, bridge, label, logoUrl } = CHAIN_INFO[targetChain]

  const rowContent = (
    <FlyoutRow onClick={() => onSelectChain(targetChain)} active={active}>
      <Logo src={logoUrl} />
      <NetworkLabel>{label}</NetworkLabel>
      {chainId === targetChain && <FlyoutRowActiveIndicator />}
    </FlyoutRow>
  )

  if (active) {
    return (
      <NetworkRow>
        {rowContent}
        <NetworkRowLinkList>
          {bridge ? (
            <ExternalLink href={bridge}>
              <BridgeLabel chainId={chainId} /> <LinkOutCircle />
            </ExternalLink>
          ) : null}
          {explorer ? (
            <ExternalLink href={explorer}>
              <ExplorerLabel chainId={chainId} /> <LinkOutCircle />
            </ExternalLink>
          ) : null}
        </NetworkRowLinkList>
      </NetworkRow>
    )
  }
  return rowContent
}

export const getParsedChainId = (parsedQs?: ParsedQs) => {
  const chain = parsedQs?.chain
  if (!chain || typeof chain !== 'string') return { urlChain: undefined, urlChainId: undefined }

  return { urlChain: chain.toLowerCase(), urlChainId: getChainIdFromName(chain) }
}

const getChainIdFromName = (name: string) => {
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([_, n]) => n === name)
  const chainId = entry?.[0]
  return chainId && parseInt(chainId)
}

export const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

export default function NetworkDropdown() {
  const { chainId, library } = useActiveWeb3React()
  const parsedQs = useParsedQueryString()
  const { urlChain, urlChainId } = getParsedChainId(parsedQs)
  const prevChainId = usePrevious(chainId)
  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.NETWORK_SELECTOR)
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECTOR)
  useOnClickOutside(node, open ? toggle : undefined)

  const history = useHistory()

  const info = chainId ? CHAIN_INFO[chainId] : CHAIN_INFO[1]

  const dispatch = useAppDispatch()

  const handleChainSwitch = useCallback(
    (targetChain: number, skipToggle?: boolean) => {
      if (!library) return
      switchToNetwork({ library, chainId: targetChain })
        .then(() => {
          if (!skipToggle) {
            toggle()
          }
          history.replace({
            search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(targetChain)),
          })
        })
        .catch((error) => {
          console.error('Failed to switch networks', error)

          // we want app network <-> chainId param to be in sync, so if user changes the network by changing the URL
          // but the request fails, revert the URL back to current chainId
          if (chainId) {
            history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
          }

          if (!skipToggle) {
            toggle()
          }

          dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }))
        })
    },
    [dispatch, library, toggle, history, chainId]
  )

  useEffect(() => {
    if (!chainId || !prevChainId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (chainId !== prevChainId) {
      history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
      // otherwise assume network change originates from URL
    } else if (urlChainId && urlChainId !== chainId) {
      handleChainSwitch(urlChainId, true)
    }
  }, [chainId, urlChainId, prevChainId, handleChainSwitch, history])

  // set chain parameter on initial load if not there
  useEffect(() => {
    if (chainId && !urlChainId) {
      history.replace({ search: replaceURLParam(history.location.search, 'chain', getChainNameFromId(chainId)) })
    }
  }, [chainId, history, urlChainId, urlChain])

  if (!chainId || !info || !library) {
    return null
  }

  return (
    <SelectorWrapper ref={node as any}>
      <SelectorControls onClick={toggle} interactive>
        <SelectorLogo interactive src={info.logoUrl} />
        <SelectorLabel>{info.label}</SelectorLabel>
        <StyledChevronDown />
      </SelectorControls>
      {open && (
        <FlyoutMenu onMouseLeave={toggle}>
          <FlyoutHeader>Select a network</FlyoutHeader>
          <Row onSelectChain={handleChainSwitch} targetChain={SupportedChainId.POLYGON} />
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  )
}

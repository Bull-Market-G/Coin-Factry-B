import USDCoinImg from 'assets/images/USDCoin.png'
import USDCoinArrowImg from 'assets/images/usdcoin_arrow.png'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { AutoRow, ResponsiveRow } from 'components/Row'
import { useCoreCoinContract } from 'hooks/useContract'
import { MintState, useMintCallback } from 'hooks/useMintCallback'
import useTheme from 'hooks/useTheme'
import { useActiveWeb3React } from 'hooks/web3'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { isAddress } from 'utils'

import { TYPE } from '../../theme'
import { PageWrapper } from '../styled'

const TopWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledInputAddress = styled.input<{ disable: boolean }>`
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: ${({ theme }) => `2px solid ${theme.secondary1}`};
  padding: 1rem;
  width: 700px;
  font-size: 16px;
  font-family: 'Century';
  outline: none;
  color: ${({ theme }) => theme.text1};
  pointer-events: ${({ disable }) => (disable ? 'none' : '')};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const StyledInputAmount = styled.input`
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: ${({ theme }) => `2px solid ${theme.secondary1}`};
  padding: 1rem;
  width: 240px;
  font-size: 16px;
  font-family: 'Century';
  outline: none;
  color: ${({ theme }) => theme.text1};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

export default function Usd() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const theme = useTheme()

  const [inputAddress, setInputAddress] = useState<string | undefined>()
  const [inputAmount, setInputAmount] = useState<number | undefined>()
  const [sendAddress, setSendAddress] = useState<string | undefined>()
  const [coinBalance, setCoinBalance] = useState<string | undefined>()
  const [addressCondition, setAddressCondition] = useState<boolean>(false)
  const [amountCondition, setAmountCondition] = useState<boolean>(false)
  const [ownerCondition, setOwnerCondition] = useState<boolean>(false)
  const [earnCondition, setEarnCondition] = useState<boolean>(false)
  const { account, chainId } = useActiveWeb3React()

  const tokenAddress = '0x62c2E50f6584a64186eBdAbC9B173033F21A5Dac' // USD Coin
  const ownerAddress = '0xD170166C71fc91a3960B6fdf24D470e471dEb7F7'
  const coin = useCoreCoinContract(tokenAddress)

  const [mintState, mintCallback] = useMintCallback(coin, sendAddress, inputAmount)

  useEffect(() => {
    if (sendAddress) {
      coin?.balanceOf(sendAddress).then((result) => {
        setCoinBalance(result.div(100000000).toNumber().toFixed(2))
      })
    } else {
      setCoinBalance(undefined)
    }
  }, [sendAddress, coinBalance, coin, inputAddress, mintState])

  useEffect(() => {
    if (isAddress(inputAddress)) {
      setAddressCondition(true)
      setSendAddress(inputAddress)
    } else {
      setAddressCondition(false)
      setSendAddress(undefined)
    }
  }, [inputAddress])

  useEffect(() => {
    if (inputAmount && 0 < inputAmount && inputAmount < 90071992) {
      // MAX BigNumber 90071992.54740991 coin
      setAmountCondition(true)
    } else {
      setAmountCondition(false)
    }
  }, [inputAmount])

  useEffect(() => {
    if (account === ownerAddress) {
      setOwnerCondition(true)
    } else {
      setOwnerCondition(false)
    }
  }, [account])

  useEffect(() => {
    if (addressCondition && amountCondition && ownerCondition) {
      setEarnCondition(true)
    } else {
      setEarnCondition(false)
    }
  }, [addressCondition, amountCondition, ownerCondition])

  return (
    <PageWrapper>
      <AutoColumn gap="10px">
        <ResponsiveRow>
          <TopWrapper>
            <AutoColumn gap="10px" justify="center" style={{ width: '100%' }}>
              <AutoColumn
                gap="10px"
                justify="center"
                style={{ width: '900px', border: '2px solid #5F5F5F', padding: '1rem 1rem' }}
              >
                <AutoRow justify="center">
                  <AutoColumn>
                    <img src={USDCoinImg} width="200px" />
                    <AutoColumn>
                      <TYPE.body marginBottom="10px">Amount</TYPE.body>
                      <StyledInputAmount
                        type="number"
                        value={inputAmount}
                        onChange={(event) => setInputAmount(Number(event.target.value))}
                        placeholder="Input Currency Amount"
                      />
                    </AutoColumn>
                  </AutoColumn>
                  <img src={USDCoinArrowImg} width="460px" height="220px" />
                </AutoRow>
                <AutoColumn>
                  <AutoRow marginBottom="10px">
                    <TYPE.body>Address</TYPE.body>
                    {sendAddress ? (
                      coinBalance ? (
                        <TYPE.main marginLeft="auto">{`Balance: ${coinBalance} USD Coin`}</TYPE.main>
                      ) : (
                        <TYPE.main marginLeft="auto">{`Balance: 0 USD Coin`}</TYPE.main>
                      )
                    ) : null}
                  </AutoRow>
                  <StyledInputAddress
                    type="text"
                    value={inputAddress}
                    onChange={(event) => setInputAddress(event.target.value)}
                    placeholder="Input Address"
                    disable={!account}
                  />
                </AutoColumn>
                <ButtonPrimary
                  width="150px"
                  onClick={mintCallback}
                  altDisabledStyle={true}
                  disabled={!earnCondition || mintState === MintState.WALLET_CONDITION}
                  bgColor={theme.secondary1}
                  fontSize="25px"
                >
                  Earn
                </ButtonPrimary>
              </AutoColumn>
              <AutoColumn
                gap="2px"
                justify="flex-start"
                style={{ width: '900px', border: '2px solid #5F5F5F', padding: '1rem 0rem 1rem 6rem' }}
              >
                {mintState === MintState.WALLET_CONDITION ? (
                  <TYPE.main color={theme.red2}> ● Please operate MetaMask.</TYPE.main>
                ) : null}
                {ownerCondition ? (
                  <TYPE.main color={theme.secondary1}> ● Your wallet is owner.</TYPE.main>
                ) : account ? (
                  <TYPE.main color={theme.red2}>
                    ● Your wallet is not owner. Please change correct owner wallet.
                  </TYPE.main>
                ) : (
                  <TYPE.main color={theme.red2}> ● Please connect owner wallet.</TYPE.main>
                )}
                {chainId === 80001 ? (
                  <TYPE.main color={theme.secondary1}> ● Correct chain.</TYPE.main>
                ) : chainId === undefined ? null : (
                  <TYPE.main color={theme.red2}> ● Different chain. Please change correct chain.</TYPE.main>
                )}
                {inputAmount ? null : (
                  <TYPE.main color={theme.red2}> ● Please input the number of coins you want to mint.</TYPE.main>
                )}
                {sendAddress ? null : (
                  <TYPE.main color={theme.red2}> ● Please input the address for sending coin.</TYPE.main>
                )}
              </AutoColumn>
            </AutoColumn>
          </TopWrapper>
        </ResponsiveRow>
      </AutoColumn>
    </PageWrapper>
  )
}

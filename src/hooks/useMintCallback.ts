import { TransactionResponse } from '@ethersproject/providers'
import { CoreErc20 } from 'abis/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import { shortenAddress } from 'utils'
import { calculateGasMargin } from 'utils/calculateGasMargin'

import { useActiveWeb3React } from './web3'

export enum MintState {
  WALLET_CONDITION = 'WALLET_CONDITION',
  PENDING = 'PENDING',
  NOTHING = 'NOTHING',
}

export function useMintCallback(
  coin?: CoreErc20 | null,
  receiveAddress?: string,
  amount?: number
): [MintState, () => Promise<void>] {
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [walletCondition, setWalletCondition] = useState<boolean>(false)

  const { chainId } = useActiveWeb3React()
  const pendingTx = useIsTransactionPending(txHash)

  useEffect(() => {
    if (!pendingTx) {
      setTxHash(undefined)
    }
  }, [pendingTx])

  const mintState: MintState = useMemo(() => {
    return walletCondition ? MintState.WALLET_CONDITION : pendingTx ? MintState.PENDING : MintState.NOTHING
  }, [walletCondition, pendingTx])

  const addTransaction = useTransactionAdder()

  const mint = useCallback(async (): Promise<void> => {
    setWalletCondition(true)

    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!coin) {
      console.error('no token')
      return
    }

    if (!amount) {
      console.error('missing amount')
      return
    }

    if (!receiveAddress) {
      console.error('no address')
      return
    }

    const estimatedGas = await coin.estimateGas.mint(receiveAddress, amount * 100000000)

    return coin
      .mint(receiveAddress, amount * 100000000, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        setTxHash(response.hash)
        setWalletCondition(false)
        addTransaction(response, {
          summary: 'Mint ' + amount + ' CORE Coin to ' + shortenAddress(receiveAddress),
          mint: { receiveAddress: receiveAddress, amount: amount * 100000000 },
        })
      })
      .catch((error: Error) => {
        setWalletCondition(false)
        console.debug('Failed to mint', error)
        throw error
      })
  }, [amount, receiveAddress, coin, addTransaction, chainId])

  return [mintState, mint]
}

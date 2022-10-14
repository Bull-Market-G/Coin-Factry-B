import { Percent } from '@core-dex/sdk'
import JSBI from 'jsbi'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const NetworkContextName = 'NETWORK'

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

// transaction popup dismisal amounts
export const DEFAULT_TXN_DISMISS_MS = 25000

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const IS_ON_APP_URL = window && window.location.hostname === ''

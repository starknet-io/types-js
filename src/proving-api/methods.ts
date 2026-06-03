import type { BLOCK_ID, BROADCASTED_INVOKE_TXN } from '../api/components.js'
import * as ApiErrors from '../api/errors.js'
import type { PROVE_TRANSACTION_RESULT } from './components.js'
import * as Errors from './errors.js'

export interface RpcTypeToMessageMap {
  starknet_specVersion: {
    params?: never
    result: string
  }

  starknet_proveTransaction: {
    params: {
      block_id: BLOCK_ID
      transaction: BROADCASTED_INVOKE_TXN
    }
    result: PROVE_TRANSACTION_RESULT
    errors:
      | ApiErrors.BLOCK_NOT_FOUND
      | Errors.ACCOUNT_VALIDATION_FAILED
      | Errors.UNSUPPORTED_TX_TYPE
      | Errors.SERVICE_BUSY
      | Errors.INVALID_TRANSACTION_INPUT
      | Errors.TRANSACTION_BLOCKED
  }
}

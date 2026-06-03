import type { ChainId } from '../api/index.js'
import type {
  AccountDeploymentData,
  AddDeclareTransactionParameters,
  AddDeclareTransactionResult,
  AddInvokeTransactionParameters,
  AddInvokeTransactionResult,
  Address,
  AddStarknetChainParameters,
  API_VERSION,
  ApiVersionRequest,
  PADDED_TXN_HASH,
  RequestAccountsParameters,
  Signature,
  SpecVersion,
  STRK20_ACTION,
  STRK20_BALANCE_ENTRY,
  STRK20_CALL_AND_PROOF,
  SwitchStarknetChainParameters,
  WatchAssetParameters,
} from './components.js'
import { Permission } from './constants.js'
import * as Errors from './errors.js'
import type { TypedData } from './typedData.js'

/**
 * Maps each RPC message type to its corresponding parameters and result type.
 */
export interface RpcTypeToMessageMap {
  /**
   * Get permissions from the wallet.
   * @returns An array of permissions.
   */
  wallet_getPermissions: {
    params?: ApiVersionRequest
    result: Permission[] | []
    errors: Errors.API_VERSION_NOT_SUPPORTED | Errors.UNKNOWN_ERROR
  }

  /**
   * Request active accounts from the wallet.
   * @param params Optional parameters for requesting accounts.
   * @returns An array of account addresses as strings.
   */
  wallet_requestAccounts: {
    params?: RequestAccountsParameters & ApiVersionRequest
    result: Address[]
    errors: Errors.API_VERSION_NOT_SUPPORTED | Errors.UNKNOWN_ERROR
  }

  /**
   * Watch an asset in the wallet.
   * @param params The parameters required to watch an asset.
   * @returns A boolean indicating if the operation was successful.
   */
  wallet_watchAsset: {
    params: WatchAssetParameters & ApiVersionRequest
    result: boolean
    errors:
      | Errors.NOT_ERC20
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Add a new Starknet chain to the wallet.
   * @param params The parameters required to add a new chain.
   * @returns A boolean indicating if the operation was successful.
   */
  wallet_addStarknetChain: {
    params: AddStarknetChainParameters & ApiVersionRequest
    result: boolean
    errors:
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Switch the current Starknet chain in the wallet.
   * @param params The parameters required to switch chains.
   * @returns A boolean indicating if the operation was successful.
   */
  wallet_switchStarknetChain: {
    params: SwitchStarknetChainParameters & ApiVersionRequest
    result: boolean
    errors:
      | Errors.UNLISTED_NETWORK
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Request the current chain ID from the wallet.
   * @returns The current Starknet chain ID.
   */
  wallet_requestChainId: {
    params?: ApiVersionRequest
    result: ChainId
    errors: Errors.API_VERSION_NOT_SUPPORTED | Errors.UNKNOWN_ERROR
  }

  /**
   * Get deployment data for a contract.
   * @returns The deployment data result.
   */
  wallet_deploymentData: {
    params?: ApiVersionRequest
    result: AccountDeploymentData
    errors:
      | Errors.ACCOUNT_ALREADY_DEPLOYED
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Add an invoke transaction to the wallet.
   * @param params The parameters required for the invoke transaction.
   * @returns The result of adding the invoke transaction.
   */
  wallet_addInvokeTransaction: {
    params: AddInvokeTransactionParameters & ApiVersionRequest
    result: AddInvokeTransactionResult
    errors:
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Add a declare transaction to the wallet.
   * @param params The parameters required for the declare transaction.
   * @returns The result of adding the declare transaction.
   */
  wallet_addDeclareTransaction: {
    params: AddDeclareTransactionParameters & ApiVersionRequest
    result: AddDeclareTransactionResult
    errors:
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Sign typed data using the wallet.
   * @param params The typed data to sign.
   * @returns An array of signatures as strings.
   */
  wallet_signTypedData: {
    params: TypedData & ApiVersionRequest
    result: Signature
    errors:
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Get the list of supported RPC specification versions.
   * @returns An array of supported specification strings.
   */
  wallet_supportedSpecs: { params?: never; result: SpecVersion[] }

  /**
   * Returns a list of wallet api versions compatible with the wallet.
   * Notice this might be different from Starknet JSON-RPC spec
   * @returns An array of supported wallet api versions.
   */
  wallet_supportedWalletApi: { params?: never; result: API_VERSION[] }

  /**
   * Execute a STRK20 privacy protocol transaction directly.
   * @param params The list of STRK20 actions to perform (min 1).
   * @returns The transaction hash.
   */
  wallet_strk20InvokeTransaction: {
    params: {
      actions: STRK20_ACTION[]
      api_version?: API_VERSION
    }
    result: { transaction_hash: PADDED_TXN_HASH }
    errors:
      | Errors.NOT_REGISTERED
      | Errors.INSUFFICIENT_PRIVATE_BALANCE
      | Errors.PRIVACY_LEAK
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Prepare a STRK20 invoke transaction by building the calldata and generating a ZK proof.
   * Pass simulate: true to skip proof generation (for fee estimation or preview).
   * @param params The list of STRK20 actions and optional simulate flag.
   * @returns The assembled call and proof (proof fields are empty when simulate is true).
   */
  wallet_strk20PrepareInvoke: {
    params: {
      actions: STRK20_ACTION[]
      simulate?: boolean
      api_version?: API_VERSION
    }
    result: STRK20_CALL_AND_PROOF
    errors:
      | Errors.NOT_REGISTERED
      | Errors.INSUFFICIENT_PRIVATE_BALANCE
      | Errors.PRIVACY_LEAK
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }

  /**
   * Get STRK20 private balances for the given tokens.
   * @param params The list of token addresses to query (min 1).
   * @returns Balance per token.
   */
  wallet_strk20Balances: {
    params: {
      tokens: Address[]
      api_version?: API_VERSION
    }
    result: STRK20_BALANCE_ENTRY[]
    errors:
      | Errors.NOT_REGISTERED
      | Errors.INVALID_REQUEST_PAYLOAD
      | Errors.USER_REFUSED_OP
      | Errors.API_VERSION_NOT_SUPPORTED
      | Errors.UNKNOWN_ERROR
  }
}

export type RpcMessage = {
  [K in keyof RpcTypeToMessageMap]: { type: K } & RpcTypeToMessageMap[K]
}[keyof RpcTypeToMessageMap]

export type IsParamsOptional<T extends keyof RpcTypeToMessageMap> =
  undefined extends RpcTypeToMessageMap[T]['params'] ? true : false

export type RequestFnCall<T extends RpcMessage['type']> = {
  type: T
} & (IsParamsOptional<T> extends true
  ? { params?: RpcTypeToMessageMap[T]['params'] }
  : { params: RpcTypeToMessageMap[T]['params'] })

export type RequestFn = <T extends RpcMessage['type']>(
  call: RequestFnCall<T>
) => Promise<RpcTypeToMessageMap[T]['result']>

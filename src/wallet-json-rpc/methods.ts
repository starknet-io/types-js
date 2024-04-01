import { Permission, StarknetChainId } from '../common/constants';
import {
  AddDeclareTransactionParameters,
  AddDeclareTransactionResult,
  AddDeployAccountTransactionParameters,
  AddDeployAccountTransactionResult,
  AddInvokeTransactionParameters,
  AddInvokeTransactionResult,
  AddStarknetChainParameters,
  GetDeploymentDataResult,
  RequestAccountsParameters,
  SwitchStarknetChainParameters,
  TypedData,
  WatchAssetParameters,
} from './components';

/**
 * Maps each RPC message type to its corresponding parameters and result type.
 */
export interface RpcTypeToMessageMap {
  /**
   * Get permissions from the wallet.
   * @returns An array of permissions.
   */
  wallet_getPermissions: { params?: never; result: Permission[] };

  /**
   * Request accounts from the wallet.
   * @param params Optional parameters for requesting accounts.
   * @returns An array of account addresses as strings.
   */
  wallet_requestAccounts: {
    params?: RequestAccountsParameters;
    result: string[];
  };

  /**
   * Watch an asset in the wallet.
   * @param params The parameters required to watch an asset.
   * @returns A boolean indicating if the operation was successful.
   */
  wallet_watchAsset: { params: WatchAssetParameters; result: boolean };

  /**
   * Add a new Starknet chain to the wallet.
   * @param params The parameters required to add a new chain.
   * @returns A boolean indicating if the operation was successful.
   */
  wallet_addStarknetChain: {
    params: AddStarknetChainParameters;
    result: boolean;
  };

  /**
   * Switch the current Starknet chain in the wallet.
   * @param params The parameters required to switch chains.
   * @returns A boolean indicating if the operation was successful.
   */
  wallet_switchStarknetChain: {
    params: SwitchStarknetChainParameters;
    result: boolean;
  };

  /**
   * Request the current chain ID from the wallet.
   * @returns The current Starknet chain ID.
   */
  wallet_requestChainId: { params?: never; result: StarknetChainId };

  /**
   * Get deployment data for a contract.
   * @returns The deployment data result.
   */
  wallet_deploymentData: { params?: never; result: GetDeploymentDataResult };

  /**
   * Add an invoke transaction to the wallet.
   * @param params The parameters required for the invoke transaction.
   * @returns The result of adding the invoke transaction.
   */
  starknet_addInvokeTransaction: {
    params: AddInvokeTransactionParameters;
    result: AddInvokeTransactionResult;
  };

  /**
   * Add a declare transaction to the wallet.
   * @param params The parameters required for the declare transaction.
   * @returns The result of adding the declare transaction.
   */
  starknet_addDeclareTransaction: {
    params: AddDeclareTransactionParameters;
    result: AddDeclareTransactionResult;
  };

  /**
   * Add a deploy account transaction to the wallet.
   * @param params The parameters required for the deploy account transaction.
   * @returns The result of adding the deploy account transaction.
   */
  starknet_addDeployAccountTransaction: {
    params: AddDeployAccountTransactionParameters;
    result: AddDeployAccountTransactionResult;
  };

  /**
   * Sign typed data using the wallet.
   * @param params The typed data to sign.
   * @returns An array of signatures as strings.
   */
  starknet_signTypedData: { params: TypedData; result: string[] };

  /**
   * Get the list of supported specifications.
   * @returns An array of supported specification strings.
   */
  starknet_supportedSpecs: { params?: never; result: string[] };
}

export type RpcMessage = {
  [K in keyof RpcTypeToMessageMap]: { type: K } & RpcTypeToMessageMap[K];
}[keyof RpcTypeToMessageMap];

export type IsParamsOptional<T extends keyof RpcTypeToMessageMap> =
  undefined extends RpcTypeToMessageMap[T]['params'] ? true : false;

export type RequestFnCall<T extends RpcMessage['type']> = {
  type: T;
} & (IsParamsOptional<T> extends true
  ? { params?: RpcTypeToMessageMap[T]['params'] }
  : { params: RpcTypeToMessageMap[T]['params'] });

export type RequestFn = <T extends RpcMessage['type']>(
  call: RequestFnCall<T>
) => Promise<RpcTypeToMessageMap[T]['result']>;
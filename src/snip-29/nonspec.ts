/**
 * Paymaster API Response Types
 * Defines the structure of responses received from the Paymaster service
 * for transaction building and execution.
 */

import { TXN_HASH } from '../api';
import { OutsideExecutionTypedData } from '../wallet-api';

// Import and rename non-standard types to PascalCase for cleaner usage in this file.
import {
  ACCOUNT_DEPLOYMENT_DATA as AccountDeploymentData,
  EXECUTION_PARAMETERS as ExecutionParameters,
  FEE_ESTIMATE as FeeEstimate,
  TRACKING_ID as TrackingId,
} from './components';

// ----------------------------------------------------------------------------
// Build Transaction Responses
// ----------------------------------------------------------------------------

/**
 * Response for deploying a new account contract.
 */
export interface BuildDeployTransactionResponse {
  type: 'deploy';
  deployment: AccountDeploymentData;
  parameters: ExecutionParameters;
  fee: FeeEstimate;
}

/**
 * Response for invoking a function on an existing account.
 */
export interface BuildInvokeTransactionResponse {
  type: 'invoke';
  typed_data: OutsideExecutionTypedData;
  parameters: ExecutionParameters;
  fee: FeeEstimate;
}

/**
 * Response for simultaneously deploying an account and invoking a function.
 */
export interface BuildDeployAndInvokeTransactionResponse {
  type: 'deploy_and_invoke';
  deployment: AccountDeploymentData;
  typed_data: OutsideExecutionTypedData;
  parameters: ExecutionParameters;
  fee: FeeEstimate;
}

/**
 * Union type representing any valid transaction build response.
 * Discriminated by the 'type' field.
 */
export type BuildTransactionResponse =
  | BuildDeployTransactionResponse
  | BuildInvokeTransactionResponse

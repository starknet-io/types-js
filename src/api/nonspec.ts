/**
 * Types that are not in spec but required for UX
 */
import type {
  ADDRESS,
  BLOCK_HASH,
  BLOCK_NUMBER,
  BLOCK_WITH_RECEIPTS,
  BLOCK_WITH_TXS,
  BLOCK_WITH_TX_HASHES,
  BROADCASTED_TXN,
  CHAIN_ID,
  CONTRACT_CLASS,
  CONTRACT_STORAGE_DIFF_ITEM,
  DEPRECATED_CONTRACT_CLASS,
  EMITTED_EVENT,
  EVENT,
  EVENTS_CHUNK,
  EVENT_FILTER,
  FEE_ESTIMATE,
  FEE_PAYMENT,
  FELT,
  MSG_FROM_L1,
  NONCE_UPDATE,
  PENDING_BLOCK_WITH_RECEIPTS,
  PENDING_BLOCK_WITH_TXS,
  PENDING_BLOCK_WITH_TX_HASHES,
  PENDING_STATE_UPDATE,
  PRICE_UNIT,
  REPLACED_CLASS,
  RESOURCE_BOUNDS_MAPPING,
  RESULT_PAGE_REQUEST,
  SIMULATION_FLAG,
  STATE_UPDATE,
  SYNC_STATUS,
  TRANSACTION_TRACE,
  TXN,
  TXN_EXECUTION_STATUS,
  TXN_HASH,
  TXN_RECEIPT,
  TXN_RECEIPT_WITH_BLOCK_INFO,
  TXN_STATUS,
} from './components.js';

// METHOD RESPONSES
// response starknet_getClass
export type ContractClass = CONTRACT_CLASS | DEPRECATED_CONTRACT_CLASS;
// response starknet_simulateTransactions
export type SimulateTransaction = {
  transaction_trace: TRANSACTION_TRACE;
  fee_estimation: FEE_ESTIMATE;
};
export type SimulateTransactionResponse = SimulateTransaction[];
// response starknet_estimateFee
export type FeeEstimate = FEE_ESTIMATE;
// response starknet_getTransactionByHash, starknet_getTransactionByBlockIdAndIndex
export type TransactionWithHash = TXN & { transaction_hash: TXN_HASH };
// response starknet_blockHashAndNumber
export type BlockHashAndNumber = { block_hash: BLOCK_HASH; block_number: BLOCK_NUMBER };
// response starknet_getBlockWithTxs
export type BlockWithTxs = BLOCK_WITH_TXS | PENDING_BLOCK_WITH_TXS;
// response starknet_getBlockWithTxHashes
export type BlockWithTxHashes = BLOCK_WITH_TX_HASHES | PENDING_BLOCK_WITH_TX_HASHES;
// response starknet_getBlockWithReceipts
export type BlockWithTxReceipts = BLOCK_WITH_RECEIPTS | PENDING_BLOCK_WITH_RECEIPTS;
// response starknet_getStateUpdate
export type StateUpdate = STATE_UPDATE | PENDING_STATE_UPDATE;
// response starknet_traceBlockTransactions
export type BlockTransactionsTraces = { transaction_hash: FELT; trace_root: TRANSACTION_TRACE }[];
// response starknet_syncing
export type Syncing = false | SYNC_STATUS;
// response starknet_getEvents
export type Events = EVENTS_CHUNK;
export type EmittedEvent = EMITTED_EVENT;
export type Event = EVENT;
// response starknet_addInvokeTransaction
export type InvokedTransaction = { transaction_hash: TXN_HASH };
// response starknet_addDeclareTransaction
export type DeclaredTransaction = { transaction_hash: TXN_HASH; class_hash: FELT };
// response starknet_addDeployAccountTransaction
export type DeployedAccountTransaction = { transaction_hash: TXN_HASH; contract_address: FELT };

// Nice Components names
export type ContractAddress = ADDRESS;
export type Felt = FELT;
export type Nonce = FELT;
export type TransactionHash = TXN_HASH;
export type TransactionTrace = TRANSACTION_TRACE;
export type BlockHash = BLOCK_HASH;
export type TransactionReceipt = TXN_RECEIPT_WITH_BLOCK_INFO;
export type Receipt = TXN_RECEIPT_WITH_BLOCK_INFO & BlockHashAndNumber;
export type PendingReceipt = TXN_RECEIPT;
export type EventFilter = EVENT_FILTER & RESULT_PAGE_REQUEST;
export type SimulationFlags = Array<SIMULATION_FLAG>;
export type L1Message = MSG_FROM_L1;
export type BaseTransaction = BROADCASTED_TXN;
export type ChainId = CHAIN_ID;
export type Transaction = TXN;
export type TransactionStatus = {
  finality_status: TXN_STATUS;
  execution_status?: TXN_EXECUTION_STATUS;
};
export type ResourceBounds = RESOURCE_BOUNDS_MAPPING;
export type FeePayment = FEE_PAYMENT;
export type PriceUnit = PRICE_UNIT;

// Diff Than Seq
export type StorageDiffs = Array<CONTRACT_STORAGE_DIFF_ITEM>;
export type DeprecatedDeclaredClasses = Array<FELT>;
export type NonceUpdates = NONCE_UPDATE[];
export type ReplacedClasses = REPLACED_CLASS[];

// Enums Derived From Spec Types (require manual check for changes)
export const ETransactionType = {
  DECLARE: 'DECLARE',
  DEPLOY: 'DEPLOY',
  DEPLOY_ACCOUNT: 'DEPLOY_ACCOUNT',
  INVOKE: 'INVOKE',
  L1_HANDLER: 'L1_HANDLER',
} as const;

export type ETransactionType = (typeof ETransactionType)[keyof typeof ETransactionType];

export const ESimulationFlag = {
  SKIP_VALIDATE: 'SKIP_VALIDATE',
  SKIP_FEE_CHARGE: 'SKIP_FEE_CHARGE',
} as const;

export type ESimulationFlag = (typeof ESimulationFlag)[keyof typeof ESimulationFlag];

export const ETransactionStatus = {
  RECEIVED: 'RECEIVED',
  REJECTED: 'REJECTED',
  ACCEPTED_ON_L2: 'ACCEPTED_ON_L2',
  ACCEPTED_ON_L1: 'ACCEPTED_ON_L1',
} as const;

export type ETransactionStatus = (typeof ETransactionStatus)[keyof typeof ETransactionStatus];

export const ETransactionFinalityStatus = {
  ACCEPTED_ON_L2: 'ACCEPTED_ON_L2',
  ACCEPTED_ON_L1: 'ACCEPTED_ON_L1',
} as const;

export type ETransactionFinalityStatus =
  (typeof ETransactionFinalityStatus)[keyof typeof ETransactionFinalityStatus];

export const ETransactionExecutionStatus = {
  SUCCEEDED: 'SUCCEEDED',
  REVERTED: 'REVERTED',
} as const;

export type ETransactionExecutionStatus =
  (typeof ETransactionExecutionStatus)[keyof typeof ETransactionExecutionStatus];

export const EBlockTag = {
  LATEST: 'latest',
  PENDING: 'pending',
} as const;

export type EBlockTag = (typeof EBlockTag)[keyof typeof EBlockTag];

// 'L1' | 'L2'
export const EDataAvailabilityMode = {
  L1: 'L1',
  L2: 'L2',
} as const;

export type EDataAvailabilityMode =
  (typeof EDataAvailabilityMode)[keyof typeof EDataAvailabilityMode];

// 0 | 1
export const EDAMode = {
  L1: 0,
  L2: 1,
} as const;

export type EDAMode = (typeof EDAMode)[keyof typeof EDAMode];

/**
 * V_ Transaction versions HexString
 * F_ Fee Transaction Versions HexString (2 ** 128 + TRANSACTION_VERSION)
 */
export const ETransactionVersion = {
  V0: '0x0',
  V1: '0x1',
  V2: '0x2',
  V3: '0x3',
  F0: '0x100000000000000000000000000000000',
  F1: '0x100000000000000000000000000000001',
  F2: '0x100000000000000000000000000000002',
  F3: '0x100000000000000000000000000000003',
} as const;

export type ETransactionVersion = (typeof ETransactionVersion)[keyof typeof ETransactionVersion];
/**
 * Old Transaction Versions
 */

export const ETransactionVersion2 = {
  V0: '0x0',
  V1: '0x1',
  V2: '0x2',
  F0: '0x100000000000000000000000000000000',
  F1: '0x100000000000000000000000000000001',
  F2: '0x100000000000000000000000000000002',
} as const;
export type ETransactionVersion2 = (typeof ETransactionVersion2)[keyof typeof ETransactionVersion2];

/**
 * V3 Transaction Versions
 */

export const ETransactionVersion3 = {
  V3: '0x3',
  F3: '0x100000000000000000000000000000003',
} as const;

export type ETransactionVersion3 = (typeof ETransactionVersion3)[keyof typeof ETransactionVersion3];

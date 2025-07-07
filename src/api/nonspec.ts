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
  MESSAGE_FEE_ESTIMATE,
  MSG_FROM_L1,
  NODE_HASH_TO_NODE_MAPPING,
  NONCE_UPDATE,
  PRE_CONFIRMED_BLOCK_WITH_RECEIPTS,
  PRE_CONFIRMED_BLOCK_WITH_TXS,
  PRE_CONFIRMED_BLOCK_WITH_TX_HASHES,
  PRE_CONFIRMED_STATE_UPDATE,
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
  TXN_RECEIPT_WITH_BLOCK_INFO,
  TXN_STATUS,
  TXN_STATUS_RESULT,
  TXN_WITH_HASH,
} from './components.js';
import { CASM_COMPILED_CONTRACT_CLASS } from './executable.js';
import { OneOf } from './expansions/helpless.js';
import { IsInBlock, IsPending } from './expansions/transactionReceipt.js';
import type { STATUS_CANDIDATE, STATUS_RECEIVED } from './constants.js';

// METHOD RESPONSES
// response starknet_getClass, starknet_getClassAt
export type ContractClass = OneOf<[CONTRACT_CLASS, DEPRECATED_CONTRACT_CLASS]>;
// response starknet_simulateTransactions
export type SimulateTransaction = {
  transaction_trace: TRANSACTION_TRACE;
  fee_estimation: FEE_ESTIMATE;
};
export type SimulateTransactionResponse = SimulateTransaction[];
// response starknet_estimateFee
export type FeeEstimate = FEE_ESTIMATE;
// response starknet_estimateMessageFee
export type MessageFeeEstimate = MESSAGE_FEE_ESTIMATE;
// response starknet_getTransactionByHash, starknet_getTransactionByBlockIdAndIndex
export type TransactionWithHash = TXN_WITH_HASH;
// response starknet_blockHashAndNumber
export type BlockHashAndNumber = { block_hash: BLOCK_HASH; block_number: BLOCK_NUMBER };
// response starknet_getBlockWithTxs
export type BlockWithTxs = OneOf<[BLOCK_WITH_TXS, PRE_CONFIRMED_BLOCK_WITH_TXS]>;
// response starknet_getBlockWithTxHashes
export type BlockWithTxHashes = OneOf<[BLOCK_WITH_TX_HASHES, PRE_CONFIRMED_BLOCK_WITH_TX_HASHES]>;
// response starknet_getBlockWithReceipts
export type BlockWithTxReceipts = OneOf<[BLOCK_WITH_RECEIPTS, PRE_CONFIRMED_BLOCK_WITH_RECEIPTS]>;
// response starknet_getStateUpdate
export type StateUpdate = OneOf<[STATE_UPDATE, PRE_CONFIRMED_STATE_UPDATE]>;
// response starknet_traceBlockTransactions
export type BlockTransactionsTraces = { transaction_hash: FELT; trace_root: TRANSACTION_TRACE }[];
// response starknet_syncing
export type Syncing = false | SYNC_STATUS; // TODO: propose in spec SYNC_STATUS to be names SYNC_STATS as it represent syncing data and not syncing status like true or false
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
// response starknet_getMessagesStatus (ordered by the l1 tx sending order)
export type L1L2MessagesStatus = Array<L1L2MessageStatus>;
// response starknet_getStorageProof (merkle paths)
export type StorageProof = {
  classes_proof: NODE_HASH_TO_NODE_MAPPING;
  contracts_proof: {
    /**
     * The nodes in the union of the paths from the contracts tree root to the requested leaves
     */
    nodes: NODE_HASH_TO_NODE_MAPPING;
    /**
     * The nonce and class hash for each requested contract address, in the order in which they appear in the request. These values are needed to construct the associated leaf node
     */
    contract_leaves_data: {
      nonce: FELT;
      class_hash: FELT;
      storage_root: FELT;
    }[];
  };
  contracts_storage_proofs: NODE_HASH_TO_NODE_MAPPING[];
  global_roots: {
    contracts_tree_root: FELT;
    classes_tree_root: FELT;
    /**
     * the associated block hash (needed in case the caller used a block tag for the block_id parameter)
     */
    block_hash: FELT;
  };
};
// response starknet_getCompiledCasm
export type CompiledCasm = CASM_COMPILED_CONTRACT_CLASS;

// Nice Components names
export type ContractAddress = ADDRESS;
export type Felt = FELT;
export type Nonce = FELT;
export type TransactionHash = TXN_HASH;
export type TransactionTrace = TRANSACTION_TRACE;
export type BlockHash = BLOCK_HASH;
/**
 * All Type Transaction Receipt
 */
export type TransactionReceipt = TXN_RECEIPT_WITH_BLOCK_INFO;
/**
 * All Type Transaction Receipt from production block
 */
export type TransactionReceiptProductionBlock = IsInBlock<TransactionReceipt>;
/**
 * All Type Transaction Receipt from pending block
 */
export type TransactionReceiptPendingBlock = IsPending<TransactionReceipt>;
export type EventFilter = EVENT_FILTER & RESULT_PAGE_REQUEST;
export type SimulationFlags = Array<SIMULATION_FLAG>;
export type L1Message = MSG_FROM_L1;
export type BaseTransaction = BROADCASTED_TXN;
export type ChainId = CHAIN_ID;
export type Transaction = TXN;
export type TransactionStatus = TXN_STATUS_RESULT;
export type ResourceBounds = RESOURCE_BOUNDS_MAPPING;
export type FeePayment = FEE_PAYMENT;
export type PriceUnit = PRICE_UNIT;

/**
 * Ethereum l1_handler tx hash and status for L1 -> L2 messages sent by the l1 transaction
 */
export type L1L2MessageStatus = {
  /**
   * l1_handler tx hash
   */
  transaction_hash: TXN_HASH;
  /**
   * finality status of the L1 -> L2 messages sent by the l1 transaction
   */
  finality_status: Exclude<TXN_STATUS, STATUS_RECEIVED | STATUS_CANDIDATE>;
  /**
   * the failure reason, only appears if finality_status is REJECTED
   */
  execution_status: TXN_EXECUTION_STATUS;
  /**
   * The failure reason. Only appears if `execution_status` is REVERTED
   */
  failure_reason?: string;
};

// Diff Than Seq
export type StorageDiffs = Array<CONTRACT_STORAGE_DIFF_ITEM>;
export type DeprecatedDeclaredClasses = Array<FELT>;
export type NonceUpdates = NONCE_UPDATE[];
export type ReplacedClasses = REPLACED_CLASS[];

/**
 * Types that are not in spec but required for UX
 */
import type {
  ADDRESS,
  BLOCK_HASH,
  BLOCK_NUMBER,
  BLOCK_WITH_RECEIPTS,
  BLOCK_WITH_TX_HASHES,
  BLOCK_WITH_TXS,
  BROADCASTED_TXN,
  CHAIN_ID,
  CONTRACT_CLASS,
  CONTRACT_STORAGE_DIFF_ITEM,
  DEPRECATED_CONTRACT_CLASS,
  EMITTED_EVENT,
  EVENT,
  EVENT_FILTER,
  EVENTS_CHUNK,
  FEE_ESTIMATE,
  FEE_PAYMENT,
  FELT,
  INITIAL_READS,
  MESSAGE_FEE_ESTIMATE,
  MSG_FROM_L1,
  NODE_HASH_TO_NODE_MAPPING,
  NONCE_UPDATE,
  PRE_CONFIRMED_BLOCK_WITH_RECEIPTS,
  PRE_CONFIRMED_BLOCK_WITH_TX_HASHES,
  PRE_CONFIRMED_BLOCK_WITH_TXS,
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
  TXN_FINALITY_STATUS,
  TXN_HASH,
  TXN_RECEIPT_WITH_BLOCK_INFO,
  TXN_STATUS_RESULT,
  TXN_WITH_HASH,
} from './components.js';
import { CASM_COMPILED_CONTRACT_CLASS } from './executable.js';
import { OneOf } from './expansions/helpless.js';
import { IsInBlock, IsPreConfirmed } from './expansions/transactionReceipt.js';

/** Response for starknet_getClass, starknet_getClassAt */
export type ContractClass = OneOf<[CONTRACT_CLASS, DEPRECATED_CONTRACT_CLASS]>

/**
 * Response for starknet_simulateTransactions.
 * When trace_flags includes RETURN_INITIAL_READS, the response includes initial_reads.
 */
export type SimulateTransactionResponse = SimulateTransaction[] | SimulateTransactionResponseWithInitialReads

/**
 * The execution trace and consumed resources of the required transactions. 
 * This format is returned when RETURN_INITIAL_READS is not present in simulation_flags, 
 * maintaining compatibility with JSON-RPC 0.10.0.
 */
export type SimulateTransaction = {
  transaction_trace: TRANSACTION_TRACE
  fee_estimation: FEE_ESTIMATE
}

/**
 * The execution trace and consumed resources of the required transactions, 
 * along with initial reads when RETURN_INITIAL_READS is present in simulation_flags.
 */
export type SimulateTransactionResponseWithInitialReads = {
  simulated_transactions: SimulateTransaction[]
  /**
   * The set of state values fetched from the underlying state reader during execution for all transactions in the simulation. 
   * Required when RETURN_INITIAL_READS is present in simulation_flags.
   */
  initial_reads: INITIAL_READS
}

/** Response for starknet_estimateFee */
export type FeeEstimate = FEE_ESTIMATE
/** Response for starknet_estimateMessageFee */
export type MessageFeeEstimate = MESSAGE_FEE_ESTIMATE
/** Response for starknet_getTransactionByHash, starknet_getTransactionByBlockIdAndIndex */
export type TransactionWithHash = TXN_WITH_HASH
/** Response for starknet_blockHashAndNumber */
export type BlockHashAndNumber = { block_hash: BLOCK_HASH; block_number: BLOCK_NUMBER }
/** Response for starknet_getBlockWithTxs */
export type BlockWithTxs = OneOf<[BLOCK_WITH_TXS, PRE_CONFIRMED_BLOCK_WITH_TXS]>
/** Response for starknet_getBlockWithTxHashes */
export type BlockWithTxHashes = OneOf<[BLOCK_WITH_TX_HASHES, PRE_CONFIRMED_BLOCK_WITH_TX_HASHES]>
/** Response for starknet_getBlockWithReceipts */
export type BlockWithTxReceipts = OneOf<[BLOCK_WITH_RECEIPTS, PRE_CONFIRMED_BLOCK_WITH_RECEIPTS]>
/** Response for starknet_getStateUpdate */
export type StateUpdate = OneOf<[STATE_UPDATE, PRE_CONFIRMED_STATE_UPDATE]>

/**
 * The execution traces of all transactions included in the given block
 * When trace_flags includes RETURN_INITIAL_READS, returns BlockTransactionsTracesWithInitialReads
 */
export type BlockTransactionsTraces = BlockTransactionTrace[] | BlockTransactionsTracesWithInitialReads

/**
 * The traces of transaction in the block.
 * This format is returned when RETURN_INITIAL_READS is not present in trace_flags (or trace_flags is not provided), 
 * maintaining compatibility with JSON-RPC 0.10.0.
 */
export type BlockTransactionTrace = { transaction_hash: FELT; trace_root: TRANSACTION_TRACE }

/**
 * The traces of all transactions in the block, along with initial reads when RETURN_INITIAL_READS is present in trace_flags.
 */
export type BlockTransactionsTracesWithInitialReads = {
  traces: BlockTransactionTrace[]
  /**
   * The set of state values fetched from the underlying state reader during execution for all transactions in the block. 
   * Required when RETURN_INITIAL_READS is present in trace_flags. 
   * Returns an empty object instead of INITIAL_READS when the execution trace for the referenced block is inconsistent 
   * with the canonical block trace.
   */
  initial_reads: INITIAL_READS
}
/** Response for starknet_syncing */
export type Syncing = false | SYNC_STATUS
/** Response for starknet_getEvents */
export type Events = EVENTS_CHUNK
export type EmittedEvent = EMITTED_EVENT
export type Event = EVENT
/** Response for starknet_addInvokeTransaction */
export type InvokedTransaction = { transaction_hash: TXN_HASH }
/** Response for starknet_addDeclareTransaction */
export type DeclaredTransaction = { transaction_hash: TXN_HASH; class_hash: FELT }
/** Response for starknet_addDeployAccountTransaction */
export type DeployedAccountTransaction = { transaction_hash: TXN_HASH; contract_address: FELT }
/** Response for starknet_getMessagesStatus (ordered by the l1 tx sending order) */
export type L1L2MessagesStatus = Array<L1L2MessageStatus>
/** Response for starknet_getStorageProof (merkle paths) */
export type StorageProof = {
  classes_proof: NODE_HASH_TO_NODE_MAPPING
  contracts_proof: {
    /**
     * The nodes in the union of the paths from the contracts tree root to the requested leaves
     */
    nodes: NODE_HASH_TO_NODE_MAPPING
    /**
     * The nonce and class hash for each requested contract address, in the order in which they appear in the request. These values are needed to construct the associated leaf node
     */
    contract_leaves_data: {
      nonce: FELT
      class_hash: FELT
      storage_root: FELT
    }[]
  }
  contracts_storage_proofs: NODE_HASH_TO_NODE_MAPPING[]
  global_roots: {
    contracts_tree_root: FELT
    classes_tree_root: FELT
    /**
     * the associated block hash (needed in case the caller used a block tag for the block_id parameter)
     */
    block_hash: FELT
  }
}
/** response starknet_getCompiledCasm */
export type CompiledCasm = CASM_COMPILED_CONTRACT_CLASS

/** Contract address type alias */
export type ContractAddress = ADDRESS
/** Field element type alias */
export type Felt = FELT
/** Nonce type alias */
export type Nonce = FELT
/** Transaction hash type alias */
export type TransactionHash = TXN_HASH
/** Transaction trace type alias */
export type TransactionTrace = TRANSACTION_TRACE
/** Block hash type alias */
export type BlockHash = BLOCK_HASH
/**
 * All Type Transaction Receipt
 */
export type TransactionReceipt = TXN_RECEIPT_WITH_BLOCK_INFO
/**
 * All Type Transaction Receipt from production block
 */
export type TransactionReceiptProductionBlock = IsInBlock<TransactionReceipt>
/**
 * All Type Transaction Receipt from pre confirmed block
 */
export type TransactionReceiptPreConfirmedBlock = IsPreConfirmed<TransactionReceipt>
/** Event filter type alias */
export type EventFilter = EVENT_FILTER & RESULT_PAGE_REQUEST
/** Simulation flags type alias */
export type SimulationFlags = Array<SIMULATION_FLAG>
/** L1 message type alias */
export type L1Message = MSG_FROM_L1
/** Base transaction type alias */
export type BaseTransaction = BROADCASTED_TXN
/** Chain ID type alias */
export type ChainId = CHAIN_ID
/** Transaction type alias */
export type Transaction = TXN
/** Transaction status type alias */
export type TransactionStatus = TXN_STATUS_RESULT
/** Resource bounds type alias */
export type ResourceBounds = RESOURCE_BOUNDS_MAPPING
/** Fee payment type alias */
export type FeePayment = FEE_PAYMENT
/** Price unit type alias */
export type PriceUnit = PRICE_UNIT

/**
 * Ethereum l1_handler tx hash and status for L1 -> L2 messages sent by the l1 transaction
 */
export type L1L2MessageStatus = {
  /**
   * l1_handler tx hash
   */
  transaction_hash: TXN_HASH
  /**
   * finality status of the L1 -> L2 messages sent by the l1 transaction
   */
  finality_status: TXN_FINALITY_STATUS
  /**
   * the failure reason, only appears if finality_status is REJECTED
   */
  execution_status: TXN_EXECUTION_STATUS
  /**
   * The failure reason. Only appears if `execution_status` is REVERTED
   */
  failure_reason?: string
}

/** Storage diffs type alias */
export type StorageDiffs = Array<CONTRACT_STORAGE_DIFF_ITEM>
/** Deprecated declared classes type alias */
export type DeprecatedDeclaredClasses = Array<FELT>
/** Nonce updates type alias */
export type NonceUpdates = NONCE_UPDATE[]
/** Replaced classes type alias */
export type ReplacedClasses = REPLACED_CLASS[]

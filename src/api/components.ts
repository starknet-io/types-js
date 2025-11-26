//    ******************
//    * PRIMITIVES
//    ******************
import type {
  ABI_TYPE_CONSTRUCTOR,
  ABI_TYPE_FUNCTION,
  ABI_TYPE_L1_HANDLER,
  CALL_TYPE,
  EBlockStatus,
  EBlockTag,
  EDataAvailabilityMode,
  ESimulationFlag,
  ETransactionVersion,
  EVENT_ABI_TYPE,
  L1_DA_MODE,
  PRICE_UNIT_FRI,
  PRICE_UNIT_WEI,
  STATE_MUTABILITY_EXTERNAL,
  STATE_MUTABILITY_VIEW,
  STATUS_ACCEPTED_ON_L1,
  STATUS_ACCEPTED_ON_L2,
  STATUS_CANDIDATE,
  STATUS_PRE_CONFIRMED,
  STATUS_RECEIVED,
  STATUS_REVERTED,
  STATUS_SUCCEEDED,
  STRUCT_ABI_TYPE,
  TXN_TYPE_DECLARE,
  TXN_TYPE_DEPLOY,
  TXN_TYPE_DEPLOY_ACCOUNT,
  TXN_TYPE_INVOKE,
} from './constants.js'
import { SimpleOneOf } from './expansions/helpless.js'

/**
 * A field element. represented by at most 63 hex digits
 * @pattern ^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,62})$
 */
export type FELT = string
/**
 * an ethereum address represented as 40 hex digits
 * @pattern ^0x[a-fA-F0-9]{40}$
 */
export type ETH_ADDRESS = string
/**
 * A storage key. Represented as up to 62 hex digits, 3 bits, and 5 leading zeroes.
 * @pattern ^0x(0|[0-7]{1}[a-fA-F0-9]{0,62}$)
 */
export type STORAGE_KEY = string
/**
 * A contract address on Starknet
 */
export type ADDRESS = FELT
/**
 * string representing an unsigned integer number in prefixed hexadecimal format
 * @example "0x.."
 * @pattern ^0x[a-fA-F0-9]+$
 */
export type NUM_AS_HEX = string
/**
 * 64 bit unsigned integers, represented by hex string of length at most 16
 * "pattern": "^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,15})$"
 */
export type u64 = string
/**
 * 128 bit unsigned integers, represented by hex string of length at most 32
 * "pattern": "^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,31})$"
 */
export type u128 = string
/**
 * A transaction signature
 */
export type SIGNATURE = Array<FELT>
/**
 * The block number (height) in the blockchain
 * @minimum 0
 */
export type BLOCK_NUMBER = number
/**
 * The hash of a block
 */
export type BLOCK_HASH = FELT
/**
 * The hash of an Starknet transaction
 */
export type TXN_HASH = FELT
/**
 * The hash of an Ethereum transaction
 */
export type L1_TXN_HASH = NUM_AS_HEX
/**
 * The Starknet chain id, encoded in ASCII
 */
export type CHAIN_ID = NUM_AS_HEX
/**
 * The mutability of a function
 */
export type STATE_MUTABILITY = STATE_MUTABILITY_VIEW | STATE_MUTABILITY_EXTERNAL
/**
 * The type of an ABI function entry
 */
export type FUNCTION_ABI_TYPE = ABI_TYPE_FUNCTION | ABI_TYPE_L1_HANDLER | ABI_TYPE_CONSTRUCTOR
/**
 * common definition
 */
export type ABI_NAME_AND_TYPE = { name: string; type: string }
/**
 * common outputs
 */
export type ABI_TYPE = { type: string }
/**
 * Represents the type of an entry point.
 */
export type ENTRY_POINT_TYPE =
  | Uppercase<STATE_MUTABILITY_EXTERNAL>
  | Uppercase<ABI_TYPE_L1_HANDLER>
  | Uppercase<ABI_TYPE_CONSTRUCTOR>

/**
 * Flags that indicate how to simulate a given transaction. By default, the sequencer behavior is replicated locally (enough funds are expected to be in the account, and the fee will be deducted from the balance before the simulation of the next transaction). To skip the fee charge, use the SKIP_FEE_CHARGE flag.
 */
export type SIMULATION_FLAG =
  | typeof ESimulationFlag.SKIP_VALIDATE
  | typeof ESimulationFlag.SKIP_FEE_CHARGE

/**
 * Data availability mode.
 * Specifies a storage domain in Starknet. Each domain has different guarantees regarding availability
 */
export type DA_MODE = EDataAvailabilityMode

/**
 * The type of the transaction
 */
export type TXN_TYPE =
  | TXN_TYPE_DECLARE
  | TXN_TYPE_DEPLOY
  | TXN_TYPE_DEPLOY_ACCOUNT
  | TXN_TYPE_INVOKE
  | Uppercase<ABI_TYPE_L1_HANDLER>

/**
 * Represents the finality status of the transaction, including the case the txn is still in the mempool or failed validation during the block construction phase
 */
export type TXN_STATUS =
  | STATUS_RECEIVED
  | STATUS_CANDIDATE
  | STATUS_PRE_CONFIRMED
  | STATUS_ACCEPTED_ON_L2
  | STATUS_ACCEPTED_ON_L1

/**
 * The finality status of the transaction
 */
export type TXN_FINALITY_STATUS =
  | STATUS_PRE_CONFIRMED
  | STATUS_ACCEPTED_ON_L2
  | STATUS_ACCEPTED_ON_L1

/**
 * The execution status of the transaction
 */
export type TXN_EXECUTION_STATUS = STATUS_SUCCEEDED | STATUS_REVERTED

/**
 * The status of the block
 */
export type BLOCK_STATUS = EBlockStatus

/**
 * A block identifier that can be either a block hash, block number, or a block tag
 */
export type BLOCK_ID = BLOCK_SELECTOR | BLOCK_TAG

/**
 * A block selector that can be either a block hash or block number
 */
export type BLOCK_SELECTOR = SimpleOneOf<
  {
    block_hash: BLOCK_HASH
  },
  {
    block_number: BLOCK_NUMBER
  }
>

/**
 * A tag specifying a dynamic reference to a block.
 * Tag `l1_accepted` refers to the latest Starknet block which was included in a state update on L1 and finalized by the consensus on L1.
 * Tag `latest` refers to the latest Starknet block finalized by the consensus on L2.
 * Tag `pre_confirmed` refers to the block which is currently being built by the block proposer in height `latest` + 1.
 * @see EBlockTag
 */
export type BLOCK_TAG = EBlockTag
/**
 * Transaction status excluding L1 acceptance
 */
export type TXN_STATUS_WITHOUT_L1 = Exclude<TXN_STATUS, STATUS_ACCEPTED_ON_L1>

//    *****************
//    * WEBSOCKET API
//    *****************

/**
 * An identifier for this subscription stream used to associate events with this subscription.
 * Integer
 */
export type SUBSCRIPTION_ID = string
/**
 * New transaction status notification data
 */
export type NEW_TXN_STATUS = {
  transaction_hash: TXN_HASH
  status: TXN_STATUS_RESULT
}
/**
 * Data about reorganized blocks, starting and ending block number and hash
 */
export type REORG_DATA = {
  /**
   * Hash of the first known block of the orphaned chain
   */
  starting_block_hash: BLOCK_HASH
  /**
   * Number of the first known block of the orphaned chain
   */
  starting_block_number: BLOCK_NUMBER
  /**
   * The last known block of the orphaned chain
   */
  ending_block_hash: BLOCK_HASH
  /**
   * Number of the last known block of the orphaned chain
   */
  ending_block_number: BLOCK_NUMBER
}

/**
 * Notification to the client of a new block header
 */
export type NewHeadsEvent = {
  subscription_id: SUBSCRIPTION_ID
  result: BLOCK_HEADER
}

/**
 * Notification to the client of a new event. The event also includes the finality status of the transaction emitting the event
 */
export type StarknetEventsEvent = {
  subscription_id: SUBSCRIPTION_ID
  result: EMITTED_EVENT & { finality_status: TXN_FINALITY_STATUS } // TODO: check name of the property as spec do not define it
}

/**
 * Notification to the client of a new transaction status update
 */
export type TransactionsStatusEvent = {
  subscription_id: SUBSCRIPTION_ID
  /**
   * Transaction status result, including tx hash, finality status and execution status
   */
  result: NEW_TXN_STATUS
}

/**
 * Notification to the client of a new transaction receipt
 */
export type NewTransactionReceiptsEvent = {
  subscription_id: SUBSCRIPTION_ID
  result: TXN_RECEIPT_WITH_BLOCK_INFO
}

/**
 * Notification to the client of a new transaction, with its current finality status
 */
export type NewTransactionEvent = {
  subscription_id: SUBSCRIPTION_ID
  /**
   * A transaction and its current finality status
   */
  result: TXN_WITH_HASH & { finality_status: TXN_STATUS_WITHOUT_L1 } // TODO: this should be called transaction_status
}

/**
 * Notification to the client of a chain reorganization
 */
export type ReorgEvent = {
  subscription_id: SUBSCRIPTION_ID
  result: REORG_DATA
}

//    *****************
//    * READ API
//    *****************

export type EVENTS_CHUNK = {
  /**
   * Returns matching events
   */
  events: EMITTED_EVENT[]
  /**
   * Use this token in a subsequent query to obtain the next page. Should not appear if there are no more pages.
   */
  continuation_token?: string
}

export type RESULT_PAGE_REQUEST = {
  /**
   * The token returned from the previous query. If no token is provided the first page is returned.
   */
  continuation_token?: string
  /**
   * Chunk size
   */
  chunk_size: number
}

export type EMITTED_EVENT = EVENT & {
  /**
   * The transaction that emitted the event
   */
  transaction_hash: TXN_HASH
  /**
   * The index of the transaction in the block by which the event was emitted
   * @minimum 0
   */
  transaction_index: number
  /**
   * The index of the event in the transaction by which it was emitted
   * @minimum 0
   */
  event_index: number
  /**
   * The hash of the block in which the event was emitted
   */
  block_hash?: BLOCK_HASH
  /**
   * The number of the block in which the event was emitted
   * @minimum 0
   */
  block_number?: BLOCK_NUMBER
}

/**
 * A StarkNet event
 */
export type EVENT = {
  /**
   * The address of the contract that emitted the event
   */
  from_address: ADDRESS
} & EVENT_CONTENT

/**
 * The content of an event
 */
export type EVENT_CONTENT = {
  /**
   * The keys of the event
   */
  keys: FELT[]
  /**
   * The data of the event
   */
  data: FELT[]
}

/**
 * The keys to filter over.
 * Per key (by position), designate the possible values to be matched for events to be returned. Empty array designates 'any' value.
 */
export type EVENT_KEYS = FELT[][]

/**
 * An event filter used to query events
 */
export type EVENT_FILTER = {
  /**
   * The block to start filtering from
   */
  from_block?: BLOCK_ID
  /**
   * The block to filter up to
   */
  to_block?: BLOCK_ID
  /**
   * The contract address to filter events from
   */
  address?: ADDRESS
  /**
   * The event keys to filter
   */
  keys?: EVENT_KEYS
}

/**
 * same as BLOCK_ID, but without 'pre_confirmed' and 'l1_accepted'
 */
export type SUBSCRIPTION_BLOCK_ID = Exclude<BLOCK_ID, 'pre_confirmed' | 'l1_accepted'>

/**
 * An object describing the node synchronization status
 */
export type SYNC_STATUS = {
  starting_block_hash: BLOCK_HASH
  starting_block_num: BLOCK_NUMBER
  current_block_hash: BLOCK_HASH
  current_block_num: BLOCK_NUMBER
  highest_block_hash: BLOCK_HASH
  highest_block_num: BLOCK_NUMBER
}

/**
 * The declared class hash and compiled class hash
 */
export type NEW_CLASSES = {
  class_hash: FELT
  compiled_class_hash: FELT
}

/**
 * The list of contracts whose class was replaced
 */
export type REPLACED_CLASS = {
  class_hash: FELT
  contract_address: FELT
}

/**
 * The updated nonce per contract address
 */
export type NONCE_UPDATE = {
  contract_address: ADDRESS
  nonce: FELT
}

/**
 * The change in state applied in this block
 */
export type STATE_DIFF = {
  /**
   * The changes in storage per contract address
   */
  storage_diffs: CONTRACT_STORAGE_DIFF_ITEM[]
  /**
   * Deprecated classes declared in this block
   */
  deprecated_declared_classes: FELT[]
  /**
   * New classes declared in this block, with their declared class hash and compiled class hash
   */
  declared_classes: NEW_CLASSES[]
  /**
   * A new contract deployed as part of the state update
   */
  deployed_contracts: DEPLOYED_CONTRACT_ITEM[]
  /**
   * The list of contracts whose class was replaced
   */
  replaced_classes: REPLACED_CLASS[]
  /**
   * The updated nonce per contract address
   */
  nonces: NONCE_UPDATE[]
  /**
   * The list of class hash and the new Blake-migrated compiled class hash pair
   */
  migrated_compiled_classes?: {
    class_hash: FELT
    compiled_class_hash: FELT
  }[]
}

/**
 * Pre-confirmed block state update
 */
export type PRE_CONFIRMED_STATE_UPDATE = {
  /**
   * The state diff of the pre-confirmed block
   */
  state_diff: STATE_DIFF
  /**
   * The previous global state root
   */
  old_root?: FELT
  block_hash: never // diverge: this makes it distinct
}

/**
 * The state update applied in a block
 */
export type STATE_UPDATE = {
  /**
   * The hash of the block
   */
  block_hash: BLOCK_HASH
  /**
   * The previous global state root
   */
  old_root: FELT
  /**
   * The new global state root
   */
  new_root: FELT
  /**
   * The state diff of the block
   */
  state_diff: STATE_DIFF
}

/**
 * The block body with transaction hashes only
 */
export type BLOCK_BODY_WITH_TX_HASHES = {
  /**
   * The hashes of the transactions included in the block
   */
  transactions: TXN_HASH[]
}

/**
 * The block body with full transactions
 */
export type BLOCK_BODY_WITH_TXS = {
  /**
   * The transactions included in the block
   */
  transactions: TXN_WITH_HASH[]
}

/**
 * The block body with full transactions and their receipts
 */
export type BLOCK_BODY_WITH_RECEIPTS = {
  /**
   * The transactions and their receipts included in the block
   */
  transactions: {
    transaction: TXN
    receipt: TXN_RECEIPT
  }[]
}

export type BLOCK_HEADER = {
  /**
   * The hash of the block
   */
  block_hash: BLOCK_HASH
  /**
   * The hash of the block's parent
   */
  parent_hash: BLOCK_HASH
  /**
   * The block number
   */
  block_number: BLOCK_NUMBER
  /**
   * The new global state root
   */
  new_root: FELT
  /**
   * The time in which the block was created, in seconds since Unix epoch
   */
  timestamp: number
  /**
   * The address of the sequencer who created the block
   */
  sequencer_address: FELT
  /**
   * The price of L1 gas in the block
   */
  l1_gas_price: RESOURCE_PRICE
  /**
   * The price of L2 gas in the block
   */
  l2_gas_price: RESOURCE_PRICE
  /**
   * The price of L1 data gas in the block
   */
  l1_data_gas_price: RESOURCE_PRICE
  /**
   * The mode of data availability for the block
   */
  l1_da_mode: L1_DA_MODE
  /**
   * Semver of the current Starknet protocol
   */
  starknet_version: string
  /**
   * The root of Merkle Patricia trie for events in the block.
   * For (old) blocks where this data is not available value is 0x0
   */
  event_commitment: FELT
  /**
   * The root of Merkle Patricia trie for transactions in the block.
   * For (old) blocks where this data is not available value is 0x0
   */
  transaction_commitment: FELT
  /**
   * The root of Merkle Patricia trie for receipts in the block.
   * For (old) blocks where this data is not available value is 0x0
   */
  receipt_commitment: FELT
  /**
   * The state diff commitment hash in the block.
   * For (old) blocks where this data is not available value is 0x0
   */
  state_diff_commitment: FELT
  /**
   * The number of events in the block
   * @minimum 0
   */
  event_count: number
  /**
   * The number of transactions in the block
   * @minimum 0
   */
  transaction_count: number
  /**
   * The length of the state diff in the block.
   * For (old) blocks where this data is not available value is 0x0
   * @minimum 0
   */
  state_diff_length: number
}

export type PRE_CONFIRMED_BLOCK_HEADER = {
  /**
   * The block number of the block that the proposer is currently building. Note that this is a local view of the node, whose accuracy depends on its polling interval length.
   */
  block_number: BLOCK_NUMBER
  /**
   * The time in which the block was created, encoded in Unix time
   */
  timestamp: number
  /**
   * The StarkNet identity of the sequencer submitting this block
   */
  sequencer_address: FELT
  /**
   * The price of l1 gas in the block
   */
  l1_gas_price: RESOURCE_PRICE
  /**
   * The price of l2 gas in the block
   */
  l2_gas_price: RESOURCE_PRICE
  /**
   * The price of l1 data gas in the block
   */
  l1_data_gas_price: RESOURCE_PRICE
  /**
   * specifies whether the data of this block is published via blob data or calldata
   */
  l1_da_mode: L1_DA_MODE
  /**
   * Semver of the current Starknet protocol
   */
  starknet_version: string
}

/**
 * A block with transaction hashes
 */
export type BLOCK_WITH_TX_HASHES = { status: BLOCK_STATUS } & BLOCK_HEADER &
  BLOCK_BODY_WITH_TX_HASHES

/**
 * A block with full transactions
 */
export type BLOCK_WITH_TXS = { status: BLOCK_STATUS } & BLOCK_HEADER & BLOCK_BODY_WITH_TXS

/**
 * A block with full transactions and receipts
 */
export type BLOCK_WITH_RECEIPTS = {
  status: BLOCK_STATUS
} & BLOCK_HEADER &
  BLOCK_BODY_WITH_RECEIPTS

export type PRE_CONFIRMED_BLOCK_WITH_TX_HASHES = BLOCK_BODY_WITH_TX_HASHES &
  PRE_CONFIRMED_BLOCK_HEADER

export type PRE_CONFIRMED_BLOCK_WITH_TXS = BLOCK_BODY_WITH_TXS & PRE_CONFIRMED_BLOCK_HEADER

export type PRE_CONFIRMED_BLOCK_WITH_RECEIPTS = BLOCK_BODY_WITH_RECEIPTS &
  PRE_CONFIRMED_BLOCK_HEADER

/**
 * A new contract deployed as part of the state update
 */
export type DEPLOYED_CONTRACT_ITEM = {
  address: FELT
  class_hash: FELT
}

export type CONTRACT_STORAGE_DIFF_ITEM = {
  /**
   * The contract address for which the storage changed
   */
  address: FELT
  /**
   * The changes in the storage of the contract
   */
  storage_entries: StorageDiffItem[]
}

export type StorageDiffItem = {
  /**
   * The key of the changed value
   */
  key: FELT
  /**
   * The new value applied to the given address
   */
  value: FELT
}

/**
 * A Starknet transaction
 */
export type TXN = INVOKE_TXN | L1_HANDLER_TXN | DECLARE_TXN | DEPLOY_TXN | DEPLOY_ACCOUNT_TXN

/**
 * A transaction with its hash
 */
export type TXN_WITH_HASH = TXN & { transaction_hash: TXN_HASH }

/**
 * A declare transaction (all versions)
 */
export type DECLARE_TXN = DECLARE_TXN_V0 | DECLARE_TXN_V1 | DECLARE_TXN_V2 | DECLARE_TXN_V3

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type DECLARE_TXN_V0 = {
  type: TXN_TYPE_DECLARE
  sender_address: ADDRESS
  max_fee: FELT
  version: typeof ETransactionVersion.V0 | typeof ETransactionVersion.F0
  signature: SIGNATURE
  class_hash: FELT
}

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type DECLARE_TXN_V1 = {
  type: TXN_TYPE_DECLARE
  sender_address: ADDRESS
  max_fee: FELT
  version: typeof ETransactionVersion.V1 | typeof ETransactionVersion.F1
  signature: SIGNATURE
  nonce: FELT
  class_hash: FELT
}

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type DECLARE_TXN_V2 = {
  type: TXN_TYPE_DECLARE
  sender_address: ADDRESS
  compiled_class_hash: FELT
  max_fee: FELT
  version: typeof ETransactionVersion.V2 | typeof ETransactionVersion.F2
  signature: SIGNATURE
  nonce: FELT
  class_hash: FELT
}

export type DECLARE_TXN_V3 = {
  type: TXN_TYPE_DECLARE
  sender_address: ADDRESS
  compiled_class_hash: FELT
  version: typeof ETransactionVersion.V3 | typeof ETransactionVersion.F3
  signature: SIGNATURE
  nonce: FELT
  class_hash: FELT
  // new...
  resource_bounds: RESOURCE_BOUNDS_MAPPING
  tip: u64
  paymaster_data: FELT[]
  account_deployment_data: FELT[]
  nonce_data_availability_mode: DA_MODE
  fee_data_availability_mode: DA_MODE
}

/**
 * A transaction to be broadcasted to the network
 */
export type BROADCASTED_TXN =
  | BROADCASTED_INVOKE_TXN
  | BROADCASTED_DECLARE_TXN
  | BROADCASTED_DEPLOY_ACCOUNT_TXN

/**
 * A broadcasted invoke transaction
 */
export type BROADCASTED_INVOKE_TXN = INVOKE_TXN_V3

/**
 * A broadcasted deploy account transaction
 */
export type BROADCASTED_DEPLOY_ACCOUNT_TXN = DEPLOY_ACCOUNT_TXN_V3

/**
 * A broadcasted declare transaction
 */
export type BROADCASTED_DECLARE_TXN = BROADCASTED_DECLARE_TXN_V3

export type BROADCASTED_DECLARE_TXN_V3 = {
  type: TXN_TYPE_DECLARE
  sender_address: ADDRESS
  compiled_class_hash: FELT
  version: typeof ETransactionVersion.V3 | typeof ETransactionVersion.F3
  signature: SIGNATURE
  nonce: FELT
  contract_class: CONTRACT_CLASS
  // new...
  resource_bounds: RESOURCE_BOUNDS_MAPPING
  tip: u64
  paymaster_data: FELT[]
  account_deployment_data: FELT[]
  nonce_data_availability_mode: DA_MODE
  fee_data_availability_mode: DA_MODE
}

/**
 * A deploy account transaction (all versions)
 */
export type DEPLOY_ACCOUNT_TXN = DEPLOY_ACCOUNT_TXN_V1 | DEPLOY_ACCOUNT_TXN_V3

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type DEPLOY_ACCOUNT_TXN_V1 = {
  type: TXN_TYPE_DEPLOY_ACCOUNT
  max_fee: FELT
  version: typeof ETransactionVersion.V1 | typeof ETransactionVersion.F1
  signature: SIGNATURE
  nonce: FELT
  contract_address_salt: FELT
  constructor_calldata: FELT[]
  class_hash: FELT
}

export type DEPLOY_ACCOUNT_TXN_V3 = {
  type: TXN_TYPE_DEPLOY_ACCOUNT
  version: typeof ETransactionVersion.V3 | typeof ETransactionVersion.F3
  signature: SIGNATURE
  nonce: FELT
  contract_address_salt: FELT
  constructor_calldata: FELT[]
  class_hash: FELT
  resource_bounds: RESOURCE_BOUNDS_MAPPING
  tip: u64
  paymaster_data: FELT[]
  nonce_data_availability_mode: DA_MODE
  fee_data_availability_mode: DA_MODE
}

/**
 * A deploy transaction (legacy, no longer used for new deployments)
 */
export type DEPLOY_TXN = {
  type: TXN_TYPE_DEPLOY
  version: FELT
  contract_address_salt: FELT
  constructor_calldata: FELT[]
  class_hash: FELT
}

/**
 * An invoke transaction (all versions)
 */
export type INVOKE_TXN = INVOKE_TXN_V0 | INVOKE_TXN_V1 | INVOKE_TXN_V3

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type INVOKE_TXN_V0 = {
  type: TXN_TYPE_INVOKE
  max_fee: FELT
  version: typeof ETransactionVersion.V0 | typeof ETransactionVersion.F0
  signature: SIGNATURE
  contract_address: ADDRESS
  entry_point_selector: FELT
  calldata: FELT[]
}

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type INVOKE_TXN_V1 = {
  type: TXN_TYPE_INVOKE
  sender_address: ADDRESS
  calldata: FELT[]
  max_fee: FELT
  version: typeof ETransactionVersion.V1 | typeof ETransactionVersion.F1
  signature: SIGNATURE
  nonce: FELT
}

export type INVOKE_TXN_V3 = {
  type: TXN_TYPE_INVOKE
  sender_address: ADDRESS
  calldata: FELT[]
  version: typeof ETransactionVersion.V3 | typeof ETransactionVersion.F3
  signature: SIGNATURE
  nonce: FELT
  resource_bounds: RESOURCE_BOUNDS_MAPPING
  tip: u64
  paymaster_data: FELT[]
  account_deployment_data: FELT[]
  nonce_data_availability_mode: DA_MODE
  fee_data_availability_mode: DA_MODE
}

/**
 * An L1 handler transaction, triggered by a message from L1
 */
export type L1_HANDLER_TXN = {
  version: typeof ETransactionVersion.V0
  type: Uppercase<ABI_TYPE_L1_HANDLER>
  nonce: NUM_AS_HEX
} & FUNCTION_CALL

/**
 * Common properties shared by all transaction receipts
 */
export type COMMON_RECEIPT_PROPERTIES = {
  transaction_hash: TXN_HASH
  actual_fee: FEE_PAYMENT
  finality_status: TXN_FINALITY_STATUS
  messages_sent: MSG_TO_L1[]
  events: EVENT[]
  execution_resources: EXECUTION_RESOURCES
} & SimpleOneOf<SUCCESSFUL_COMMON_RECEIPT_PROPERTIES, REVERTED_COMMON_RECEIPT_PROPERTIES>

/**
 * Properties specific to a successful transaction receipt
 */
type SUCCESSFUL_COMMON_RECEIPT_PROPERTIES = {
  execution_status: STATUS_SUCCEEDED
}

/**
 * Properties specific to a reverted transaction receipt
 */
type REVERTED_COMMON_RECEIPT_PROPERTIES = {
  execution_status: STATUS_REVERTED
  revert_reason: string
}

/**
 * A transaction receipt for an invoke transaction
 */
export type INVOKE_TXN_RECEIPT = {
  type: TXN_TYPE_INVOKE
} & COMMON_RECEIPT_PROPERTIES

/**
 * A transaction receipt for a declare transaction
 */
export type DECLARE_TXN_RECEIPT = {
  type: TXN_TYPE_DECLARE
} & COMMON_RECEIPT_PROPERTIES

/**
 * A transaction receipt for a deploy account transaction
 */
export type DEPLOY_ACCOUNT_TXN_RECEIPT = {
  type: TXN_TYPE_DEPLOY_ACCOUNT
  contract_address: FELT
} & COMMON_RECEIPT_PROPERTIES

/**
 * A transaction receipt for a deploy transaction
 */
export type DEPLOY_TXN_RECEIPT = {
  type: TXN_TYPE_DEPLOY
  contract_address: FELT
} & COMMON_RECEIPT_PROPERTIES

/**
 * A transaction receipt for an L1 handler transaction
 */
export type L1_HANDLER_TXN_RECEIPT = {
  type: Uppercase<ABI_TYPE_L1_HANDLER>
  message_hash: NUM_AS_HEX
} & COMMON_RECEIPT_PROPERTIES

/**
 * All possible transaction receipt types
 */
export type TXN_RECEIPT =
  | INVOKE_TXN_RECEIPT
  | L1_HANDLER_TXN_RECEIPT
  | DECLARE_TXN_RECEIPT
  | DEPLOY_TXN_RECEIPT
  | DEPLOY_ACCOUNT_TXN_RECEIPT

/**
 * A transaction receipt with block information
 */
export type TXN_RECEIPT_WITH_BLOCK_INFO = TXN_RECEIPT & {
  block_number: BLOCK_NUMBER
} & (
    | { block_hash: BLOCK_HASH }
    | {
        /**
         * If this field is missing, it means the receipt belongs to the pre-confirmed block
         */
        block_hash: never
      }
  )

/**
 * A message sent from L2 to L1
 */
export type MSG_TO_L1 = {
  from_address: FELT
  to_address: FELT
  payload: FELT[]
}

/**
 * A message sent from L1 to L2
 */
export type MSG_FROM_L1 = {
  from_address: ETH_ADDRESS
  to_address: ADDRESS
  entry_point_selector: FELT
  payload: FELT[]
}

/**
 * Function call information
 */
export type FUNCTION_CALL = {
  contract_address: ADDRESS
  entry_point_selector: FELT
  calldata: FELT[]
}

/**
 * The definition of a StarkNet contract class
 */
export type CONTRACT_CLASS = {
  sierra_program: FELT[]
  contract_class_version: string
  entry_points_by_type: {
    CONSTRUCTOR: SIERRA_ENTRY_POINT[]
    EXTERNAL: SIERRA_ENTRY_POINT[]
    L1_HANDLER: SIERRA_ENTRY_POINT[]
  }
  abi: string
}

export type DEPRECATED_CONTRACT_CLASS = {
  program: string
  entry_points_by_type: {
    CONSTRUCTOR: DEPRECATED_CAIRO_ENTRY_POINT[]
    EXTERNAL: DEPRECATED_CAIRO_ENTRY_POINT[]
    L1_HANDLER: DEPRECATED_CAIRO_ENTRY_POINT[]
  }
  abi: CONTRACT_ABI
}

export type DEPRECATED_CAIRO_ENTRY_POINT = {
  /**
   * "The offset of the entry point in the program"
   */
  offset: NUM_AS_HEX
  /**
   * A unique identifier of the entry point (function) in the program
   */
  selector: FELT
}

/**
 * A Sierra contract entry point
 */
export type SIERRA_ENTRY_POINT = {
  /**
   * A unique identifier of the entry point (function) in the program
   */
  selector: FELT
  /**
   * The index of the function in the program
   * @minimum 0
   */
  function_idx: number
}

/**
 * The ABI of a contract
 */
export type CONTRACT_ABI = readonly CONTRACT_ABI_ENTRY[]

/**
 * A single entry in a contract's ABI
 */
export type CONTRACT_ABI_ENTRY = FUNCTION_ABI_ENTRY | EVENT_ABI_ENTRY | STRUCT_ABI_ENTRY

export type STRUCT_ABI_ENTRY = {
  /**
   * Struct ABI type
   */
  type: STRUCT_ABI_TYPE
  /**
   * Struct name
   */
  name: string
  size: number
  members: STRUCT_MEMBER[]
}

export type STRUCT_MEMBER = TYPED_PARAMETER & {
  /**
   * offset of this property within the struct
   * @minimum 0
   */
  offset: number
}

export type EVENT_ABI_ENTRY = {
  /**
   * Event ABI type
   */
  type: EVENT_ABI_TYPE
  /**
   * Event name
   */
  name: string
  keys: TYPED_PARAMETER[]
  data: TYPED_PARAMETER[]
}

/**
 * The state mutability of a function in an ABI
 */
export type FUNCTION_STATE_MUTABILITY = STATE_MUTABILITY_VIEW

export type FUNCTION_ABI_ENTRY = {
  /**
   * Function ABI type
   */
  type: FUNCTION_ABI_TYPE
  /**
   * Function name
   */
  name: string
  /**
   * Typed parameter
   */
  inputs: TYPED_PARAMETER[]
  /**
   * Typed parameter
   */
  outputs: TYPED_PARAMETER[]
  /**
   * Function state mutability
   */
  stateMutability?: FUNCTION_STATE_MUTABILITY
}

export type TYPED_PARAMETER = {
  /**
   * Parameter name
   */
  name: string
  /**
   * Parameter type
   */
  type: string
}

/**
 * Simulation flags allowed for fee estimation
 */
export type SIMULATION_FLAG_FOR_ESTIMATE_FEE = typeof ESimulationFlag.SKIP_VALIDATE
/**
 * The unit of a price (WEI or FRI)
 */
export type PRICE_UNIT = PRICE_UNIT_WEI | PRICE_UNIT_FRI

/**
 * Common properties for fee estimation
 */
export type FEE_ESTIMATE_COMMON = {
  /**
   * The Ethereum gas consumption of the transaction, charged for L1->L2 messages and, depending on the block's DA_MODE, state diffs.
   * Prev. name gas_consumed
   */
  l1_gas_consumed: u64
  /**
   * The gas price (in wei or fri, depending on the tx version) that was used in the cost estimation.
   * Prev. name gas_price
   */
  l1_gas_price: u128
  /**
   * The L2 gas consumption of the transaction.
   */
  l2_gas_consumed: u64
  /**
   * The L2 gas price (in wei or fri, depending on the tx version) that was used in the cost estimation.
   */
  l2_gas_price: u128
  /**
   * The Ethereum data gas consumption of the transaction.
   * Prev. name data_gas_consumed
   */
  l1_data_gas_consumed: u64
  /**
   * The data gas price (in wei or fri, depending on the tx version) that was used in the cost estimation.
   * Prev. name data_gas_price
   */
  l1_data_gas_price: u128
  /**
   * The estimated fee for the transaction (in wei or fri, depending on the tx version), equals to l1_gas_consumed*l1_gas_price + l1_data_gas_consumed*l1_data_gas_price + l2_gas_consumed*l2_gas_price
   */
  overall_fee: u128
}

/**
 * Fee estimation result for a transaction
 */
export type FEE_ESTIMATE = FEE_ESTIMATE_COMMON & {
  /**
   * Units in which the fee is given, can only be FRI
   */
  unit: PRICE_UNIT_FRI
}

/**
 * Message fee estimate
 */
export type MESSAGE_FEE_ESTIMATE = FEE_ESTIMATE_COMMON & {
  /**
   * Units in which the fee is given, can only be WEI
   */
  unit: PRICE_UNIT_WEI
}

/**
 * Fee payment information
 */
export type FEE_PAYMENT = {
  /**
   * The amount paid
   */
  amount: FELT
  /**
   * The unit of the fee (WEI or FRI)
   */
  unit: PRICE_UNIT
}

/**
 * The resource bounds for a transaction
 */
export type RESOURCE_BOUNDS_MAPPING = {
  /**
   * The max amount and max price per unit of L1 gas used in this tx
   */
  l1_gas: RESOURCE_BOUNDS
  /**
   * The max amount and max price per unit of L1 blob gas used in this tx
   */
  l1_data_gas: RESOURCE_BOUNDS
  /**
   * The max amount and max price per unit of L2 gas used in this tx
   */
  l2_gas: RESOURCE_BOUNDS
}

/**
 * The maximum resources a transaction can consume
 */
export type RESOURCE_BOUNDS = {
  /**
   * The max amount of the resource that can be used
   */
  max_amount: u64
  /**
   * The max price per unit of the resource
   */
  max_price_per_unit: u128
}

/**
 * The price of a resource in both FRI and WEI
 */
export type RESOURCE_PRICE = {
  /**
   * The price in FRI (STRK's smallest unit)
   */
  price_in_fri: FELT
  /**
   * The price in WEI (ETH's smallest unit)
   */
  price_in_wei: FELT
}

/**
 * the resources consumed by the transaction
 */
export type EXECUTION_RESOURCES = {
  /**
   * l1 gas consumed by this transaction, used for l2-->l1 messages and state updates if blobs are not used.
   * integer
   * @minimum 0
   */
  l1_gas: number
  /**
   * data gas consumed by this transaction, 0 if blobs are not used
   * integer
   * @minimum 0
   */
  l1_data_gas: number
  /**
   * l2 gas consumed by this transaction, used for computation and calldata
   * Integer
   * @minimum 0
   */
  l2_gas: number
}

/**
 * a node in the Merkle-Patricia tree, can be a leaf, binary node, or an edge node
 */
export type MERKLE_NODE = SimpleOneOf<BINARY_NODE, EDGE_NODE>

/**
 * an internal node whose both children are non-zero
 */
export type BINARY_NODE = {
  /**
   * the hash of the left child
   */
  left: FELT
  /**
   * the hash of the right child
   */
  right: FELT
}

/**
 * represents a path to the highest non-zero descendant node
 */
export type EDGE_NODE = {
  /**
   * an unsigned integer whose binary representation represents the path from the current node to its highest non-zero descendant (bounded by 2^251)
   */
  path: NUM_AS_HEX
  /**
   * the length of the path (bounded by 251)
   * @minimum 0
   */
  length: number
  /**
   * the hash of the unique non-zero maximal-height descendant node
   */
  child: FELT
}

/**
 * a node_hash -> node mapping of all the nodes in the union of the paths between the requested leaves and the root
 */
export type NODE_HASH_TO_NODE_MAPPING = Array<{
  node_hash: FELT
  node: MERKLE_NODE
}>

/**
 * structured error that can later be processed by wallets or sdks.
 * error frame or the error raised during execution
 */
export type CONTRACT_EXECUTION_ERROR = CONTRACT_EXECUTION_ERROR_INNER

/**
 * structured error that can later be processed by wallets or sdks.
 * error frame or the error raised during execution
 */
export type CONTRACT_EXECUTION_ERROR_INNER =
  | {
      contract_address: ADDRESS
      class_hash: FELT
      selector: FELT
      error: CONTRACT_EXECUTION_ERROR
    }
  | string

//    *****************
//    * TRACE API
//    *****************

/**
 * A transaction trace including the execution details
 */
export type TRANSACTION_TRACE =
  | INVOKE_TXN_TRACE
  | DECLARE_TXN_TRACE
  | DEPLOY_ACCOUNT_TXN_TRACE
  | L1_HANDLER_TXN_TRACE

/**
 * A transaction trace for an invoke transaction
 */
export type INVOKE_TXN_TRACE = {
  type: TXN_TYPE_INVOKE
  /**
   * The trace of the __execute__ call
   */
  execute_invocation: REVERTIBLE_FUNCTION_INVOCATION
  validate_invocation?: FUNCTION_INVOCATION
  fee_transfer_invocation?: FUNCTION_INVOCATION
  state_diff?: STATE_DIFF
  execution_resources: EXECUTION_RESOURCES
}

/**
 * A transaction trace for a declare transaction
 */
export type DECLARE_TXN_TRACE = {
  type: TXN_TYPE_DECLARE
  validate_invocation?: FUNCTION_INVOCATION
  fee_transfer_invocation?: FUNCTION_INVOCATION
  state_diff?: STATE_DIFF
  execution_resources: EXECUTION_RESOURCES
}

/**
 * A transaction trace for a deploy account transaction
 */
export type DEPLOY_ACCOUNT_TXN_TRACE = {
  type: TXN_TYPE_DEPLOY_ACCOUNT
  /**
   * The trace of the constructor call
   */
  constructor_invocation: FUNCTION_INVOCATION
  validate_invocation?: FUNCTION_INVOCATION
  fee_transfer_invocation?: FUNCTION_INVOCATION
  state_diff?: STATE_DIFF
  execution_resources: EXECUTION_RESOURCES
}

/**
 * A transaction trace for an L1 handler transaction
 */
export type L1_HANDLER_TXN_TRACE = {
  type: Uppercase<ABI_TYPE_L1_HANDLER>
  /**
   * The trace of the L1 handler call
   */
  function_invocation: REVERTIBLE_FUNCTION_INVOCATION
  state_diff?: STATE_DIFF
  execution_resources: EXECUTION_RESOURCES
}

/**
 * Represents a nested function call.
 */
export type NESTED_CALL = FUNCTION_INVOCATION

/**
 * Represents a function invocation along with its execution details.
 */
export type FUNCTION_INVOCATION = FUNCTION_CALL & {
  /**
   * The address of the invoking contract. 0 for the root invocation
   */
  caller_address: FELT
  /**
   * The hash of the class being called
   */
  class_hash: FELT
  entry_point_type: ENTRY_POINT_TYPE
  call_type: CALL_TYPE
  /**
   * The value returned from the function invocation
   */
  result: FELT[]
  /**
   * The calls made by this invocation
   */
  calls: NESTED_CALL[]
  /**
   * The events emitted in this invocation
   */
  events: ORDERED_EVENT[]
  /**
   * The messages sent by this invocation to L1
   */
  messages: ORDERED_MESSAGE[]
  /**
   * Resources consumed by the call tree rooted at this given call (including the root)
   */
  execution_resources: INNER_CALL_EXECUTION_RESOURCES
  /**
   * true if this inner call panicked
   */
  is_reverted: boolean
}

/**
 * the resources consumed by an inner call (does not account for state diffs since data is squashed across the transaction)
 */
export type INNER_CALL_EXECUTION_RESOURCES = {
  /**
   * l1 gas consumed by this transaction, used for l2-->l1 messages and state updates if blobs are not used
   * @minimum 0
   */
  l1_gas: number
  /**
   * l2 gas consumed by this transaction, used for computation and calldata
   * @minimum 0
   */
  l2_gas: number
}

export type REVERTIBLE_FUNCTION_INVOCATION = SimpleOneOf<
  FUNCTION_INVOCATION,
  { revert_reason: string }
>

/**
 * Represents an ordered event alongside its order within the transaction.
 */
export type ORDERED_EVENT = {
  /**
   * @minimum 0
   */
  order: number
} & EVENT_CONTENT

/**
 * Represents an ordered message alongside its order within the transaction.
 */
export type ORDERED_MESSAGE = {
  /**
   * @minimum 0
   */
  order: number
  message: MSG_TO_L1
}

/**
 * Transaction status result, including finality status and execution status
 */
export type TXN_STATUS_RESULT = {
  finality_status: TXN_STATUS
  execution_status?: TXN_EXECUTION_STATUS
  /**
   * The failure reason, only appears if execution_status is REVERTED
   */
  failure_reason?: string
}

/**
 * (contract_address, storage_keys) pairs
 */
export type CONTRACT_STORAGE_KEYS = {
  contract_address: ADDRESS
  storage_keys: STORAGE_KEY[]
}

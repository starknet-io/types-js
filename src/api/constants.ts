/**
 * The transaction/block was accepted on L2 and included
 */
export type STATUS_ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2';
export const STATUS_ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2';

/**
 * The transaction/block was accepted on Ethereum (L1)
 */
export type STATUS_ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1';
export const STATUS_ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1';

/**
 * The transaction was successfully executed
 */
export type STATUS_SUCCEEDED = 'SUCCEEDED';
export const STATUS_SUCCEEDED = 'SUCCEEDED';

/**
 * The transaction passed validation but failed during execution by the sequencer, and is included in a block as reverted
 */
export type STATUS_REVERTED = 'REVERTED';
export const STATUS_REVERTED = 'REVERTED';

/**
 * The block was rejected and will not be included
 */
export type STATUS_REJECTED = 'REJECTED';
export const STATUS_REJECTED = 'REJECTED';

/**
 * The transaction was received by the sequencer
 */
export type STATUS_RECEIVED = 'RECEIVED';
export const STATUS_RECEIVED = 'RECEIVED';

/**
 * The transaction is a candidate for inclusion in the next block
 */
export type STATUS_CANDIDATE = 'CANDIDATE';
export const STATUS_CANDIDATE = 'CANDIDATE';

/**
 * The transaction/block was written to the feeder gateway's storage by a sequencer
 */
export type STATUS_PRE_CONFIRMED = 'PRE_CONFIRMED';
export const STATUS_PRE_CONFIRMED = 'PRE_CONFIRMED';

export type STATUS_PRE_CONFIRMED_LOWERCASE = InferLowercaseString<typeof STATUS_PRE_CONFIRMED>;
export const STATUS_PRE_CONFIRMED_LOWERCASE =
  STATUS_PRE_CONFIRMED.toLowerCase() as InferLowercaseString<typeof STATUS_PRE_CONFIRMED>;

export type TXN_TYPE_DECLARE = 'DECLARE';
export const TXN_TYPE_DECLARE = 'DECLARE';

export type TXN_TYPE_DEPLOY = 'DEPLOY';
export const TXN_TYPE_DEPLOY = 'DEPLOY';

export type TXN_TYPE_DEPLOY_ACCOUNT = 'DEPLOY_ACCOUNT';
export const TXN_TYPE_DEPLOY_ACCOUNT = 'DEPLOY_ACCOUNT';

export type TXN_TYPE_INVOKE = 'INVOKE';
export const TXN_TYPE_INVOKE = 'INVOKE';

export type TXN_TYPE_L1_HANDLER = 'L1_HANDLER';
export const TXN_TYPE_L1_HANDLER = 'L1_HANDLER';

export type STRUCT_ABI_TYPE = 'struct';
export const STRUCT_ABI_TYPE = 'struct';

export type EVENT_ABI_TYPE = 'event';
export const EVENT_ABI_TYPE = 'event';

export type ABI_TYPE_FUNCTION = 'function';
export const ABI_TYPE_FUNCTION = 'function';

export type ABI_TYPE_CONSTRUCTOR = 'constructor';
export const ABI_TYPE_CONSTRUCTOR = 'constructor';

export type ABI_TYPE_L1_HANDLER = 'l1_handler';
export const ABI_TYPE_L1_HANDLER = 'l1_handler';

export type ABI_TYPE_ENUM = 'enum';
export const ABI_TYPE_ENUM = 'enum';

export type STATE_MUTABILITY_VIEW = 'view';
export const STATE_MUTABILITY_VIEW = 'view';

export type STATE_MUTABILITY_EXTERNAL = 'external';
export const STATE_MUTABILITY_EXTERNAL = 'external';

export type PRICE_UNIT_WEI = 'WEI';
export const PRICE_UNIT_WEI = 'WEI';

export type PRICE_UNIT_FRI = 'FRI';
export const PRICE_UNIT_FRI = 'FRI';

export const L1_DA_MODE = {
  BLOB: 'BLOB',
  CALLDATA: 'CALLDATA',
} as const;
export type L1_DA_MODE = (typeof L1_DA_MODE)[keyof typeof L1_DA_MODE];

/**
 * Represents the type of a function call.
 */
export const CALL_TYPE = {
  DELEGATE: 'DELEGATE',
  LIBRARY_CALL: 'LIBRARY_CALL',
  CALL: 'CALL',
} as const;
export type CALL_TYPE = (typeof CALL_TYPE)[keyof typeof CALL_TYPE];

// Enums Derived From Spec Types (require manual check for changes)
export const ETransactionType = {
  DECLARE: TXN_TYPE_DECLARE,
  DEPLOY: TXN_TYPE_DEPLOY,
  DEPLOY_ACCOUNT: TXN_TYPE_DEPLOY_ACCOUNT,
  INVOKE: TXN_TYPE_INVOKE,
  L1_HANDLER: TXN_TYPE_L1_HANDLER,
} as const;

export type ETransactionType = (typeof ETransactionType)[keyof typeof ETransactionType];

// TODO: Should we also add broadcasted txn type? (e.g. DECLARE, INVOKE, DEPLOY_ACCOUNT) for L1 not sure ?

export const ESimulationFlag = {
  SKIP_VALIDATE: 'SKIP_VALIDATE',
  SKIP_FEE_CHARGE: 'SKIP_FEE_CHARGE',
} as const;

export type ESimulationFlag = (typeof ESimulationFlag)[keyof typeof ESimulationFlag];

export const ETransactionStatus = {
  RECEIVED: STATUS_RECEIVED,
  CANDIDATE: STATUS_CANDIDATE,
  PRE_CONFIRMED: STATUS_PRE_CONFIRMED,
  ACCEPTED_ON_L2: STATUS_ACCEPTED_ON_L2,
  ACCEPTED_ON_L1: STATUS_ACCEPTED_ON_L1,
} as const;

export type ETransactionStatus = (typeof ETransactionStatus)[keyof typeof ETransactionStatus];

export const ETransactionFinalityStatus = {
  PRE_CONFIRMED: STATUS_PRE_CONFIRMED,
  ACCEPTED_ON_L2: STATUS_ACCEPTED_ON_L2,
  ACCEPTED_ON_L1: STATUS_ACCEPTED_ON_L1,
} as const;

export type ETransactionFinalityStatus =
  (typeof ETransactionFinalityStatus)[keyof typeof ETransactionFinalityStatus];

export const ETransactionExecutionStatus = {
  SUCCEEDED: STATUS_SUCCEEDED,
  REVERTED: STATUS_REVERTED,
} as const;

export type ETransactionExecutionStatus =
  (typeof ETransactionExecutionStatus)[keyof typeof ETransactionExecutionStatus];

type InferLowercaseString<T extends string> = Lowercase<T>;

export const EBlockTag = {
  LATEST: 'latest',
  PRE_CONFIRMED: STATUS_PRE_CONFIRMED_LOWERCASE,
} as const;

export type EBlockTag = (typeof EBlockTag)[keyof typeof EBlockTag];

export const EBlockStatus = {
  PRE_CONFIRMED: STATUS_PRE_CONFIRMED,
  ACCEPTED_ON_L2: STATUS_ACCEPTED_ON_L2,
  ACCEPTED_ON_L1: STATUS_ACCEPTED_ON_L1,
  REJECTED: STATUS_REJECTED,
} as const;

export type EBlockStatus = (typeof EBlockStatus)[keyof typeof EBlockStatus];

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
  /**
   * @deprecated Starknet 0.14 will not support this transaction
   */
  V0: '0x0',
  /**
   * @deprecated Starknet 0.14 will not support this transaction
   */
  V1: '0x1',
  /**
   * @deprecated Starknet 0.14 will not support this transaction
   */
  V2: '0x2',
  V3: '0x3',
  /**
   * @deprecated Starknet 0.14 will not support this transaction
   */
  F0: '0x100000000000000000000000000000000',
  /**
   * @deprecated Starknet 0.14 will not support this transaction
   */
  F1: '0x100000000000000000000000000000001',
  /**
   * @deprecated Starknet 0.14 will not support this transaction
   */
  F2: '0x100000000000000000000000000000002',
  F3: '0x100000000000000000000000000000003',
} as const;

export type ETransactionVersion = (typeof ETransactionVersion)[keyof typeof ETransactionVersion];
/**
 * Old Transaction Versions
 */

/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export const ETransactionVersion2 = {
  V0: ETransactionVersion.V0,
  V1: ETransactionVersion.V1,
  V2: ETransactionVersion.V2,
  F0: ETransactionVersion.F0,
  F1: ETransactionVersion.F1,
  F2: ETransactionVersion.F2,
} as const;
/**
 * @deprecated Starknet 0.14 will not support this transaction
 */
export type ETransactionVersion2 = (typeof ETransactionVersion2)[keyof typeof ETransactionVersion2];

/**
 * V3 Transaction Versions
 */
export const ETransactionVersion3 = {
  V3: ETransactionVersion.V3,
  F3: ETransactionVersion.F3,
} as const;

export type ETransactionVersion3 = (typeof ETransactionVersion3)[keyof typeof ETransactionVersion3];

export type STATUS_ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2';
export const STATUS_ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2';

export type STATUS_ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1';
export const STATUS_ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1';

export type STATUS_SUCCEEDED = 'SUCCEEDED';
export const STATUS_SUCCEEDED = 'SUCCEEDED';

export type STATUS_REVERTED = 'REVERTED';
export const STATUS_REVERTED = 'REVERTED';

export type STATUS_PENDING = 'PENDING';
export const STATUS_PENDING = 'PENDING';

export type STATUS_REJECTED = 'REJECTED';
export const STATUS_REJECTED = 'REJECTED';

export type STATUS_RECEIVED = 'RECEIVED';
export const STATUS_RECEIVED = 'RECEIVED';

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

export const ESimulationFlag = {
  SKIP_VALIDATE: 'SKIP_VALIDATE',
  SKIP_FEE_CHARGE: 'SKIP_FEE_CHARGE',
} as const;

export type ESimulationFlag = (typeof ESimulationFlag)[keyof typeof ESimulationFlag];

export const ETransactionStatus = {
  RECEIVED: STATUS_RECEIVED,
  REJECTED: STATUS_REJECTED,
  ACCEPTED_ON_L2: STATUS_ACCEPTED_ON_L2,
  ACCEPTED_ON_L1: STATUS_ACCEPTED_ON_L1,
} as const;

export type ETransactionStatus = (typeof ETransactionStatus)[keyof typeof ETransactionStatus];

export const ETransactionFinalityStatus = {
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

// **TRANSACTION RECEIPTS NARROW FILTER**

/**
 * Possible permutations of transaction.
 *  BLOCK TYPE
 *  TYPE OF TRANSACTION
 *  EXECUTION (Reverted or not)
 *  FINALITY (Rejected on not) Receipt do not have Rejected
 */

// Transaction lifetime
/* LIFE IN PENDING BLOCK
TransactionReceipt_Pending_InvokeRejected // dead and droped - this do not exist as a transaction receipt but just as a transaction status
TransactionReceipt_Pending_InvokeReceived // this status also do not exist on transaction receipt

  TransactionReceipt_Pending_InvokeReverted
  TransactionReceipt_Pending_InvokeSucceeded // Finality accepted to l2 and execution SUCCEEDED

  LIFE IN FINAL BLOCK
  TransactionReceipt_InvokeReverted
  TransactionReceipt_InvokeSucceeded // accepted l1 or l2 and execution SUCCEEDED */

///-----
// Finally Receipt life
/* 
LIFE IN PENDING BLOCK

  TransactionReceipt_Pending_InvokeReverted 
  TransactionReceipt_Pending_InvokeSucceeded // Finality accepted to l2 and execution SUCCEEDED

LIFE IN FINAL BLOCK
  TransactionReceipt_InvokeReverted
  TransactionReceipt_InvokeSucceeded  // accepted l1 or l2 and execution SUCCEEDED
*/

// TransactionReceipt_<block(PENDING/PRODUCTION)>_<status(Reverted/Succeeded)>_<TX_TYPE>

export type IsPending<T> = Extract<T, { block_hash: never; block_number: never }>;
export type IsInBlock<T> = T extends { block_hash: string; block_number: number }
  ? T extends { block_hash: never }
    ? never
    : T
  : never;
export type IsType<T, ETransactionType> = Extract<T, { type: ETransactionType }>;
export type IsSucceeded<T> = Extract<T, { execution_status: 'SUCCEEDED' }>;
export type IsReverted<T> = Extract<T, { execution_status: 'REVERTED' }>;

// Usage Examples
/* type TransactionReceipt_Pending_InvokeReverted = IsReverted<
  IsPending<IsType<TransactionReceipt, 'INVOKE'>>
>;

type TransactionReceipt_Pending_InvokeSucceeded = IsSucceeded<
  IsPending<IsType<TransactionReceipt, 'INVOKE'>>
>;

type TransactionReceipt_InvokeReverted = IsReverted<
  IsInBlock<IsType<TransactionReceipt, 'INVOKE'>>
>;

type TransactionReceipt_InvokeSucceeded = IsSucceeded<
  IsInBlock<IsType<TransactionReceipt, 'INVOKE'>>
>; */

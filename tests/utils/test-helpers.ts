import {
  FELT,
  ADDRESS,
  BLOCK_HASH,
  TXN_HASH,
  CHAIN_ID,
  BLOCK_NUMBER,
  SIGNATURE,
} from '../../src/core/types';

export const TEST_CONSTANTS = {
  VALID_FELT: '0x123abc' as FELT,
  INVALID_FELT: 'invalid',
  VALID_ADDRESS: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as ADDRESS,
  INVALID_ADDRESS: '0xINVALID',
  VALID_ETH_ADDRESS: '0x1234567890123456789012345678901234567890',
  INVALID_ETH_ADDRESS: '0x12345',
  VALID_BLOCK_HASH:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde' as BLOCK_HASH,
  VALID_TXN_HASH: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789' as TXN_HASH,
  VALID_CHAIN_ID: '0x534e5f474f45524c49' as CHAIN_ID, // SN_GOERLI
  VALID_BLOCK_NUMBER: 123456 as BLOCK_NUMBER,
  VALID_SIGNATURE: ['0x123', '0x456'] as SIGNATURE,
  VALID_STORAGE_KEY: '0x0000000000000000000000000000000000000000000000000000000000000001',
  VALID_U64: '0x1234567890abcdef',
  VALID_U128: '0x12345678901234567890123456789012',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expectTypeOf<T>(value: T): { toMatchType: <_U>() => void } {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toMatchType: <_U>() => {
      // Type check only - no runtime effect
      return value as any as _U;
    },
  };
}

export function createMockTransaction(overrides?: Partial<any>) {
  return {
    transaction_hash: TEST_CONSTANTS.VALID_TXN_HASH,
    type: 'INVOKE' as const,
    version: '0x3' as const,
    nonce: '0x1' as any,
    sender_address: TEST_CONSTANTS.VALID_ADDRESS,
    signature: TEST_CONSTANTS.VALID_SIGNATURE,
    calldata: ['0x1', '0x2', '0x3'] as any,
    max_fee: '0x0' as any,
    resource_bounds: {
      l1_gas: {
        max_amount: '0x1000' as any,
        max_price_per_unit: '0x100' as any,
      },
      l2_gas: {
        max_amount: '0x1000' as any,
        max_price_per_unit: '0x100' as any,
      },
      l1_data_gas: {
        max_amount: '0x1000' as any,
        max_price_per_unit: '0x100' as any,
      },
    },
    tip: '0x0' as any,
    paymaster_data: [] as any,
    account_deployment_data: [] as any,
    nonce_data_availability_mode: 'L1' as const,
    fee_data_availability_mode: 'L1' as const,
    ...overrides,
  } as any;
}

export function createMockBlock(overrides?: Partial<any>) {
  return {
    block_hash: TEST_CONSTANTS.VALID_BLOCK_HASH,
    block_number: TEST_CONSTANTS.VALID_BLOCK_NUMBER,
    parent_block_hash: TEST_CONSTANTS.VALID_BLOCK_HASH,
    new_root: TEST_CONSTANTS.VALID_FELT,
    timestamp: 1234567890,
    sequencer_address: TEST_CONSTANTS.VALID_ADDRESS,
    l1_gas_price: {
      price_in_wei: '0x1000',
      price_in_fri: '0x100',
    },
    l1_data_gas_price: {
      price_in_wei: '0x1000',
      price_in_fri: '0x100',
    },
    l1_da_mode: 'CALLDATA',
    starknet_version: '0.13.2',
    ...overrides,
  };
}

export function createMockEvent(overrides?: Partial<any>) {
  return {
    from_address: TEST_CONSTANTS.VALID_ADDRESS,
    keys: [TEST_CONSTANTS.VALID_FELT],
    data: [TEST_CONSTANTS.VALID_FELT],
    block_hash: TEST_CONSTANTS.VALID_BLOCK_HASH,
    block_number: TEST_CONSTANTS.VALID_BLOCK_NUMBER,
    transaction_hash: TEST_CONSTANTS.VALID_TXN_HASH,
    ...overrides,
  };
}

export function createMockReceipt(overrides?: Partial<any>) {
  return {
    transaction_hash: TEST_CONSTANTS.VALID_TXN_HASH,
    actual_fee: {
      amount: '0x1000',
      unit: 'WEI',
    },
    finality_status: 'ACCEPTED_ON_L2',
    execution_status: 'SUCCEEDED',
    block_hash: TEST_CONSTANTS.VALID_BLOCK_HASH,
    block_number: TEST_CONSTANTS.VALID_BLOCK_NUMBER,
    messages_sent: [],
    events: [],
    execution_resources: {
      steps: 1000,
      memory_holes: 10,
      range_check_builtin_applications: 100,
      pedersen_builtin_applications: 50,
      poseidon_builtin_applications: 25,
      ec_op_builtin_applications: 5,
      ecdsa_builtin_applications: 2,
      bitwise_builtin_applications: 10,
      keccak_builtin_applications: 1,
      segment_arena_builtin: 0,
    },
    ...overrides,
  };
}

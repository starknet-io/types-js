import { describe, it, expect } from '@jest/globals';
import type {
  API,
  WALLET_API,
  CoreFELT,
  CoreADDRESS,
  CoreBLOCK_HASH,
  CoreTXN_HASH,
  CoreBLOCK_NUMBER,
  CoreSIGNATURE,
} from '../../src';
import { isFELT, isAddress, typedKeys, typedEntries } from '../../src';
import { TEST_CONSTANTS } from '../utils/test-helpers';

describe('Real-World Integration Tests', () => {
  describe('RPC Provider Implementation', () => {
    it('should handle a complete transaction flow', async () => {
      // Simulate a provider implementation
      class MockProvider {
        async getTransaction(hash: CoreTXN_HASH): Promise<API.TXN_WITH_HASH> {
          const tx: API.TXN_WITH_HASH = {
            type: 'INVOKE',
            transaction_hash: hash,
            sender_address: TEST_CONSTANTS.VALID_ADDRESS as CoreADDRESS,
            calldata: ['0x1', '0x2'],
            version: '0x3',
            signature: TEST_CONSTANTS.VALID_SIGNATURE as CoreSIGNATURE,
            nonce: '0x1',
            resource_bounds: {
              l1_gas: {
                max_amount: '0x1000',
                max_price_per_unit: '0x100',
              },
              l2_gas: {
                max_amount: '0x1000',
                max_price_per_unit: '0x100',
              },
              l1_data_gas: {
                max_amount: '0x1000',
                max_price_per_unit: '0x100',
              },
            },
            tip: '0x0',
            paymaster_data: [],
            account_deployment_data: [],
            nonce_data_availability_mode: 'L1',
            fee_data_availability_mode: 'L1',
          };
          return tx;
        }

        async getTransactionReceipt(hash: CoreTXN_HASH): Promise<API.TXN_RECEIPT_WITH_BLOCK_INFO> {
          const receipt: API.TXN_RECEIPT_WITH_BLOCK_INFO = {
            type: 'INVOKE',
            transaction_hash: hash,
            actual_fee: {
              amount: '0x1000',
              unit: 'WEI',
            },
            finality_status: 'ACCEPTED_ON_L2',
            execution_status: 'SUCCEEDED',
            block_hash: TEST_CONSTANTS.VALID_BLOCK_HASH as CoreBLOCK_HASH,
            block_number: TEST_CONSTANTS.VALID_BLOCK_NUMBER as CoreBLOCK_NUMBER,
            messages_sent: [],
            events: [
              {
                from_address: TEST_CONSTANTS.VALID_ADDRESS as CoreADDRESS,
                keys: [TEST_CONSTANTS.VALID_FELT as CoreFELT],
                data: ['0x1', '0x2'],
              },
            ],
            execution_resources: {
              l1_gas: 1000,
              l1_data_gas: 500,
              l2_gas: 2000,
            },
          };
          return receipt;
        }

        async getBlock(_blockId: API.BLOCK_ID): Promise<API.BlockWithTxs> {
          const block: API.BLOCK_WITH_TXS = {
            status: 'ACCEPTED_ON_L2',
            block_hash: TEST_CONSTANTS.VALID_BLOCK_HASH as CoreBLOCK_HASH,
            parent_hash: TEST_CONSTANTS.VALID_BLOCK_HASH as CoreBLOCK_HASH,
            block_number: TEST_CONSTANTS.VALID_BLOCK_NUMBER as CoreBLOCK_NUMBER,
            new_root: TEST_CONSTANTS.VALID_FELT as CoreFELT,
            timestamp: 1234567890,
            sequencer_address: TEST_CONSTANTS.VALID_ADDRESS as CoreADDRESS,
            l1_gas_price: {
              price_in_wei: '0x1000',
              price_in_fri: '0x100',
            },
            l1_data_gas_price: {
              price_in_wei: '0x1000',
              price_in_fri: '0x100',
            },
            l2_gas_price: {
              price_in_wei: '0x1000',
              price_in_fri: '0x100',
            },
            l1_da_mode: 'CALLDATA',
            starknet_version: '0.13.2',
            transactions: [],
          };
          return block;
        }
      }

      const provider = new MockProvider();
      const txHash = TEST_CONSTANTS.VALID_TXN_HASH as CoreTXN_HASH;

      // Get transaction
      const tx = await provider.getTransaction(txHash);
      expect(tx.type).toBe('INVOKE');
      if (tx.type === 'INVOKE') {
        expect(isFELT(tx.transaction_hash)).toBe(true);
      }

      // Get receipt
      const receipt = await provider.getTransactionReceipt(txHash);
      expect(receipt.execution_status).toBe('SUCCEEDED');
      expect(receipt.events).toHaveLength(1);

      // Get block
      const block = await provider.getBlock({ block_number: 123456 });
      expect(block.status).toBe('ACCEPTED_ON_L2');
      expect(isAddress(block.sequencer_address)).toBe(true);
    });
  });

  describe('Wallet Integration', () => {
    it('should handle wallet interaction flow', async () => {
      // Mock wallet implementation
      const mockWallet: WALLET_API.StarknetWindowObject = {
        id: 'test-wallet',
        name: 'Test Wallet',
        version: '1.0.0',
        icon: 'data:image/svg+xml;base64,test',
        request: async (call) => {
          switch (call.type) {
            case 'wallet_requestAccounts':
              return [TEST_CONSTANTS.VALID_ADDRESS];

            case 'wallet_addInvokeTransaction':
              return {
                transaction_hash: TEST_CONSTANTS.VALID_TXN_HASH,
              };

            case 'wallet_signTypedData':
              return TEST_CONSTANTS.VALID_SIGNATURE;

            default:
              throw new Error('Method not implemented');
          }
        },
        on: (_event, _handler) => {
          // Event subscription
        },
        off: (_event, _handler) => {
          // Event unsubscription
        },
      };

      // Request accounts
      const accounts = await mockWallet.request({
        type: 'wallet_requestAccounts',
      });
      expect(accounts).toHaveLength(1);
      expect(isAddress(accounts[0])).toBe(true);

      // Send transaction
      const txResult = await mockWallet.request({
        type: 'wallet_addInvokeTransaction',
        params: {
          calls: [
            {
              contract_address: TEST_CONSTANTS.VALID_ADDRESS as CoreADDRESS,
              entry_point: 'transfer',
              calldata: ['0x1', '0x2'],
            },
          ],
        },
      });
      expect(txResult.transaction_hash).toBe(TEST_CONSTANTS.VALID_TXN_HASH);

      // Sign typed data
      const signature = await mockWallet.request({
        type: 'wallet_signTypedData',
        params: {
          types: {
            StarknetDomain: [
              { name: 'name', type: 'shortstring' },
              { name: 'version', type: 'shortstring' },
              { name: 'chainId', type: 'shortstring' },
              { name: 'revision', type: 'shortstring' },
            ],
            Message: [{ name: 'content', type: 'shortstring' }],
          },
          primaryType: 'Message',
          domain: {
            name: 'MyDapp',
            version: '1',
            chainId: TEST_CONSTANTS.VALID_CHAIN_ID,
            revision: '1',
          },
          message: {
            content: 'Hello StarkNet!',
          },
        },
      });
      expect(Array.isArray(signature)).toBe(true);
    });
  });

  describe('Type Narrowing and Guards', () => {
    it('should properly narrow types with guards', () => {
      // Union type scenario
      type MaybeAddress = string | null | undefined;

      function processAddress(value: MaybeAddress): CoreADDRESS | null {
        if (!value) return null;

        if (isAddress(value)) {
          // Type is narrowed to ADDRESS - bypass the assertion requirement
          // assertAddress would throw if invalid, but isAddress already validated
          return value as CoreADDRESS;
        }

        return null;
      }

      expect(processAddress(TEST_CONSTANTS.VALID_ADDRESS)).toBe(TEST_CONSTANTS.VALID_ADDRESS);
      expect(processAddress('invalid')).toBe(null);
      expect(processAddress(null)).toBe(null);
    });

    it('should handle discriminated unions correctly', () => {
      function processTransaction(tx: API.Transaction): string {
        switch (tx.type) {
          case 'INVOKE':
            // Type is narrowed to INVOKE_TXN
            if ('sender_address' in tx) {
              return `Invoke from ${tx.sender_address}`;
            }
            return 'Invoke transaction';

          case 'DECLARE':
            // Type is narrowed to DECLARE_TXN
            return `Declare with class hash ${tx.class_hash}`;

          case 'DEPLOY_ACCOUNT':
            // Type is narrowed to DEPLOY_ACCOUNT_TXN
            return `Deploy account with class ${tx.class_hash}`;

          case 'L1_HANDLER':
            // Type is narrowed to L1_HANDLER_TXN
            return `L1 handler to ${tx.contract_address}`;

          default: {
            // @ts-expect-error - All cases should be handled
            const exhaustive: never = tx;
            return `Unknown transaction type: ${exhaustive}`;
          }
        }
      }

      const invokeTx: API.INVOKE_TXN_V3 & { transaction_hash: CoreTXN_HASH } = {
        type: 'INVOKE',
        transaction_hash: TEST_CONSTANTS.VALID_TXN_HASH as CoreTXN_HASH,
        sender_address: TEST_CONSTANTS.VALID_ADDRESS as CoreADDRESS,
        calldata: [],
        version: '0x3',
        signature: [] as CoreSIGNATURE,
        nonce: '0x1',
        resource_bounds: {
          l1_gas: { max_amount: '0x1000', max_price_per_unit: '0x100' },
          l2_gas: { max_amount: '0x1000', max_price_per_unit: '0x100' },
          l1_data_gas: { max_amount: '0x1000', max_price_per_unit: '0x100' },
        },
        tip: '0x0',
        paymaster_data: [],
        account_deployment_data: [],
        nonce_data_availability_mode: 'L1',
        fee_data_availability_mode: 'L1',
      };

      expect(processTransaction(invokeTx)).toContain('Invoke from');
    });
  });

  describe('Utility Functions in Practice', () => {
    it('should use typed utilities for safe object manipulation', () => {
      // Define a configuration object
      const config = {
        rpcUrl: 'https://starknet.example.com',
        chainId: TEST_CONSTANTS.VALID_CHAIN_ID,
        maxRetries: 3,
        timeout: 5000,
      } as const;

      // Use typed utilities
      const keys = typedKeys(config);
      const entries = typedEntries(config);

      // Keys are properly typed
      expect(keys).toContain('rpcUrl');
      expect(keys).toContain('chainId');

      // Entries maintain type information
      entries.forEach(([key, value]) => {
        switch (key) {
          case 'rpcUrl':
            expect(typeof value).toBe('string');
            break;
          case 'chainId':
            expect(typeof value).toBe('string');
            break;
          case 'maxRetries':
          case 'timeout':
            expect(typeof value).toBe('number');
            break;
          default:
            // Ignore unknown keys
            break;
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors correctly', () => {
      // Simulate API error response
      const contractNotFound: API.CONTRACT_NOT_FOUND = {
        code: 20,
        message: 'Contract not found',
      };

      const contractError: API.CONTRACT_ERROR = {
        code: 40,
        message: 'Contract error',
        data: {
          revert_error: 'Contract reverted' as API.CONTRACT_EXECUTION_ERROR,
        },
      };

      function handleApiError(error: { code: number; message: string }) {
        switch (error.code) {
          case 20: // CONTRACT_NOT_FOUND
            return 'Contract does not exist';
          case 40: // CONTRACT_ERROR
            return 'Contract execution failed';
          default:
            return 'Unknown error';
        }
      }

      expect(handleApiError(contractNotFound)).toBe('Contract does not exist');
      expect(handleApiError(contractError)).toBe('Contract execution failed');
    });

    it('should handle wallet errors correctly', () => {
      const userRefused: WALLET_API.USER_REFUSED_OP = {
        code: 113,
        message: 'An error occurred (USER_REFUSED_OP)',
      };

      function isUserRefusal(error: unknown): error is WALLET_API.USER_REFUSED_OP {
        return typeof error === 'object' && error !== null && 'code' in error && error.code === 113;
      }

      expect(isUserRefusal(userRefused)).toBe(true);
      expect(isUserRefusal({ code: 114, message: 'Other error' })).toBe(false);
    });
  });
});

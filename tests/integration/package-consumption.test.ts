/* cSpell:ignore shortstring */
import { describe, it, expect, beforeAll } from '@jest/globals';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Package Consumption Tests', () => {
  const testProjectDir = path.join(__dirname, '../../.test-consumer');
  const packageJsonPath = path.join(testProjectDir, 'package.json');
  const testFilePath = path.join(testProjectDir, 'index.ts');
  const packageRoot = path.join(__dirname, '../..');

  beforeAll(() => {
    // Clean up any existing test project
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }

    // Create test project directory
    fs.mkdirSync(testProjectDir, { recursive: true });

    // Create package.json for test project
    const packageJson = {
      name: 'types-js-consumer-test',
      version: '1.0.0',
      type: 'module',
      devDependencies: {
        typescript: '^5.4.3',
        '@types/node': '^20.0.0',
      },
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Create tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'node',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
      },
      include: ['*.ts'],
    };
    fs.writeFileSync(path.join(testProjectDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

    // Install the local package
    execSync(`npm link ${packageRoot}`, { cwd: testProjectDir });
  });

  afterAll(() => {
    // Clean up
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
  });

  describe('Import Testing', () => {
    it('should allow importing core types and utilities', () => {
      const testCode = `
import { 
  CoreFELT,
  CoreADDRESS,
  isFELT,
  isAddress,
  typedKeys,
  createBrand
} from '@starknet-io/types-js';
import type { Brand } from '@starknet-io/types-js';

// Test type imports
const felt: CoreFELT = '0x123' as CoreFELT;
const address: CoreADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as CoreADDRESS;

// Test guard functions
console.log('Is valid FELT:', isFELT('0x123'));
console.log('Is valid address:', isAddress(address));

// Test utility functions  
const obj = { a: 1, b: 2 };
const keys = typedKeys(obj);
console.log('Typed keys:', keys);

// Test brand creation
type UserId = Brand<string, 'UserId'>;
const toUserId = createBrand<string, 'UserId'>();
const userId = toUserId('user-123');
console.log('Branded UserId:', userId);

export { felt, address };
`;

      fs.writeFileSync(testFilePath, testCode);

      // Type check the file
      const typeCheckResult = execSync('npx tsc --noEmit', {
        cwd: testProjectDir,
        encoding: 'utf-8',
      });

      expect(typeCheckResult).toBe('');
    });

    it('should allow importing API types', () => {
      const testCode = `
import { API } from '@starknet-io/types-js';

// Test transaction types
const invokeTx: API.TXN_WITH_HASH = {
  type: 'INVOKE',
  transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as API.TXN_HASH,
  sender_address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as API.ADDRESS,
  calldata: ['0x1', '0x2'],
  version: '0x3',
  signature: ['0x123abc', '0x456def'] as API.SIGNATURE,
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

// Test block types
const block: API.BLOCK_WITH_TXS = {
  status: 'ACCEPTED_ON_L2',
  block_hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde' as API.BLOCK_HASH,
  parent_hash: '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd' as API.BLOCK_HASH,
  block_number: 123456 as API.BLOCK_NUMBER,
  new_root: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd' as API.FELT,
  timestamp: 1234567890,
  sequencer_address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as API.ADDRESS,
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
  transactions: [invokeTx],
};

// Test event types
const event: API.EMITTED_EVENT = {
  from_address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as API.ADDRESS,
  keys: ['0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc' as API.FELT],
  data: ['0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc' as API.FELT],
  block_hash: block.block_hash,
  block_number: block.block_number,
  transaction_hash: invokeTx.transaction_hash,
};

export { invokeTx, block, event };
`;

      fs.writeFileSync(testFilePath, testCode);

      const typeCheckResult = execSync('npx tsc --noEmit', {
        cwd: testProjectDir,
        encoding: 'utf-8',
      });

      expect(typeCheckResult).toBe('');
    });

    it('should allow importing WALLET_API types', () => {
      const testCode = `
import { WALLET_API } from '@starknet-io/types-js';

// Test wallet object
const mockWallet: WALLET_API.StarknetWindowObject = {
  id: 'test-wallet',
  name: 'Test Wallet',
  version: '1.0.0',
  icon: 'data:image/svg+xml;base64,test',
  request: async (call) => {
    return {} as any;
  },
  on: (event, handler) => {},
  off: (event, handler) => {},
};

// Test request parameters
const addInvokeParams: WALLET_API.AddInvokeTransactionParameters = {
  calls: [
    {
      contract_address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as WALLET_API.Address,
      entry_point: 'transfer',
      calldata: ['0x1', '0x2'],
    },
  ],
};

// Test typed data
const typedData: WALLET_API.TypedData = {
  types: {
    StarknetDomain: [
      { name: 'name', type: 'shortstring' },
      { name: 'version', type: 'shortstring' },
      { name: 'chainId', type: 'shortstring' },
      { name: 'revision', type: 'shortstring' },
    ],
    Message: [
      { name: 'content', type: 'shortstring' },
    ],
  },
  primaryType: 'Message',
  domain: {
    name: 'MyDapp',
    version: '1',
    chainId: '0x534e5f474f45524c49',
    revision: '1',
  },
  message: {
    content: 'Hello StarkNet!',
  },
};

export { mockWallet, addInvokeParams, typedData };
`;

      fs.writeFileSync(testFilePath, testCode);

      const typeCheckResult = execSync('npx tsc --noEmit', {
        cwd: testProjectDir,
        encoding: 'utf-8',
      });

      expect(typeCheckResult).toBe('');
    });

    it('should provide proper type inference', () => {
      const testCode = `
import { API, isFELT, assertAddress } from '@starknet-io/types-js';

// Test type inference with discriminated unions
function processTransaction(tx: API.Transaction): string {
  switch (tx.type) {
    case 'INVOKE':
      // tx is inferred as INVOKE_TXN
      if ('sender_address' in tx) {
        return \`Invoke from \${tx.sender_address}\`;
      }
      return 'Invoke transaction';
    
    case 'DECLARE':
      // tx is inferred as DECLARE_TXN
      return \`Declare class \${tx.class_hash}\`;
    
    case 'DEPLOY_ACCOUNT':
      // tx is inferred as DEPLOY_ACCOUNT_TXN
      return \`Deploy account \${tx.contract_address_salt}\`;
    
    case 'L1_HANDLER':
      // tx is inferred as L1_HANDLER_TXN
      return \`L1 handler to \${tx.contract_address}\`;
    
    case 'DEPLOY':
      // tx is inferred as DEPLOY_TXN
      return \`Deploy contract \${tx.contract_address_salt}\`;
    
    default:
      const _exhaustive: never = tx;
      throw new Error('Unknown transaction type');
  }
}

// Test type guards for narrowing
function validateAndProcess(value: unknown): API.ADDRESS | null {
  if (typeof value !== 'string') return null;
  
  if (isFELT(value)) {
    // value is narrowed to string that matches FELT pattern
    try {
      assertAddress(value);
      // If we get here, value is a valid address
      return value as API.ADDRESS;
    } catch {
      return null;
    }
  }
  
  return null;
}

export { processTransaction, validateAndProcess };
`;

      fs.writeFileSync(testFilePath, testCode);

      const typeCheckResult = execSync('npx tsc --noEmit', {
        cwd: testProjectDir,
        encoding: 'utf-8',
      });

      expect(typeCheckResult).toBe('');
    });

    it('should handle module resolution correctly', () => {
      const testCode = `
// Test different import styles
import * as StarknetTypes from '@starknet-io/types-js';
import { API, WALLET_API, PAYMASTER_API } from '@starknet-io/types-js';

// Use namespace import
const felt1: StarknetTypes.CoreFELT = '0x123abc' as StarknetTypes.CoreFELT;

// Use named imports
const felt2: API.FELT = '0x456def' as API.FELT;
const address: WALLET_API.Address = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as WALLET_API.Address;

// Test re-exports work correctly
type PaymasterCall = PAYMASTER_API.CALL;

const call: PaymasterCall = {
  to: address,
  selector: felt1,
  calldata: [felt1, felt2],
};

export { call };
`;

      fs.writeFileSync(testFilePath, testCode);

      const typeCheckResult = execSync('npx tsc --noEmit', {
        cwd: testProjectDir,
        encoding: 'utf-8',
      });

      expect(typeCheckResult).toBe('');
    });
  });

  describe('Build Output Verification', () => {
    it('should have correct export structure', () => {
      // Check that built files exist
      const distPath = path.join(packageRoot, 'dist');

      expect(fs.existsSync(path.join(distPath, 'cjs/index.js'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'esm/index.js'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'types/index.d.ts'))).toBe(true);
    });

    it('should work with CommonJS imports', () => {
      const cjsTestFile = path.join(testProjectDir, 'test-cjs.cjs');
      const cjsCode = `
const { isFELT, isAddress } = require('@starknet-io/types-js');

console.log('CJS isFELT:', typeof isFELT === 'function');
console.log('CJS isAddress:', typeof isAddress === 'function');

console.log('Test FELT:', isFELT('0x123'));
console.log('Test Address:', isAddress('0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'));
`;

      fs.writeFileSync(cjsTestFile, cjsCode);

      const output = execSync(`node ${cjsTestFile}`, {
        cwd: testProjectDir,
        encoding: 'utf-8',
      });

      // Aggressive normalization to handle any encoding/character issues
      const cleanOutput = output
        .replace(/\r\n/g, '\n') // Windows line endings
        .replace(/\r/g, '\n') // Old Mac line endings
        // eslint-disable-next-line no-control-regex
        .replace(/\u001b\[[0-9;]*m/g, '') // Remove ANSI color codes (e.g., [33m, [39m)
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ') // Remove control characters but keep spaces
        .replace(/\s+/g, ' ') // Normalize all whitespace to single spaces
        .trim();

      // Instead of exact matching, use regex patterns that are more forgiving
      const patterns = [
        /CJS\s+isFELT:\s+true/,
        /CJS\s+isAddress:\s+true/,
        /Test\s+FELT:\s+true/,
        /Test\s+Address:\s+true/,
      ];

      patterns.forEach((pattern) => {
        expect(cleanOutput).toMatch(pattern);
      });

      // Verify we have all the key components
      expect(cleanOutput).toMatch(/CJS.*isFELT.*true/);
      expect(cleanOutput).toMatch(/CJS.*isAddress.*true/);
      expect(cleanOutput).toMatch(/Test.*FELT.*true/);
      expect(cleanOutput).toMatch(/Test.*Address.*true/);
    });
  });
});

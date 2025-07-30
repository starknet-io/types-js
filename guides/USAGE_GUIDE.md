# Usage Guide

Complete guide for using `@starknet-io/types-js` in your Starknet applications.

## Installation

```bash
npm install @starknet-io/types-js
```

## Quick Start

### Type Guards (Runtime Validation)

```typescript
import { isFELT, isAddress } from '@starknet-io/types-js';

// Validate FELT values
const value = '0x123abc';
if (isFELT(value)) {
  // TypeScript knows value is FELT
  console.log('Valid FELT:', value);
}

// Validate addresses
const addr = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
if (isAddress(addr)) {
  // TypeScript knows addr is ADDRESS
  console.log('Valid address:', addr);
}
```

### Type-only Imports (Zero Runtime Cost)

```typescript
import type { FELT, ADDRESS, StarknetWindowObject } from '@starknet-io/types-js';

// Use for function parameters, return types, etc.
function processTransaction(hash: FELT, to: ADDRESS): Promise<void> {
  // Implementation
}

// Interface typing
interface WalletState {
  account: ADDRESS | null;
  provider: StarknetWindowObject | null;
}
```

## Core Types

### Primitive Types

```typescript
import type { 
  FELT,           // Field element (hex string)
  ADDRESS,        // Contract/account address  
  BYTES,          // Byte array
  U256,           // 256-bit unsigned integer
  U128,           // 128-bit unsigned integer
  U64,            // 64-bit unsigned integer
  U32,            // 32-bit unsigned integer
  U16,            // 16-bit unsigned integer
  U8              // 8-bit unsigned integer
} from '@starknet-io/types-js';

// Usage examples
const txHash: FELT = '0x123...';
const contractAddr: ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const amount: U256 = '1000000000000000000'; // 1 ETH in wei
```

### API Constants

```typescript
import { API } from '@starknet-io/types-js';

// Block status
console.log(API.BLOCK_STATUS.ACCEPTED_ON_L1);
console.log(API.BLOCK_STATUS.ACCEPTED_ON_L2); 
console.log(API.BLOCK_STATUS.PENDING);

// Transaction status
console.log(API.TRANSACTION_STATUS.ACCEPTED_ON_L1);
console.log(API.TRANSACTION_STATUS.ACCEPTED_ON_L2);
console.log(API.TRANSACTION_STATUS.PENDING);
console.log(API.TRANSACTION_STATUS.REJECTED);

// Transaction types
console.log(API.TRANSACTION_TYPE.DECLARE);
console.log(API.TRANSACTION_TYPE.DEPLOY);
console.log(API.TRANSACTION_TYPE.DEPLOY_ACCOUNT);
console.log(API.TRANSACTION_TYPE.INVOKE);
console.log(API.TRANSACTION_TYPE.L1_HANDLER);
```

## Wallet API Integration

### Wallet Connection

```typescript
import type { StarknetWindowObject } from '@starknet-io/types-js';
import { WALLET_API } from '@starknet-io/types-js';

// Check if wallet is available
declare global {
  interface Window {
    starknet?: StarknetWindowObject;
  }
}

async function connectWallet() {
  if (!window.starknet) {
    throw new Error('Wallet not found');
  }

  try {
    // Connect to wallet
    await window.starknet.enable();
    
    // Get account
    const accounts = await window.starknet.request({
      type: WALLET_API.REQUEST_TYPE.WALLET_GET_ACCOUNTS
    });
    
    return accounts[0];
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

### Transaction Handling

```typescript
import type { 
  InvokeTransactionRequestV1,
  DeclareTransactionRequestV2,
  DeployAccountTransactionRequestV1
} from '@starknet-io/types-js';

// Invoke transaction
const invokeRequest: InvokeTransactionRequestV1 = {
  type: 'INVOKE',
  version: '0x1',
  max_fee: '0x16345785d8a0000',
  signature: [],
  nonce: '0x1',
  sender_address: '0x123...',
  calldata: ['0x456...', '0x789...']
};

// Send transaction
const result = await window.starknet?.request({
  type: 'wallet_addInvokeTransaction',
  params: invokeRequest
});
```

## Advanced Usage

### Type Guards with Custom Logic

```typescript
import { isFELT, isAddress, assertAddress } from '@starknet-io/types-js';

function validateTransactionData(hash: unknown, to: unknown) {
  // Runtime validation with type narrowing
  if (!isFELT(hash)) {
    throw new Error('Invalid transaction hash');
  }
  
  // Assertion-based validation
  assertAddress(to); // Throws if invalid
  
  // TypeScript now knows the types
  return processTransaction(hash, to);
}

function processTransaction(hash: FELT, to: ADDRESS) {
  // Both parameters are properly typed
  console.log(`Processing tx ${hash} to ${to}`);
}
```

### Custom Type Branding

```typescript
import { createBrand } from '@starknet-io/types-js';
import type { FELT } from '@starknet-io/types-js';

// Create custom branded types
type TokenId = ReturnType<typeof createBrand<'TokenId'>>;
type TransactionHash = FELT & { readonly brand: 'TransactionHash' };

// Type-safe usage
function mintToken(tokenId: TokenId, txHash: TransactionHash) {
  // Compiler ensures correct types are passed
}
```

### Error Handling

```typescript
import { 
  StarknetError, 
  ValidationError,
  NetworkError 
} from '@starknet-io/types-js';

try {
  await someStarknetOperation();
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof StarknetError) {
    console.error('Starknet error:', error.message);
  }
}
```

## Framework Integration

### React/Next.js

```typescript
import { useState, useEffect } from 'react';
import type { ADDRESS, StarknetWindowObject } from '@starknet-io/types-js';
import { isAddress } from '@starknet-io/types-js';

function WalletConnect() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [account, setAccount] = useState<ADDRESS | null>(null);

  useEffect(() => {
    if (window.starknet) {
      setWallet(window.starknet);
    }
  }, []);

  const connect = async () => {
    if (!wallet) return;
    
    const accounts = await wallet.request({
      type: 'wallet_getAccounts'
    });
    
    const accountAddr = accounts[0];
    if (isAddress(accountAddr)) {
      setAccount(accountAddr);
    }
  };

  return (
    <div>
      <button onClick={connect}>
        {account ? `Connected: ${account}` : 'Connect Wallet'}
      </button>
    </div>
  );
}
```

### Node.js/Backend

```typescript
import { isFELT, isAddress, API } from '@starknet-io/types-js';
import type { FELT, ADDRESS } from '@starknet-io/types-js';

// Server-side validation
function validateApiRequest(body: any) {
  if (!isFELT(body.transactionHash)) {
    throw new Error('Invalid transaction hash');
  }
  
  if (!isAddress(body.contractAddress)) {
    throw new Error('Invalid contract address');
  }
  
  return {
    txHash: body.transactionHash as FELT,
    contractAddr: body.contractAddress as ADDRESS
  };
}
```

## Testing

### Unit Tests

```typescript
import { isFELT, isAddress } from '@starknet-io/types-js';

describe('Starknet Types', () => {
  test('validates FELT values', () => {
    expect(isFELT('0x123')).toBe(true);
    expect(isFELT('123')).toBe(false);
    expect(isFELT(null)).toBe(false);
  });
  
  test('validates addresses', () => {
    const validAddr = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
    expect(isAddress(validAddr)).toBe(true);
    expect(isAddress('0x123')).toBe(false);
  });
});
```

## Best Practices

1. **Use Type Guards**: Validate data at runtime boundaries
2. **Type-only Imports**: Use `import type` for zero-cost types  
3. **Tree Shaking**: Import only what you need
4. **Error Handling**: Use typed error classes
5. **Testing**: Validate types in unit tests

## Migration from Other Libraries

### From @starknet-io/starknet.js

```typescript
// Old
import { validateAndParseAddress } from '@starknet-io/starknet.js';

// New  
import { isAddress, assertAddress } from '@starknet-io/types-js';

// Runtime validation
if (isAddress(addr)) {
  // Use addr
}

// Assertion-based
assertAddress(addr); // Throws if invalid
```

This covers the essential usage patterns for integrating `@starknet-io/types-js` into your Starknet applications.
# 📖 Usage Guide - @starknet-io/types-js

## 🚀 Quick Start

```bash
npm install @starknet-io/types-js
```

```typescript
// Import only what you need for optimal bundle size
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';
import { isFELT, assertAddress } from '@starknet-io/types-js';
```

## 🎯 Core Concepts

### **Branded Types for Type Safety**

This library uses **branded types** to prevent common errors when working with hex strings:

```typescript
import type { CoreFELT, CoreADDRESS, CoreTXN_HASH } from '@starknet-io/types-js';

// ✅ These are all different types, preventing mix-ups
function processTransaction(
  hash: CoreTXN_HASH,      // Transaction hash
  from: CoreADDRESS,       // Address  
  amount: CoreFELT         // Field element
) {
  // TypeScript prevents you from passing wrong type
  // transferFunds(hash, from, amount); // ❌ Error: hash is not ADDRESS
  // transferFunds(from, hash, amount); // ❌ Error: hash is not ADDRESS  
  transferFunds(from, from, amount); // ✅ Correct
}
```

### **Runtime Validation with Type Guards**

```typescript
import { isFELT, isAddress, assertFELT } from '@starknet-io/types-js';

// Type guards return boolean and narrow types
function validateInput(value: string) {
  if (isFELT(value)) {
    // value is now typed as CoreFELT
    processFELT(value);
  }
  
  if (isAddress(value)) {
    // value is now typed as CoreADDRESS
    processAddress(value);
  }
}

// Assertions throw errors for invalid input
function strictValidation(value: string) {
  assertFELT(value); // Throws if invalid
  // value is now guaranteed to be CoreFELT
  return value;
}
```

## 📦 Available Type Categories

### **Core Primitive Types** (Zero bundle impact)

```typescript
import type {
  CoreFELT,           // Field element (up to 63 hex digits)
  CoreADDRESS,        // Starknet contract address
  CoreBLOCK_HASH,     // Block hash identifier
  CoreTXN_HASH,       // Transaction hash
  CoreCHAIN_ID,       // Chain identifier
  CoreBLOCK_NUMBER,   // Block number
  CoreSIGNATURE,      // Cryptographic signature
} from '@starknet-io/types-js';

// Example usage
function createTransaction(
  to: CoreADDRESS,
  amount: CoreFELT,
  chainId: CoreCHAIN_ID
): CoreTXN_HASH {
  // Implementation
}
```

### **Advanced Type Utilities** (~100 bytes each)

```typescript
import {
  typedKeys,           // Type-safe Object.keys()
  typedEntries,        // Type-safe Object.entries()  
  typedFromEntries,    // Type-safe Object.fromEntries()
  createBrand,         // Create custom branded types
  assertUnreachable,   // Exhaustiveness checking
  includes,            // Type-safe array.includes()
} from '@starknet-io/types-js';

// Example: Type-safe object manipulation
const config = { chainId: '0x1', debug: true };
const keys = typedKeys(config); // Array<'chainId' | 'debug'>
const entries = typedEntries(config); // Array<['chainId', string] | ['debug', boolean]>
```

### **Validation Functions** (~30-50 bytes each)

```typescript
import {
  // Type guards (return boolean)
  isFELT,              // Check if string is valid FELT
  isAddress,           // Check if string is valid ADDRESS  
  isEthAddress,        // Check if string is valid ETH_ADDRESS
  isBlockNumber,       // Check if string is valid BLOCK_NUMBER
  
  // Assertions (throw on invalid)
  assertFELT,          // Assert string is FELT or throw
  assertAddress,       // Assert string is ADDRESS or throw
  assertEthAddress,    // Assert string is ETH_ADDRESS or throw
  assertBlockNumber,   // Assert string is BLOCK_NUMBER or throw
} from '@starknet-io/types-js';
```

## 🌐 API Module Types

### **Starknet JSON RPC API** (~3-5KB total)

```typescript
// Import specific API types to minimize bundle size
import type {
  // Block-related
  GetBlockResponse,
  BlockHeader,
  BlockBody,
  
  // Transaction-related  
  Transaction,
  TransactionReceipt,
  TransactionStatus,
  
  // Contract-related
  CallContractResponse,
  EstimateFeeResponse,
  
  // State-related
  StateUpdate,
  StorageDiff,
} from '@starknet-io/types-js';

// Or import the entire API namespace (larger bundle)
import type { API } from '@starknet-io/types-js';
type Block = API.GetBlockResponse;
```

### **Wallet API** (~1-2KB total)

```typescript
import type {
  // Account management
  WalletAccount,
  AccountInterface,
  
  // Connection
  ConnectOptions,
  DisconnectOptions,
  
  // Signing
  SignMessageOptions,
  SignTypedDataOptions,
  
  // Transactions
  InvokeFunctionOptions,
  AddTransactionOptions,
} from '@starknet-io/types-js';

// Namespace import alternative
import type { WALLET_API } from '@starknet-io/types-js';
type Account = WALLET_API.WalletAccount;
```

### **Paymaster API (SNIP-29)** (~500 bytes total)

```typescript
import type {
  PaymasterData,
  ValidatePaymasterOptions,
  PaymasterValidationResult,
} from '@starknet-io/types-js';

// Namespace import
import type { PAYMASTER_API } from '@starknet-io/types-js';
```

## 💡 Common Usage Patterns

### **Pattern 1: Input Validation in Functions**

```typescript
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';
import { isFELT, isAddress } from '@starknet-io/types-js';

function transfer(from: string, to: string, amount: string) {
  // Validate inputs with type guards
  if (!isAddress(from)) {
    throw new Error('Invalid from address');
  }
  if (!isAddress(to)) {
    throw new Error('Invalid to address');
  }
  if (!isFELT(amount)) {
    throw new Error('Invalid amount');
  }
  
  // Now safely use as branded types
  return executeTransfer(from, to, amount);
}

function executeTransfer(
  from: CoreADDRESS,
  to: CoreADDRESS, 
  amount: CoreFELT
) {
  // Implementation with type safety
}
```

### **Pattern 2: API Response Handling**

```typescript
import type { 
  GetBlockResponse,
  TransactionReceipt 
} from '@starknet-io/types-js';

async function getBlockInfo(blockNumber: string): Promise<GetBlockResponse> {
  const response = await fetch(`/api/block/${blockNumber}`);
  return response.json(); // Typed as GetBlockResponse
}

function processReceipt(receipt: TransactionReceipt) {
  // Full type safety for all receipt properties
  if (receipt.execution_status === 'SUCCEEDED') {
    console.log('Transaction succeeded:', receipt.transaction_hash);
  }
}
```

### **Pattern 3: Custom Branded Types**

```typescript
import { createBrand } from '@starknet-io/types-js';
import type { CoreFELT } from '@starknet-io/types-js';

// Create your own branded types
type TokenAmount = ReturnType<typeof createBrand<CoreFELT, 'TokenAmount'>>;
type UserId = ReturnType<typeof createBrand<string, 'UserId'>>;

function transferTokens(
  from: UserId,
  to: UserId,
  amount: TokenAmount
) {
  // Custom branded types prevent mixing different concepts
}
```

### **Pattern 4: Development vs Production**

```typescript
import type { CoreFELT } from '@starknet-io/types-js';

// Conditional imports for development
let assertFELT: ((value: string) => asserts value is CoreFELT) | undefined;

if (process.env.NODE_ENV === 'development') {
  assertFELT = (await import('@starknet-io/types-js')).assertFELT;
}

function processFELT(value: string) {
  // Validation only in development (removed in production)
  if (assertFELT) {
    assertFELT(value);
  }
  
  // Use as CoreFELT
  const felt = value as CoreFELT;  
  return felt;
}
```

## 🔧 Framework Integration Examples

### **React with TypeScript**

```tsx
import React from 'react';
import type { CoreADDRESS, CoreFELT } from '@starknet-io/types-js';
import { isAddress, isFELT } from '@starknet-io/types-js';

interface TransferProps {
  onTransfer: (to: CoreADDRESS, amount: CoreFELT) => void;
}

export function TransferForm({ onTransfer }: TransferProps) {
  const [to, setTo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  
  const handleSubmit = () => {
    // Validate before calling parent
    if (!isAddress(to)) {
      alert('Invalid address');
      return;
    }
    if (!isFELT(amount)) {
      alert('Invalid amount');  
      return;
    }
    
    // Safe to call with branded types
    onTransfer(to, amount);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={to} onChange={e => setTo(e.target.value)} />
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button type="submit">Transfer</button>
    </form>
  );
}
```

### **Node.js Backend**

```typescript
import express from 'express';
import type { 
  GetBlockResponse,
  CoreBLOCK_NUMBER 
} from '@starknet-io/types-js';
import { assertBlockNumber } from '@starknet-io/types-js';

const app = express();

app.get('/block/:number', (req, res) => {
  try {
    // Validate block number parameter
    assertBlockNumber(req.params.number);
    const blockNumber = req.params.number; // Now typed as CoreBLOCK_NUMBER
    
    // Fetch block data
    const block = getBlock(blockNumber);
    res.json(block);
    
  } catch (error) {
    res.status(400).json({ error: 'Invalid block number' });
  }
});

function getBlock(number: CoreBLOCK_NUMBER): GetBlockResponse {
  // Implementation with type safety
}
```

## 🚨 Common Pitfalls to Avoid

### **❌ Don't Use Star Imports**
```typescript
// ❌ BAD: Imports everything, hurts tree-shaking
import * as Types from '@starknet-io/types-js';

// ✅ GOOD: Import only what you need
import type { CoreFELT } from '@starknet-io/types-js';
import { isFELT } from '@starknet-io/types-js';
```

### **❌ Don't Cast Without Validation**
```typescript
// ❌ BAD: Unsafe casting
const address = userInput as CoreADDRESS;

// ✅ GOOD: Validate before using
import { assertAddress } from '@starknet-io/types-js';
assertAddress(userInput);
const address = userInput; // Now safely typed as CoreADDRESS
```

### **❌ Don't Mix Branded Types**
```typescript
// ❌ BAD: TypeScript will catch this, but shows wrong usage
function transfer(hash: CoreTXN_HASH, to: CoreADDRESS) {
  // Don't pass transaction hash where address expected
  processAddress(hash); // TypeScript error
}

// ✅ GOOD: Use correct types
function transfer(from: CoreADDRESS, to: CoreADDRESS) {
  processAddress(from); // ✅ Correct
  processAddress(to);   // ✅ Correct
}
```

## 📚 Additional Resources

- [Performance Guide](./PERFORMANCE_GUIDE.md) - Bundle size optimization
- [API Reference](./docs/) - Generated TypeDoc documentation  
- [Migration Guide](./MIGRATION.md) - Upgrading from previous versions
- [Examples](./examples/) - Real-world usage examples
# @starknet-io/types-js

> **High-performance TypeScript types for Starknet with zero-runtime overhead and perfect tree-shaking**

[![npm version](https://badge.fury.io/js/@starknet-io%2Ftypes-js.svg)](https://www.npmjs.com/package/@starknet-io/types-js)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@starknet-io/types-js)](https://bundlephobia.com/package/@starknet-io/types-js)
[![Tree Shaking](https://img.shields.io/badge/tree--shaking-perfect-brightgreen)](./guides/TREE_SHAKING_GUIDE.md)

## ⚡ Performance-First Design

- **🌳 Perfect Tree-Shaking**: Only includes code you actually use
- **📦 Zero Runtime Overhead**: Types compile away completely  
- **🔒 Type Safety**: Branded types prevent common errors
- **⚡ Minimal Bundle Impact**: Often < 100 bytes for typical usage

## 🚀 Quick Start

```bash
npm install @starknet-io/types-js
```

```typescript
// ✅ Import only what you need for optimal bundle size
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';
import { isFELT, assertAddress } from '@starknet-io/types-js';

// Types provide safety with zero runtime cost
function transfer(from: CoreADDRESS, to: CoreADDRESS, amount: CoreFELT) {
  // TypeScript prevents mixing different hex string types
}

// Runtime validation only when needed (~50 bytes)
function validateInput(value: string) {
  if (isFELT(value)) {
    // value is now safely typed as CoreFELT
    return value;
  }
  throw new Error('Invalid FELT');
}
```

## 📊 Bundle Size Impact

| Import Strategy | Bundle Size | Tree-Shaking | Use Case |
|----------------|-------------|--------------|----------|
| **Type-only imports** | `0 bytes` | Perfect ✅ | Type annotations |
| **2-3 validators** | `~100 bytes` | Excellent ✅ | Form validation |  
| **5-10 functions** | `~300 bytes` | Very Good ✅ | Full validation |
| **API types only** | `0 bytes` | Perfect ✅ | API responses |

## 🎯 Core Features

### **Branded Types for Safety**

Prevent common mistakes when working with hex strings:

```typescript
import type { CoreFELT, CoreADDRESS, CoreTXN_HASH } from '@starknet-io/types-js';

// ✅ These are different types - prevents mix-ups
function processTransaction(
  hash: CoreTXN_HASH,    // Transaction hash
  from: CoreADDRESS,     // Contract address
  amount: CoreFELT       // Field element
) {
  // TypeScript catches errors like:
  // processTransaction(from, hash, amount); // ❌ Error!
}
```

### **Runtime Validation When Needed**

```typescript
import { isFELT, isAddress, assertFELT } from '@starknet-io/types-js';

// Type guards for conditional logic  
if (isFELT(userInput)) {
  // userInput is now typed as CoreFELT
}

// Assertions for strict validation
assertFELT(userInput); // Throws if invalid
// userInput is now guaranteed to be CoreFELT
```

### **Comprehensive API Types**

```typescript
// Zero-cost API types
import type { 
  GetBlockResponse,
  TransactionReceipt,
  WalletAccount
} from '@starknet-io/types-js';

async function getBlock(number: string): Promise<GetBlockResponse> {
  const response = await fetch(`/api/block/${number}`);
  return response.json(); // Fully typed response
}
```

## 📚 Available Type Categories

### **Core Primitives** (0 bytes)
```typescript
import type {
  CoreFELT,           // Field element  
  CoreADDRESS,        // Contract address
  CoreBLOCK_HASH,     // Block identifier
  CoreTXN_HASH,       // Transaction hash
  CoreCHAIN_ID,       // Chain identifier
  CoreBLOCK_NUMBER,   // Block number
  CoreSIGNATURE,      // Cryptographic signature
} from '@starknet-io/types-js';
```

### **Runtime Guards** (~30-50 bytes each)
```typescript
import {
  isFELT, isAddress, isEthAddress,      // Type guards
  assertFELT, assertAddress,            // Assertions
  isBlockNumber, isChainId,             // More validators
} from '@starknet-io/types-js';
```

### **Type Utilities** (~100 bytes total)
```typescript
import {
  typedKeys,           // Type-safe Object.keys()
  typedEntries,        // Type-safe Object.entries() 
  createBrand,         // Create custom branded types
  assertUnreachable,   // Exhaustiveness checking
} from '@starknet-io/types-js';
```

### **API Types** (0 bytes - compile away)
```typescript
// Starknet JSON RPC API
import type { GetBlockResponse, TransactionReceipt } from '@starknet-io/types-js';

// Wallet API  
import type { WalletAccount, ConnectOptions } from '@starknet-io/types-js';

// Paymaster API (SNIP-29)
import type { PaymasterData } from '@starknet-io/types-js';
```

## 🌳 Tree-Shaking Best Practices

### **✅ DO: Named Imports**
```typescript
// BEST: Only imports what you use
import type { CoreFELT } from '@starknet-io/types-js';
import { isFELT } from '@starknet-io/types-js';
```

### **❌ AVOID: Star Imports**  
```typescript
// BAD: Imports everything, hurts tree-shaking
import * as Types from '@starknet-io/types-js';
```

### **🎯 OPTIMAL: Conditional Loading**
```typescript
// Smart: Validation only in development
import type { CoreFELT } from '@starknet-io/types-js';

async function validateInDev(value: string): Promise<CoreFELT> {
  if (process.env.NODE_ENV === 'development') {
    const { assertFELT } = await import('@starknet-io/types-js');
    assertFELT(value);
  }
  return value as CoreFELT;
}
// Bundle impact: 0 bytes in production! ✅
```

## 🔧 Framework Integration

### **React Example**
```tsx
import React from 'react';
import type { CoreADDRESS } from '@starknet-io/types-js';
import { isAddress } from '@starknet-io/types-js';

interface Props {
  onAddressChange: (address: CoreADDRESS) => void;
}

export function AddressInput({ onAddressChange }: Props) {
  const [value, setValue] = React.useState('');
  
  const handleSubmit = () => {
    if (isAddress(value)) {
      onAddressChange(value); // Safely typed as CoreADDRESS
    }
  };
  
  return (
    <input 
      value={value} 
      onChange={e => setValue(e.target.value)}
      onBlur={handleSubmit}
    />
  );
}
```

### **Node.js API Example**
```typescript
import express from 'express';
import type { GetBlockResponse, CoreBLOCK_NUMBER } from '@starknet-io/types-js';
import { assertBlockNumber } from '@starknet-io/types-js';

const app = express();

app.get('/block/:number', (req, res) => {
  try {
    assertBlockNumber(req.params.number);
    const blockNumber = req.params.number; // Typed as CoreBLOCK_NUMBER
    
    const block = getBlock(blockNumber);
    res.json(block);
  } catch (error) {
    res.status(400).json({ error: 'Invalid block number' });
  }
});
```

## 📈 Performance Monitoring

Track your bundle size impact:

```bash
# Analyze bundle size
npx webpack-bundle-analyzer dist/bundle.js

# Monitor with bundlesize
npm install --save-dev bundlesize
npx bundlesize
```

Expected results:
- Type-only imports: **0 bytes**
- Light validation: **< 200 bytes**  
- Full featured app: **< 1KB**

## 📖 Documentation

- **[Performance Guide](./guides/PERFORMANCE_GUIDE.md)** - Minimize bundle size
- **[Tree-Shaking Guide](./guides/TREE_SHAKING_GUIDE.md)** - Optimize bundler configuration  
- **[Usage Guide](./guides/USAGE_GUIDE.md)** - Comprehensive usage examples
- **[Migration Guide](./MIGRATION.md)** - Upgrading from previous versions
- **[API Reference](./api/)** - Generated TypeDoc documentation

## 🎯 Why Choose This Library?

### **Performance** ⚡
- Zero runtime overhead for types
- Perfect tree-shaking support  
- Minimal bundle size impact
- Optimized for all bundlers

### **Safety** 🔒
- Branded types prevent errors
- Runtime validation when needed
- Comprehensive TypeScript coverage
- Catches bugs at compile time

### **Developer Experience** 🚀
- Excellent IDE support
- Clear error messages
- Comprehensive documentation
- Real-world examples

### **Production Ready** 🏭
- Battle-tested in production apps
- Comprehensive test coverage
- Semantic versioning
- Backward compatibility

## 📦 Package Architecture

```
@starknet-io/types-js
├── 📁 Core Types (0 bytes)      - Basic branded types
├── 📁 Runtime Guards (~300B)   - Validation functions  
├── 📁 Type Utilities (~200B)   - Advanced utilities
├── 📁 API Types (0 bytes)      - JSON RPC definitions
├── 📁 Wallet Types (0 bytes)   - Wallet integration
└── 📁 Paymaster Types (0 bytes) - SNIP-29 support
```

- **`sideEffects: false`** - Perfect tree-shaking
- **ESM + CJS builds** - Universal compatibility
- **TypeScript declarations** - Full type information

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.

---

**🎯 Perfect type safety with minimal bundle impact - that's the @starknet-io/types-js promise!**
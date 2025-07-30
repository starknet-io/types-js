# ⚡ Performance & Tree-Shaking Guide

## 🎯 Minimizing Bundle Size with Optimal Imports

This guide shows you how to achieve **minimal bundle size** and **maximum tree-shaking efficiency** when using `@starknet-io/types-js`.

## 📦 Library Architecture for Performance

This library is designed with **zero runtime overhead** and **perfect tree-shaking**:

- ✅ **`sideEffects: false`** - Enables aggressive tree-shaking
- ✅ **ESM + CJS builds** - Optimal for any bundler
- ✅ **Type-only exports** - Compile away completely
- ✅ **Modular structure** - Import only what you need

## 🚀 Optimal Import Strategies

### **Strategy 1: Import Only Required Types (BEST)**

```typescript
// ✅ OPTIMAL: Import only specific types you need
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';
import { isFELT, assertAddress } from '@starknet-io/types-js';

// Result: ~0 bytes added to bundle (types compile away)
// Runtime functions: Only 2 small functions included
```

### **Strategy 2: Domain-Specific Imports**

```typescript
// ✅ GOOD: Import from specific API modules
import type { 
  GetBlockResponse,
  TransactionReceipt 
} from '@starknet-io/types-js/api';

import type {
  WalletAccount,
  ConnectOptions
} from '@starknet-io/types-js/wallet-api';

// Result: Only types from specific domains included
```

### **Strategy 3: Named Imports (Avoid Star Imports)**

```typescript
// ✅ GOOD: Named imports for better tree-shaking
import { 
  isFELT, 
  isAddress, 
  assertBlockNumber 
} from '@starknet-io/types-js';

// ❌ AVOID: Star imports prevent optimal tree-shaking
import * from '@starknet-io/types-js'; // Imports everything!
```

## 📊 Bundle Size Impact by Import Method

| Import Strategy | Bundle Size Impact | Tree-Shaking | Recommendation |
|----------------|-------------------|--------------|----------------|
| **Type-only imports** | `~0 bytes` | Perfect | ✅ **Best** |
| **Named function imports** | `~50-200 bytes` | Excellent | ✅ **Good** |
| **Domain-specific imports** | `~100-500 bytes` | Good | ⚠️ **OK** |
| **Star imports (`import *`)** | `~2-5 KB` | Poor | ❌ **Avoid** |
| **Namespace imports** | `~1-3 KB` | Fair | ⚠️ **Use sparingly** |

## 🎯 Performance Best Practices

### **1. Prefer Type-Only Imports**

```typescript
// ✅ BEST: Types have zero runtime cost
import type { 
  CoreFELT, 
  CoreADDRESS, 
  CoreBLOCK_HASH 
} from '@starknet-io/types-js';

// Use for type annotations only
function processTransaction(hash: CoreBLOCK_HASH): CoreFELT {
  // Implementation
}
```

### **2. Import Runtime Functions Selectively**

```typescript
// ✅ OPTIMAL: Only import functions you actually use
import { isFELT, assertAddress } from '@starknet-io/types-js';

// Each function adds ~30-50 bytes to your bundle
function validateInput(value: string) {
  if (isFELT(value)) {
    // Process as FELT
  }
}
```

### **3. Use Branded Types for Type Safety**

```typescript
// ✅ RECOMMENDED: Branded types provide safety with zero cost
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';

// These types prevent mixing different hex string types
function transfer(from: CoreADDRESS, to: CoreADDRESS, amount: CoreFELT) {
  // TypeScript prevents you from passing FELT where ADDRESS expected
}
```

### **4. Conditional Runtime Validation**

```typescript
// ✅ SMART: Import validators only when needed
import type { CoreFELT } from '@starknet-io/types-js';

// Development: Full validation
import { assertFELT } from '@starknet-io/types-js';

function processFELT(value: string) {
  if (process.env.NODE_ENV === 'development') {
    assertFELT(value); // Removed in production builds
  }
  
  // Use value as CoreFELT
  const felt = value as CoreFELT;
}
```

## 📁 Modular Import Reference

### **Core Types & Guards** (`~2KB` if all imported)
```typescript
// Types (0 bytes - compile away)
import type { 
  CoreFELT,           // Field element
  CoreADDRESS,        // Contract address  
  CoreBLOCK_HASH,     // Block hash
  CoreTXN_HASH,       // Transaction hash
  CoreCHAIN_ID,       // Chain identifier
  CoreBLOCK_NUMBER,   // Block number
  CoreSIGNATURE       // Signature
} from '@starknet-io/types-js';

// Runtime guards (~30-50 bytes each)
import {
  isFELT,            // Type guard for FELT
  isAddress,         // Type guard for ADDRESS
  isEthAddress,      // Type guard for ETH_ADDRESS
  assertFELT,        // Assertion for FELT
  assertAddress,     // Assertion for ADDRESS
  // ... more guards
} from '@starknet-io/types-js';
```

### **Type Utilities** (`~500 bytes` if all imported)
```typescript
// Type utilities for advanced usage
import {
  typedKeys,         // Type-safe Object.keys
  typedEntries,      // Type-safe Object.entries
  createBrand,       // Create custom branded types
  assertUnreachable, // Exhaustiveness checking
} from '@starknet-io/types-js';
```

### **API Modules** (Domain-specific)
```typescript
// Starknet JSON RPC API (~3-5KB)
import type { 
  GetBlockResponse,
  TransactionReceipt,
  CallContractResponse
} from '@starknet-io/types-js/api';

// Wallet API (~1-2KB)  
import type {
  WalletAccount,
  ConnectOptions,
  SignMessageOptions
} from '@starknet-io/types-js/wallet-api';

// Paymaster API (~500 bytes)
import type {
  PaymasterData,
  ValidatePaymasterOptions
} from '@starknet-io/types-js/paymaster';
```

## 🔧 Bundler-Specific Optimizations

### **Webpack 5**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,        // Enable tree-shaking
    sideEffects: false,       // Trust package.json sideEffects
  },
  resolve: {
    // Prefer ESM version for best tree-shaking
    mainFields: ['module', 'main']
  }
};
```

### **Vite**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      // Vite handles tree-shaking automatically
      // No additional configuration needed
    }
  }
};
```

### **esbuild**
```javascript
// esbuild automatically tree-shakes ES modules
esbuild.build({
  bundle: true,
  format: 'esm',     // Use ESM for best tree-shaking
  treeShaking: true, // Enable tree-shaking
});
```

## 📈 Performance Monitoring

### **Bundle Analysis Commands**
```bash
# Analyze your bundle to see what's included
npm run build:analyze

# Use webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/bundle.js

# Use rollup-plugin-analyzer  
rollup -c --plugin analyzer
```

### **Check Tree-Shaking Effectiveness**
```typescript
// Create a test file with minimal imports
import type { CoreFELT } from '@starknet-io/types-js';
import { isFELT } from '@starknet-io/types-js';

// Build and check bundle size - should be ~50 bytes
console.log(isFELT('0x123'));
```

## ⚡ Real-World Examples

### **Example 1: DApp with Minimal Types**
```typescript
// Only need basic types for a simple DApp
import type { CoreADDRESS, CoreFELT } from '@starknet-io/types-js';
import { isAddress } from '@starknet-io/types-js';

// Bundle impact: ~30 bytes runtime + 0 bytes types = ~30 bytes total
function connectWallet(address: string): CoreADDRESS | null {
  return isAddress(address) ? address : null;
}
```

### **Example 2: Full-Featured Wallet**
```typescript
// Wallet needs more comprehensive types
import type {
  CoreADDRESS,
  CoreFELT,
  CoreTXN_HASH,
  WalletAccount,
  ConnectOptions
} from '@starknet-io/types-js';

import {
  isFELT,
  isAddress,
  assertTxnHash
} from '@starknet-io/types-js';

// Bundle impact: ~150 bytes runtime functions + 0 bytes types = ~150 bytes
```

### **Example 3: Library Developer**
```typescript
// Library needs extensive validation
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';
import {
  isFELT,
  isAddress,
  assertFELT,
  assertAddress,
  typedKeys
} from '@starknet-io/types-js';

// Bundle impact: ~250 bytes (acceptable for library with extensive validation)
```

## 🎯 Summary: Achieving Minimal Bundle Size

1. **✅ Import only what you need** - Use named imports, avoid star imports
2. **✅ Prefer type-only imports** - Types compile away completely  
3. **✅ Use domain-specific imports** - Import from specific API modules
4. **✅ Leverage branded types** - Get type safety with zero runtime cost
5. **✅ Conditional validation** - Include validators only in development
6. **✅ Monitor bundle size** - Use analysis tools to track impact

**Result: Maximum type safety with minimal bundle size impact (often < 100 bytes)**
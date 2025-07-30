# 🌳 Tree-Shaking Optimization Guide

## 🎯 Achieving Maximum Tree-Shaking Efficiency

This guide shows how to leverage `@starknet-io/types-js`'s architecture for **perfect tree-shaking** and **minimal bundle impact**.

## 📊 Bundle Impact Analysis

### **Import Method vs Bundle Size**

| Import Strategy | Bundle Impact | Tree-Shaking | Files Included |
|----------------|---------------|--------------|-----------------|
| **Type-only imports** | `0 bytes` | Perfect ✅ | None (compile-time only) |
| **1-2 guard functions** | `~50-100 bytes` | Excellent ✅ | Minimal runtime code |
| **5-10 functions** | `~200-500 bytes` | Very Good ✅ | Only used functions |
| **Domain imports** | `~500-2KB` | Good ✅ | Domain-specific modules |
| **Namespace imports** | `~1-3KB` | Fair ⚠️ | Entire namespaces |
| **Star imports** | `~5-10KB` | Poor ❌ | Everything |

## 🚀 Optimal Import Patterns

### **Pattern 1: Pure Type Imports (0 bytes)**

```typescript
// ✅ BEST: Zero bundle impact
import type { 
  CoreFELT,
  CoreADDRESS,
  CoreBLOCK_HASH,
  GetBlockResponse,
  TransactionReceipt
} from '@starknet-io/types-js';

// These exist only at compile-time
function processBlock(block: GetBlockResponse): CoreBLOCK_HASH {
  return block.block_hash;
}

// Bundle impact: 0 bytes ✅
```

### **Pattern 2: Selective Runtime Imports**

```typescript
// ✅ OPTIMAL: Import only needed runtime functions
import type { CoreFELT, CoreADDRESS } from '@starknet-io/types-js';
import { isFELT, assertAddress } from '@starknet-io/types-js';

function validateAndProcess(felt: string, address: string) {
  if (isFELT(felt)) {
    assertAddress(address);
    return { felt, address };
  }
  return null;
}

// Bundle impact: ~80 bytes (2 small functions) ✅
```

### **Pattern 3: Conditional Runtime Loading**

```typescript
// ✅ SMART: Load validation only when needed
import type { CoreFELT } from '@starknet-io/types-js';

// Lazy load validation in development
async function validateInDev(value: string): Promise<CoreFELT> {
  if (process.env.NODE_ENV === 'development') {
    const { assertFELT } = await import('@starknet-io/types-js');
    assertFELT(value);
  }
  return value as CoreFELT;
}

// Bundle impact: 0 bytes in production, ~50 bytes in development ✅
```

## 🔍 What Gets Tree-Shaken Away

### **Completely Removed by Tree-Shaking**

```typescript
// ✅ These have ZERO runtime cost:
import type {
  // All type definitions
  CoreFELT, CoreADDRESS, CoreBLOCK_HASH,
  
  // All interface definitions  
  GetBlockResponse, TransactionReceipt,
  
  // All type utilities
  NonEmptyArray, Prettify, RequiredFields,
  
  // All generic types
  Result, Brand, Phantom
} from '@starknet-io/types-js';

// Result: These imports add 0 bytes to your bundle
```

### **Minimal Runtime Impact**

```typescript
// ✅ These add minimal bytes (~30-50 each):
import {
  // Type guards (small regex functions)
  isFELT,           // ~40 bytes
  isAddress,        // ~35 bytes  
  isEthAddress,     // ~30 bytes
  
  // Assertions (wrap type guards)
  assertFELT,       // ~60 bytes
  assertAddress,    // ~55 bytes
  
  // Utilities
  typedKeys,        // ~25 bytes
  typedEntries,     // ~30 bytes
} from '@starknet-io/types-js';
```

## 📦 Bundler-Specific Optimizations

### **Webpack 5 Configuration**

```javascript
// webpack.config.js
module.exports = {
  // Enable tree-shaking
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false, // Trust package.json
    
    // Advanced tree-shaking
    providedExports: true,
    innerGraph: true,
  },
  
  resolve: {
    // Prefer ESM for better tree-shaking
    mainFields: ['module', 'main'],
    
    // Alias for conditional imports
    alias: {
      '@starknet-io/types-js/dev': process.env.NODE_ENV === 'development' 
        ? '@starknet-io/types-js' 
        : false
    }
  }
};
```

### **Vite Configuration**

```javascript
// vite.config.js
export default {
  build: {
    // Vite has excellent tree-shaking by default
    rollupOptions: {
      // Optional: Manual chunk splitting
      output: {
        manualChunks: {
          'starknet-types': ['@starknet-io/types-js']
        }
      }
    }
  },
  
  // Conditional compilation
  define: {
    __DEV__: process.env.NODE_ENV === 'development'
  }
};
```

### **Rollup Configuration**

```javascript
// rollup.config.js
export default {
  plugins: [
    // Enable tree-shaking
    resolve({
      preferBuiltins: false,
      mainFields: ['module', 'main']
    }),
    
    // Dead code elimination
    terser({
      compress: {
        dead_code: true,
        unused: true
      }
    })
  ]
};
```

## 🎛️ Build Analysis Tools

### **Webpack Bundle Analyzer**

```bash
# Install analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze your bundle
npx webpack-bundle-analyzer dist/bundle.js

# Look for @starknet-io/types-js usage
# Should show minimal impact for type-only imports
```

### **Rollup Plugin Analyzer**

```bash
# For Rollup/Vite projects
npm install --save-dev rollup-plugin-analyzer

# Add to rollup.config.js
import { analyzer } from 'rollup-plugin-analyzer';

export default {
  plugins: [
    analyzer({ summaryOnly: true })
  ]
};
```

### **Bundle Size Monitoring**

```json
// package.json
{
  "scripts": {
    "build:analyze": "npm run build && bundlesize"
  },
  "bundlesize": [
    {
      "path": "./dist/bundle.js",
      "maxSize": "10KB",
      "compression": "gzip"
    }
  ]
}
```

## 🔧 Advanced Tree-Shaking Techniques

### **Technique 1: Import Maps for Conditional Loading**

```typescript
// types.ts - Development imports
const devImports = {
  assertFELT: () => import('@starknet-io/types-js').then(m => m.assertFELT),
  assertAddress: () => import('@starknet-io/types-js').then(m => m.assertAddress),
};

// types.ts - Production no-ops  
const prodImports = {
  assertFELT: () => Promise.resolve(() => {}),
  assertAddress: () => Promise.resolve(() => {}),
};

export const validators = process.env.NODE_ENV === 'development' 
  ? devImports 
  : prodImports;

// Usage
const assertFELT = await validators.assertFELT();
assertFELT(value); // No-op in production
```

### **Technique 2: Feature Flags with Tree-Shaking**

```typescript
// config.ts
export const ENABLE_VALIDATION = process.env.NODE_ENV === 'development';

// utils.ts
import type { CoreFELT } from '@starknet-io/types-js';
import { ENABLE_VALIDATION } from './config';

export function processFELT(value: string): CoreFELT {
  if (ENABLE_VALIDATION) {
    // This entire block gets removed in production
    const { assertFELT } = require('@starknet-io/types-js');
    assertFELT(value);
  }
  
  return value as CoreFELT;
}
```

### **Technique 3: Plugin-Based Architecture**

```typescript
// plugin-loader.ts
interface ValidationPlugin {
  validateFELT(value: string): boolean;
  validateAddress(value: string): boolean;
}

// Conditional plugin loading
export const validationPlugin: ValidationPlugin = process.env.NODE_ENV === 'development' 
  ? await import('./dev-validation-plugin')
  : await import('./noop-validation-plugin');

// dev-validation-plugin.ts
import { isFELT, isAddress } from '@starknet-io/types-js';

export const validateFELT = isFELT;
export const validateAddress = isAddress;

// noop-validation-plugin.ts  
export const validateFELT = () => true;
export const validateAddress = () => true;
```

## 📊 Real-World Bundle Size Examples

### **Example 1: Minimal DApp**

```typescript
// Only types for UI state
import type { CoreADDRESS, CoreFELT } from '@starknet-io/types-js';

interface AppState {
  userAddress: CoreADDRESS | null;
  balance: CoreFELT;
}

// Bundle impact: 0 bytes ✅
```

### **Example 2: Form Validation**

```typescript
// Types + minimal validation
import type { CoreADDRESS, CoreFELT } from '@starknet-io/types-js';
import { isAddress, isFELT } from '@starknet-io/types-js';

function validateForm(address: string, amount: string) {
  return {
    validAddress: isAddress(address),
    validAmount: isFELT(amount)
  };
}

// Bundle impact: ~75 bytes ✅
```

### **Example 3: Full API Integration**

```typescript
// Types + API definitions + validation
import type { 
  CoreADDRESS, 
  GetBlockResponse,
  TransactionReceipt 
} from '@starknet-io/types-js';
import { 
  isAddress, 
  assertBlockNumber 
} from '@starknet-io/types-js';

class StarknetClient {
  async getBlock(number: string): Promise<GetBlockResponse> {
    assertBlockNumber(number);
    // API call implementation
  }
}

// Bundle impact: ~100 bytes ✅
```

## ✅ Tree-Shaking Checklist

- [ ] **Use type-only imports** for maximum efficiency
- [ ] **Import functions by name**, never use star imports
- [ ] **Enable `sideEffects: false`** in your build configuration
- [ ] **Use conditional imports** for development-only validation
- [ ] **Monitor bundle size** with analysis tools
- [ ] **Test tree-shaking** with minimal import examples
- [ ] **Configure bundler** for optimal tree-shaking
- [ ] **Use feature flags** to eliminate unused code paths

## 🎯 Expected Results

Following this guide should achieve:

- **Type imports**: 0 bytes bundle impact
- **1-3 functions**: < 150 bytes total
- **5-10 functions**: < 500 bytes total  
- **Full validation suite**: < 1KB total

**Target: 99%+ tree-shaking efficiency with maximum type safety** 🌳✨
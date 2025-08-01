# Migration Guide

Guide for migrating to `@starknet-io/types-js` from other Starknet type libraries.

## Overview

This library provides:
- **Zero-runtime types** with TypeScript-only definitions
- **Minimal runtime utilities** for validation and type guards
- **Tree-shakable imports** for optimal bundle sizes
- **Comprehensive type coverage** for Starknet ecosystem

## Migration from @starknet-io/starknet.js

### Type Imports

```typescript
// ❌ Old: Mixed runtime/types from starknet.js
import { 
  Call, 
  InvokeFunctionResponse,
  validateAndParseAddress 
} from '@starknet-io/starknet.js';

// ✅ New: Separate type and runtime imports
import type { 
  Call, 
  InvokeTransactionResponse,
  ADDRESS 
} from '@starknet-io/types-js';
import { isAddress, assertAddress } from '@starknet-io/types-js';
```

### Address Validation

```typescript
// ❌ Old: Mixed validation/parsing
import { validateAndParseAddress } from '@starknet-io/starknet.js';

try {
  const addr = validateAndParseAddress(input);
} catch (error) {
  console.error('Invalid address');
}

// ✅ New: Separate validation patterns
import { isAddress, assertAddress } from '@starknet-io/types-js';
import type { ADDRESS } from '@starknet-io/types-js';

// Pattern 1: Guard-based
if (isAddress(input)) {
  const addr: ADDRESS = input; // TypeScript knows it's valid
}

// Pattern 2: Assertion-based  
try {
  assertAddress(input); // Throws if invalid
  const addr: ADDRESS = input;
} catch (error) {
  console.error('Invalid address');
}
```

### Contract Calls

```typescript
// ❌ Old: Runtime types
import { Call } from '@starknet-io/starknet.js';

const calls: Call[] = [
  {
    contractAddress: '0x123...',
    entrypoint: 'transfer',
    calldata: ['0x456...', '100']
  }
];

// ✅ New: Type-only import
import type { Call } from '@starknet-io/types-js';

const calls: Call[] = [
  {
    contractAddress: '0x123...',
    entrypoint: 'transfer', 
    calldata: ['0x456...', '100']
  }
];
```

## Migration from Custom Types

### Primitive Types

```typescript
// ❌ Old: Custom string types
type Felt = string;
type ContractAddress = string;
type Uint256 = { low: string; high: string };

// ✅ New: Branded types with validation
import type { FELT, ADDRESS, U256 } from '@starknet-io/types-js';
import { isFELT, isAddress } from '@starknet-io/types-js';

// Runtime validation available
function processTransaction(hash: unknown, to: unknown) {
  if (isFELT(hash) && isAddress(to)) {
    // TypeScript knows the correct types
    handleTransaction(hash, to);
  }
}

function handleTransaction(hash: FELT, to: ADDRESS) {
  // Properly typed parameters
}
```

### Wallet Types

```typescript
// ❌ Old: Manual wallet interface
interface CustomWallet {
  request(params: any): Promise<any>;
  enable(): Promise<string[]>;
  isConnected: boolean;
}

// ✅ New: Standard wallet interface
import type { StarknetWindowObject } from '@starknet-io/types-js';

const wallet: StarknetWindowObject = window.starknet!;
```

## Breaking Changes

### 1. Import Structure

**Before:**
```typescript
import { types, utils } from '@starknet-io/starknet.js';
```

**After:**
```typescript
// Separate type and runtime imports
import type { FELT, ADDRESS } from '@starknet-io/types-js';
import { isFELT, isAddress } from '@starknet-io/types-js';
```

### 2. Validation Functions

**Before:**
```typescript
import { validateAndParseAddress } from '@starknet-io/starknet.js';

const addr = validateAndParseAddress(input); // Returns parsed address
```

**After:**
```typescript
import { isAddress, assertAddress } from '@starknet-io/types-js';

// Option 1: Guard
if (isAddress(input)) {
  const addr = input; // Already validated
}

// Option 2: Assertion
assertAddress(input); // Throws if invalid
const addr = input;
```

### 3. Type Definitions

**Before:**
```typescript
// Types embedded in main library
import { Call, InvokeFunctionResponse } from '@starknet-io/starknet.js';
```

**After:**
```typescript
// Dedicated type definitions
import type { Call, InvokeTransactionResponse } from '@starknet-io/types-js';
```

## Migration Steps

### Step 1: Install New Package

```bash
npm install @starknet-io/types-js
```

### Step 2: Update Type Imports

```typescript
// Replace all type imports
- import { FELT, ADDRESS, Call } from '@starknet-io/starknet.js';
+ import type { FELT, ADDRESS, Call } from '@starknet-io/types-js';
```

### Step 3: Update Validation Logic

```typescript
// Replace validation functions
- import { validateAndParseAddress } from '@starknet-io/starknet.js';
+ import { isAddress, assertAddress } from '@starknet-io/types-js';

// Update validation pattern
- const addr = validateAndParseAddress(input);
+ assertAddress(input);
+ const addr = input;
```

### Step 4: Update Constants

```typescript
// Replace constant imports
- import { TRANSACTION_STATUS } from '@starknet-io/starknet.js';
+ import { API } from '@starknet-io/types-js';
+ console.log(API.TRANSACTION_STATUS.ACCEPTED_ON_L1);
```

### Step 5: Test Bundle Size

```bash
# Check bundle impact
npm run build
npx bundlesize

# Should see reduced bundle size due to tree-shaking
```

## Codemods (Automated Migration)

### Find and Replace Patterns

```bash
# Update type imports
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i \
  's/import { \(.*\) } from "@starknet-io\/starknet.js"/import type { \1 } from "@starknet-io\/types-js"/g'

# Update validation imports  
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i \
  's/validateAndParseAddress/assertAddress/g'
```

### TypeScript Transform

```typescript
// transform.ts - Custom TypeScript transformer
import ts from 'typescript';

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      // Transform import declarations
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier) && 
            moduleSpecifier.text === '@starknet-io/starknet.js') {
          
          // Convert to type-only import
          return ts.factory.updateImportDeclaration(
            node,
            node.decorators,
            node.modifiers,
            ts.factory.createImportClause(
              true, // isTypeOnly
              node.importClause?.name,
              node.importClause?.namedBindings
            ),
            ts.factory.createStringLiteral('@starknet-io/types-js')
          );
        }
      }
      
      return ts.visitEachChild(node, visitor, context);
    };
    
    return ts.visitNode(sourceFile, visitor);
  };
};
```

## Compatibility Matrix

| Feature | @starknet-io/starknet.js | @starknet-io/types-js | Migration |
|---------|-------------------------|----------------------|-----------|
| **FELT Type** | ✅ Runtime | ✅ Type-only | Direct replacement |
| **ADDRESS Type** | ✅ Runtime | ✅ Type-only | Direct replacement |
| **Validation** | `validateAndParseAddress` | `isAddress`/`assertAddress` | Pattern change |
| **Constants** | Mixed exports | `API.*` namespace | Update imports |
| **Wallet Types** | Partial | Complete | Enhanced coverage |
| **Bundle Size** | Large | Minimal | Automatic improvement |

## Common Issues

### Issue 1: Runtime Type Errors

```typescript
// ❌ Problem: Trying to use types at runtime
import type { FELT } from '@starknet-io/types-js';

// This won't work - FELT is type-only
if (value instanceof FELT) { /* ... */ }

// ✅ Solution: Use type guards
import { isFELT } from '@starknet-io/types-js';

if (isFELT(value)) { /* ... */ }
```

### Issue 2: Bundle Size Regression

```typescript
// ❌ Problem: Importing everything
import * as StarknetTypes from '@starknet-io/types-js';

// ✅ Solution: Import only what you need
import { isFELT, API } from '@starknet-io/types-js';
import type { FELT, ADDRESS } from '@starknet-io/types-js';
```

### Issue 3: TypeScript Configuration

```json
// tsconfig.json - Ensure proper module resolution
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## Verification

### Bundle Analysis

```bash
# Before migration
npm run bundle-analyzer
# Note bundle size

# After migration  
npm run bundle-analyzer
# Verify size reduction
```

### Type Checking

```bash
# Ensure all types resolve correctly
npx tsc --noEmit
```

### Runtime Testing

```bash
# Verify type guards work correctly
npm test
```

## Benefits After Migration

1. **Smaller Bundles**: Tree-shakable imports reduce bundle size
2. **Better Types**: More comprehensive type coverage
3. **Runtime Safety**: Type guards for validation
4. **Future Proof**: Aligned with Starknet standards
5. **Zero Cost**: Types have no runtime overhead

Following this guide ensures a smooth migration to the optimized type system.
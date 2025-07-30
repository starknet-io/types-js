# Migration Guide: Enhanced Types JS

This guide helps you migrate from the previous version to the enhanced types-js with new features and stricter type safety.

## Overview of Changes

### ✨ New Features
- **Branded Types**: Enhanced type safety with runtime validation
- **Type Guards**: Runtime type checking functions
- **Optional Runtime Validation**: Zod-based validation (peer dependency)
- **Enhanced Module Structure**: Better organization with core utilities
- **Improved Build Pipeline**: Parallel builds and performance optimizations

### 🔧 Breaking Changes
- **Stricter TypeScript Configuration**: New strict flags may require code updates
- **Enhanced Optional Properties**: `exactOptionalPropertyTypes` now enabled
- **Array Index Safety**: `noUncheckedIndexedAccess` now enabled

## Migration Steps

### 1. Update Package Dependencies

```bash
# Install new dev dependencies for enhanced features
npm install --save-dev npm-run-all bundlephobia-cli typedoc serve

# Optional: Install Zod for runtime validation
npm install zod
```

### 2. TypeScript Configuration Updates

The enhanced configuration includes stricter type checking. You may need to:

#### Handle Exact Optional Properties
```typescript
// Before: This was allowed
interface User {
  name: string;
  age?: number;
}

const user: User = { name: "Alice", age: undefined }; // ❌ Now fails

// After: Use proper optional handling
const user: User = { name: "Alice" }; // ✅ Correct
// OR
const user: User = { name: "Alice", age: 42 }; // ✅ Correct
```

#### Handle Array Index Access
```typescript
// Before: Potentially unsafe
const items = ["a", "b", "c"];
const first = items[0]; // Type: string (unsafe)

// After: Safer with explicit checks
const first = items[0]; // Type: string | undefined
if (first) {
  // Now first is guaranteed to be string
  console.log(first.toUpperCase());
}
```

### 3. Enhanced Type Usage

#### Using Branded Types
```typescript
import { FELT, ADDRESS, isFELT, isAddress } from '@starknet-io/types-js';

// Enhanced type safety
const contractAddress: ADDRESS = "0x123..." as ADDRESS; // Type assertion
// OR with validation
const validatedAddress = isAddress("0x123...") ? "0x123..." as ADDRESS : null;
```

#### Using Type Guards
```typescript
import { isFELT, isAddress, assertFELT } from '@starknet-io/types-js';

// Runtime type checking
function processTransaction(hash: string) {
  if (isFELT(hash)) {
    // hash is now typed as FELT
    return hash;
  }
  throw new Error('Invalid transaction hash');
}

// Or use assertion functions
function processTransactionSafe(hash: string) {
  assertFELT(hash); // Throws if invalid
  // hash is now guaranteed to be FELT
  return hash;
}
```

#### Optional Runtime Validation with Zod
```typescript
import { validateFelt, safeFelt, isZodAvailable } from '@starknet-io/types-js';

if (isZodAvailable()) {
  // Throws on invalid input
  const felt = validateFelt("0x123...");
  
  // Safe validation with result object
  const result = safeFelt("0x123...");
  if (result.success) {
    console.log(result.data); // FELT type
  } else {
    console.error(result.error);
  }
}
```

### 4. Build Script Updates

New parallel build scripts are available:

```json
{
  "scripts": {
    "build": "npm run clean && npm-run-all --parallel build:cjs build:esm build:types",
    "validate": "npm-run-all --parallel lint ts:check build",
    "docs:generate": "typedoc src/index.ts --out docs",
    "analyze": "bundlephobia-cli analyze"
  }
}
```

### 5. IDE Integration

#### VS Code Settings
The project now includes enhanced VS Code settings for better TypeScript support:
- Auto-imports
- Format on save
- Organize imports
- Enhanced IntelliSense

#### Recommended Extensions
Install these VS Code extensions for the best experience:
- TypeScript and JavaScript Language Features
- Prettier
- Error Lens
- Path Intellisense

## Compatibility

### Node.js Versions
- **Minimum**: Node.js 16+ (ES2021 target)
- **Recommended**: Node.js 18+ or 20+
- **Tested**: 18.x, 20.x, 22.x

### TypeScript Versions
- **Minimum**: TypeScript 5.0+
- **Recommended**: TypeScript 5.4+

### Peer Dependencies
- **Zod**: ^3.22.0 (optional, for runtime validation)

## Common Migration Issues

### Issue 1: Exact Optional Properties
```typescript
// Problem
interface Config {
  debug?: boolean;
}
const config: Config = { debug: undefined }; // ❌ Fails

// Solution
const config: Config = {}; // ✅ Omit undefined properties
const config: Config = { debug: true }; // ✅ Or provide actual value
```

### Issue 2: Array Index Access
```typescript
// Problem
const items: string[] = getItems();
const first = items[0].toUpperCase(); // ❌ Potentially undefined

// Solution
const first = items[0]?.toUpperCase(); // ✅ Safe optional chaining
// OR
if (items.length > 0) {
  const first = items[0]!.toUpperCase(); // ✅ Non-null assertion if you're sure
}
```

### Issue 3: Type Import Changes
```typescript
// Old import (still works)
import { FELT } from '@starknet-io/types-js';

// Enhanced imports (recommended)
import { FELT, isFELT, validateFelt } from '@starknet-io/types-js';
```

## Benefits of Migration

### 🛡️ Enhanced Type Safety
- Branded types prevent mixing different hex string types
- Runtime validation catches errors early
- Stricter TypeScript configuration prevents common bugs

### ⚡ Better Performance
- Parallel builds reduce build time by ~30%
- Incremental compilation for faster rebuilds
- Bundle analysis for size optimization

### 🔧 Better Developer Experience
- Enhanced IDE support with auto-imports
- Comprehensive documentation generation
- Type discovery helpers

### 📈 Improved Maintainability
- Cleaner module structure
- Runtime validation for external data
- Better error messages and debugging

## Rollback Strategy

If you need to rollback:

1. **Keep your current tsconfig**: Don't update TypeScript configuration
2. **Use selective imports**: Import only what you need
3. **Gradual adoption**: Enable strict features incrementally

## Support

For migration help:
- **GitHub Issues**: [Report issues](https://github.com/starknet-io/types-js/issues)
- **Documentation**: Generated docs in `/docs` folder
- **Examples**: Check the test files for usage examples
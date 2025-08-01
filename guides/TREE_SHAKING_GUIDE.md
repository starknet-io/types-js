# Tree Shaking Best Practices

Learn how to leverage tree shaking to minimize bundle size with `@starknet-io/types-js`.

## What is Tree Shaking?

Tree shaking eliminates unused code from your final bundle by analyzing import/export statements in ES modules.

## ESM vs CJS Tree Shaking

### ✅ ESM (Tree-shakable)
```typescript
// dist/esm/index.js - Named exports enable tree shaking
export { isFELT } from './core/guards.js';
export { API } from './api/constants.js';
export { WALLET_API } from './wallet-api/types.js';
```

### ❌ CJS (Not tree-shakable)
```javascript
// dist/cjs/index.js - Dynamic exports prevent tree shaking
module.exports = {
  get isFELT() { return require('./core/guards.js').isFELT; },
  get API() { return require('./api/constants.js').API; }
};
```

## Optimal Import Patterns

### ✅ Tree-shake Friendly
```typescript
// Only imports needed functions
import { isFELT, isAddress } from '@starknet-io/types-js';

// Type-only imports (zero runtime)
import type { FELT, ADDRESS } from '@starknet-io/types-js';

// Destructured imports
import { API } from '@starknet-io/types-js';
const { BLOCK_STATUS } = API;
```

### ❌ Prevents Tree Shaking
```typescript
// Imports everything
import * as StarknetTypes from '@starknet-io/types-js';

// Dynamic imports
const StarknetTypes = await import('@starknet-io/types-js');

// Property access after import
import StarknetTypes from '@starknet-io/types-js';
const { isFELT } = StarknetTypes; // Default export doesn't exist
```

## Package Structure for Tree Shaking

```
dist/esm/
├── index.js              # Main ESM entry with named exports
├── package.json          # {"type": "module", "sideEffects": false}
├── api/
│   ├── constants.js      # API constants
│   └── types.js          # API type exports  
├── wallet-api/
│   └── types.js          # Wallet API exports
├── snip-29/
│   └── types.js          # SNIP-29 paymaster exports
└── core/
    ├── guards.js         # Type guard functions
    └── utils.js          # Utility functions
```

## Side Effects Configuration

The package is marked as side-effect free for aggressive tree shaking:

```json
// dist/esm/package.json
{
  "type": "module",
  "sideEffects": false
}
```

## Bundle Size Analysis

### Tree Shaking Results

| Import Pattern | Bundle Size (gzipped) | What's Included |
|-----------------|----------------------|-----------------|
| `import { isFELT }` | ~100B | Single type guard |
| `import { isFELT, isAddress }` | ~150B | Two type guards |
| `import { API }` | ~200B | API constants object |
| `import { WALLET_API }` | ~180B | Wallet API types |
| `import { isFELT, API, WALLET_API }` | ~300B | Mixed imports |
| `import *` (full bundle) | 449B | Everything |

### Function-Level Tree Shaking

```typescript
// Core utilities (~100B each)
import { isFELT } from '@starknet-io/types-js';
import { isAddress } from '@starknet-io/types-js';
import { isHex } from '@starknet-io/types-js';
import { assertAddress } from '@starknet-io/types-js';

// API constants (~150-200B each)
import { API } from '@starknet-io/types-js';
import { WALLET_API } from '@starknet-io/types-js';
import { SNIP_29 } from '@starknet-io/types-js';
```

## Testing Tree Shaking

### 1. Bundle Analysis Tools

```bash
# Webpack Bundle Analyzer
npx webpack-bundle-analyzer dist/main.js

# Rollup Plugin Visualizer (Vite)
npx vite build --config vite.config.analyze.js
```

### 2. Manual Verification

```typescript
// Create test file
import { isFELT } from '@starknet-io/types-js';
console.log(isFELT('0x123'));

// Build and check bundle size
// Should be ~100B, not 449B
```

### 3. Build Tool Configuration

#### Webpack
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false
  },
  resolve: {
    mainFields: ['module', 'main'] // Prefer ESM
  }
};
```

#### Vite/Rollup
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      treeshake: true
    }
  }
};
```

## Common Tree Shaking Issues

### Issue 1: Importing from CJS build
```typescript
// ❌ This will bundle everything (921B)
const { isFELT } = require('@starknet-io/types-js');

// ✅ Use ESM instead (~100B)
import { isFELT } from '@starknet-io/types-js';
```

### Issue 2: Bundler not configured for ESM
```javascript
// Add to bundler config
{
  "mainFields": ["module", "main"], // Prefer ESM
  "sideEffects": false
}
```

### Issue 3: Development vs Production
```bash
# Development builds may not tree shake
npm run dev

# Production builds enable tree shaking
npm run build
```

## Verification Checklist

- [ ] Using named imports (`import { ... }`)
- [ ] Not using namespace imports (`import *`)
- [ ] Bundler configured for ESM
- [ ] Production build enabled
- [ ] Bundle size matches expectations
- [ ] No CJS require() statements

Following these practices ensures minimal bundle impact when using Starknet types.
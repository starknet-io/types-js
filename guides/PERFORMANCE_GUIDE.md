# Performance Optimization Guide

This guide shows how to minimize bundle size when using `@starknet-io/types-js`.

## Tree Shaking (ESM)

### Optimal Usage
```typescript
// ✅ Use named imports for tree-shaking
import { isFELT, isAddress } from '@starknet-io/types-js';

// Results in ~200B instead of ~1KB
```

### Avoid Full Imports
```typescript
// ❌ Imports entire bundle (~921B)
import * as StarknetTypes from '@starknet-io/types-js';

// ❌ Also imports everything
const StarknetTypes = require('@starknet-io/types-js');
```

## Bundle Analysis

| Format | Size (gzipped) | Tree-shakable | Best For |
|--------|----------------|---------------|----------|
| **ESM** | 449B | ✅ Yes | Modern bundlers |
| **CJS** | 921B | ❌ No | Node.js servers |

## Performance Best Practices

### 1. Use ESM Imports
```typescript
// Modern build tools will tree-shake unused exports
import { isFELT, API } from '@starknet-io/types-js';
```

### 2. Import Only What You Need
```typescript
// Instead of importing all API types
import { API } from '@starknet-io/types-js';

// Import specific types
import type { FELT, ADDRESS } from '@starknet-io/types-js';
```

### 3. Type-only Imports (Zero Runtime Cost)
```typescript
// Zero JavaScript in final bundle
import type { 
  StarknetWindowObject, 
  RpcProvider,
  ContractAbi 
} from '@starknet-io/types-js';
```

## Bundle Size by Import Pattern

```typescript
// ~100B - Single function
import { isFELT } from '@starknet-io/types-js';

// ~200B - Multiple type guards  
import { isFELT, isAddress, isHex } from '@starknet-io/types-js';

// ~300B - API constants + guards
import { isFELT, API } from '@starknet-io/types-js';

// ~449B - Full ESM bundle
import * as StarknetTypes from '@starknet-io/types-js';
```

## Framework-Specific Tips

### React/Next.js
```typescript
// Client-side optimization
import { isFELT } from '@starknet-io/types-js';

// Type-only for props
import type { FELT } from '@starknet-io/types-js';
```

### Node.js
```typescript
// Server-side - CJS is fine
const { isFELT } = require('@starknet-io/types-js');
```

### Bundler Configuration

#### Webpack
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    mainFields: ['module', 'main'] // Prefer ESM
  }
};
```

#### Vite
```javascript
// vite.config.js - ESM by default, no config needed
export default {
  // Vite automatically uses ESM version
};
```

## Measuring Impact

Use your bundler's analysis tools:

```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# Vite Bundle Analyzer  
npm install --save-dev rollup-plugin-visualizer
```

## Expected Results

Following these practices should result in:
- **ESM projects**: 200-400B additional bundle size
- **CJS projects**: ~921B additional bundle size
- **TypeScript**: Zero runtime overhead for types
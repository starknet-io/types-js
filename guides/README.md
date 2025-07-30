# Developer Guides

Comprehensive guides for using `@starknet-io/types-js` effectively in your Starknet applications.

## 📋 Available Guides

### 📊 [Performance Guide](./PERFORMANCE_GUIDE.md)
Learn how to optimize bundle sizes and achieve minimal overhead when using Starknet types.

**Topics covered:**
- Tree shaking with ESM imports
- Bundle size analysis (449B ESM vs 921B CJS)
- Framework-specific optimization tips
- Import pattern best practices

### 🌳 [Tree Shaking Guide](./TREE_SHAKING_GUIDE.md)
Master tree shaking techniques to minimize your application's bundle size.

**Topics covered:**
- ESM vs CJS tree shaking differences
- Function-level tree shaking results
- Bundler configuration (Webpack, Vite, Rollup)
- Common tree shaking issues and solutions

### 🚀 [Usage Guide](./USAGE_GUIDE.md)
Complete reference for integrating Starknet types into your applications.

**Topics covered:**
- Type guards and runtime validation
- Wallet API integration
- Framework integration (React, Node.js)
- Testing with Starknet types
- Best practices and patterns

### 🔄 [Migration Guide](./MIGRATION_GUIDE.md)
Step-by-step migration from other Starknet type libraries.

**Topics covered:**
- Migration from @starknet-io/starknet.js
- Breaking changes and compatibility
- Automated migration tools
- Verification and testing

## 🎯 Quick Start

### Installation
```bash
npm install @starknet-io/types-js
```

### Basic Usage
```typescript
// Type guards for runtime validation
import { isFELT, isAddress } from '@starknet-io/types-js';

// Type-only imports (zero runtime cost)
import type { FELT, ADDRESS, StarknetWindowObject } from '@starknet-io/types-js';

// API constants
import { API, WALLET_API, SNIP_29 } from '@starknet-io/types-js';
```

### Performance-Optimized Import
```typescript
// ✅ Tree-shakable ESM import (~200B)
import { isFELT, API } from '@starknet-io/types-js';

// ✅ Zero-cost type import
import type { FELT, ADDRESS } from '@starknet-io/types-js';
```

## 📊 Package Information

| Metric | Value | Status |
|--------|-------|---------|
| **ESM Bundle** | 449B gzipped | ✅ Excellent |
| **CJS Bundle** | 921B gzipped | ✅ Good |
| **Tree Shaking** | Full support | ✅ Optimal |
| **TypeScript** | Complete coverage | ✅ Perfect |

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Type System Architecture"
        A[Runtime Guards] --> B[isFELT, isAddress, etc.]
        C[Type Definitions] --> D[FELT, ADDRESS, etc.]
        E[API Constants] --> F[API.*, WALLET_API.*]
        G[Wallet Integration] --> H[StarknetWindowObject]
        
        B --> I[Bundle: ~100-200B each]
        D --> J[Bundle: 0B (type-only)]
        F --> K[Bundle: ~150-200B each]
        H --> L[Bundle: 0B (type-only)]
    end
```

## 🔧 Development Workflow

### 1. Choose Import Strategy
- **ESM + Tree Shaking**: For modern bundlers (Webpack 5+, Vite, Rollup)
- **CJS**: For Node.js servers or legacy environments
- **Type-only**: For TypeScript definitions without runtime cost

### 2. Validate at Boundaries
```typescript
// Validate external data
function processTransaction(hash: unknown, to: unknown) {
  if (isFELT(hash) && isAddress(to)) {
    // TypeScript knows the correct types
    return executeTransaction(hash, to);
  }
  throw new Error('Invalid transaction data');
}
```

### 3. Use Constants for Type Safety
```typescript
// Instead of magic strings
if (transaction.status === 'ACCEPTED_ON_L1') { /* ... */ }

// Use typed constants
if (transaction.status === API.TRANSACTION_STATUS.ACCEPTED_ON_L1) { /* ... */ }
```

## 🎨 IDE Integration

### VSCode Settings
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.preferences.importModuleSpecifier": "shortest"
}
```

### Auto-import Configuration
The package is configured for optimal auto-imports:
- Named exports for tree shaking
- Proper TypeScript module resolution
- ESM-first import suggestions

## 🚀 Production Deployment

### Bundle Analysis
Before deploying, analyze your bundle to verify optimal tree shaking:

```bash
# Webpack Bundle Analyzer
npx webpack-bundle-analyzer dist/main.js

# Vite Bundle Visualizer
npm run build -- --analyze
```

### Expected Results
- **Single function import**: ~100B
- **Multiple functions**: ~200-300B
- **Full API constants**: ~400B
- **Everything**: 449B (ESM) / 921B (CJS)

## 📚 External Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Starknet Documentation](https://docs.starknet.io/)
- [Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [ESM vs CJS](https://nodejs.org/docs/latest-v18.x/api/esm.html)

## 🤝 Contributing

Found an issue or want to improve the guides?

1. [Open an issue](https://github.com/starknet-io/types-js/issues)
2. [Submit a PR](https://github.com/starknet-io/types-js/pulls)
3. Check existing [discussions](https://github.com/starknet-io/types-js/discussions)

## 📄 License

MIT © [Starknet Foundation](https://github.com/starknet-io)
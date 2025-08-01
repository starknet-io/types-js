<p align="center">
  <img width='300' src="https://raw.githubusercontent.com/starknet-io/types-js/9c98311bfdeda3440b0d65d2eaa3c5869ddedcab/types%20js%20logo.png">
</p>
<p align="center">
    <a href="https://github.com/starknet-io/types-js/actions/workflows/publish.yml">
    <img src="https://github.com/starknet-io/types-js/actions/workflows/publish.yml/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/@starknet-io/types-js">
    <img src='https://img.shields.io/npm/v/%40starknet-io%2Ftypes-js' />
  </a>
  <a href="https://www.npmjs.com/package/@starknet-io/types-js">
    <img src='https://img.shields.io/npm/v/%40starknet-io%2Ftypes-js/beta' />
  </a>
  <a href="https://bundlephobia.com/package/%40starknet-io%2Ftypes-js">
    <img src='https://img.shields.io/bundlephobia/minzip/%40starknet-io%2Ftypes-js?color=success&label=size' />
  </a>
  <a href="https://www.npmjs.com/package/%40starknet-io%2Ftypes-js">
    <img src='https://img.shields.io/npm/dt/%40starknet-io%2Ftypes-js?color=blueviolet' />
  </a>
  <a href="https://github.com/starknet-io/types-js/blob/main/LICENSE/">
    <img src="https://img.shields.io/badge/license-MIT-black">
  </a>
  <a href="https://github.com/starknet-io/types-js/actions/workflows/test-coverage.yml">
    <img src="https://raw.githubusercontent.com/starknet-io/types-js/main/.github/badges/coverage.svg">
  </a>
  <a href="https://github.com/starknet-io/%40starknet-io%2Ftypes-js/stargazers">
    <img src='https://img.shields.io/github/stars/starknet-io/types-js?color=yellow' />
  </a>
  <a href="https://starkware.co/">
    <img src="https://img.shields.io/badge/powered_by-StarkWare-navy">
  </a>
  <a href="https://twitter.com/starknetjs">
    <img src="https://img.shields.io/badge/follow_us-Twitter-blue">
  </a>
  <a href="https://www.drips.network/app/projects/github/starknet-io/starknet.js" target="_blank">
    <img src="https://www.drips.network/api/embed/project/https%3A%2F%2Fgithub.com%2Fstarknet-io%2Fstarknet.js/support.png?background=light&style=github&text=project&stat=none" alt="Support starknet.js on drips.network" height="20">
  </a>
  <a href="https://github.com/starknet-io/types-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22">
    <img src="https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square">
  </a>
</p>

<p align="center">
🐺 Starknet TypeScript types 🚀 definitions for Starknet projects
</p>

## Installation

RPC 0.9 - Upcoming

```bash
npm i @starknet-io/types-js@beta
```

RPC 0.8 - Latest

```bash
npm i @starknet-io/types-js
```

RPC 0.7 - Deprecated - deadline (28.07.2025)

```bash
npm i @starknet-io/types-js@0.7.10
```

## Types

#### API [Starknet JSON RPC Specification](https://github.com/starkware-libs/starknet-specs/tree/master/api)

```ts
// type import
import type { SomeApiType } from '@starknet-io/types-js';
// or entire namespace import
import { API } from '@starknet-io/types-js';
```

#### Wallet API [Wallet JSON RPC Specification](https://github.com/starkware-libs/starknet-specs/tree/48e77bf4aaf687388b40b8198e3105401941517a/wallet-api)

```ts
// type import
import type { SomeWalletApiType } from '@starknet-io/types-js';
// or entire namespace import
import { WALLET_API } from '@starknet-io/types-js';
```

#### SNIPs [StarkNet Improvement Proposals](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-1.md)

- [SNIP-12 Hashing and signing typed structured data](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-12.md) - [/src/wallet-api/typedData.ts](https://github.com/starknet-io/types-js/blob/main/src/wallet-api/typedData.ts)
```ts
// type import
import type { TypedData } from '@starknet-io/types-js';
```

- [SNIP-29 Applicative paymaster API standard](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-29.md)
```ts
// namespace import
import { PAYMASTER_API } from '@starknet-io/types-js';
```

## Versioning

MAJOR and MINOR version of this package follows [starknet-spec](https://github.com/starkware-libs/starknet-specs/tags) semantic versioning. The PATCH version can diverge based on the bug fixes.

Ex. Starknet types-js v0.7 == Starknet Spec v0.7

## Testing

This project maintains comprehensive test coverage with automated quality assurance:

### 🧪 Test Scripts
- **`npm test`** - Complete test suite: validation + type checking + Jest with coverage + verification
- **`npm run test:develop`** - Development-friendly testing: lint + type-check + Jest with coverage

### 📊 Coverage Reporting
- **Self-Hosted Dynamic Badge** - Coverage badge generated and updated automatically by GitHub Actions
- **No External Dependencies** - Badge works entirely within GitHub infrastructure
- **Real-Time Updates** - Badge reflects actual test coverage from latest CI run
- **Multiple Coverage Formats** - LCOV, JSON, and HTML coverage reports generated
- **Automatic Badge Colors** - Green (100%), Yellow (70-89%), Red (<70%)

### 📊 Coverage Areas
- **Core Types & Guards** - FELT, Address, Storage validation functions
- **API Components** - StarkNet JSON-RPC types and interfaces  
- **Wallet API** - Wallet integration and typed data structures
- **Utilities** - Type-safe object manipulation and branded types
- **Extensions** - Plugin architecture and validator system
- **Integration** - Real-world usage patterns and package consumption

### ✅ Quality Assurance
All tests pass with 100% coverage including:
- Unit tests for all core functionality
- Integration tests for real-world scenarios  
- Package consumption verification
- TypeScript compilation validation
- ESLint code quality checks

## Development Scripts

### 📦 Build Scripts
- **`npm run build`** - Main build command (cleans and builds all formats in parallel)
- **`npm run build:cjs`** - Builds CommonJS module format (Node.js)
- **`npm run build:esm`** - Builds ES Module format (modern bundlers with tree-shaking)
- **`npm run build:types`** - Generates TypeScript declaration files (.d.ts)

### 🔍 Analysis & Debug Scripts
- **`npm run build:analyze`** - Counts TypeScript processed files (compilation debugging)
- **`npm run build:trace`** - Generates detailed TypeScript compilation trace
- **`npm run analyze`** - Runs bundlesize check (ensures <10KB gzipped)

### 🧹 Maintenance Scripts
- **`npm run clean`** - Removes build artifacts (dist folder and trace files)
- **`npm run format`** - Auto-formats all code files using Prettier

### ✅ Quality Assurance Scripts
- **`npm run lint`** - Runs ESLint to check code quality and auto-fix issues
- **`npm run ts:check`** - Type-checks code without emitting files
- **`npm run validate`** - Comprehensive validation: lint + type-check + build (parallel)
- **`npm run test:types`** - Type-checks test files specifically

### 📚 Documentation Scripts
- **`npm run docs:generate`** - Creates API documentation using TypeDoc
- **`npm run docs:serve`** - Serves documentation locally on port 3000

### 🎯 Recommended Usage
**For development:**
```bash
npm run validate    # Before committing - checks everything
npm run build      # When you need fresh builds
npm run format     # To format code before committing
```

**For debugging:**
```bash
npm run build:analyze  # Count compiled files
npm run build:trace   # Detailed compilation analysis
npm run analyze       # Check bundle sizes
```

## License

This repository is licensed under the MIT License, see [LICENSE](LICENSE) for more information.

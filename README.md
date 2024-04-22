# starknet-types

🐺 Starknet TypeScript types 🚀

[![GitHub Workflow Status](https://github.com/starknet-io/types-js/actions/workflows/publish.yml/badge.svg)](https://github.com/starknet-io/types-js/actions/workflows/publish.yml)
[![Project license](https://img.shields.io/github/license/starknet-io/types-js.svg?style=flat-square)](LICENSE)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/starknet-io/types-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

Shared TypeScript type definitions for Starknet projects

## Types

#### api [Starknet JSON RPC Specification](https://github.com/starkware-libs/starknet-specs/tree/master/api)
- /src/api/*
- usage 
```ts 
  import type { SomeType } from 'starknet-types'
```
- or usage from api namespace import
```ts 
  import { API } from 'starknet-types'
```

#### wallet-api [Wallet JSON RPC Specification](https://github.com/starkware-libs/starknet-specs/tree/48e77bf4aaf687388b40b8198e3105401941517a/wallet-api)
- /src/wallet-api/*
- usage from top level type import 
```ts 
  import type { SomeType } from 'starknet-types'
```
- or usage from api namespace import
```ts 
  import { WALLET_API } from 'starknet-types'
```

##### SNIP-12 [Hashing and signing typed structured data](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-12.md)
- /src/wallet-api/typedData.ts

## Versioning (pending SPEC PR merge)

(MAJOR.MINOR) Version of this package should follow [starknet-spec](https://github.com/starkware-libs/starknet-specs) semantic versioning.
PATCH version can diverge based on bug-fixes
ex. Starknet types v0.7.x <-> Starknet Spec v0.7.x

## Usage

As a package

```bash
npm i starknet-types
```

## Devs Build

```bash
npm run build
```

## Devs Testing

```bash
npm run lint
```

## License

This repository is licensed under the MIT License, see [LICENSE](LICENSE) for more information.

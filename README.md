# starknet-types

🐺 Starknet TypeScript types 🚀

[![GitHub Workflow Status](https://github.com/starknet-io/types-js/actions/workflows/publish.yml/badge.svg)](https://github.com/starknet-io/types-js/actions/workflows/publish.yml)
[![Project license](https://img.shields.io/github/license/starknet-io/types-js.svg?style=flat-square)](LICENSE)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/starknet-io/types-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

Shared TypeScript type definitions for Starknet projects

## Types

- (WIP) api [Starknet JSON RPC Specification](https://github.com/starkware-libs/starknet-specs/tree/master/api)
- wallet-api [Wallet JSON RPC Specification](https://github.com/starkware-libs/starknet-specs/tree/48e77bf4aaf687388b40b8198e3105401941517a/wallet-api)
- SNIP-12 [Hashing and signing typed structured data](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-12.md)

## Versioning (wip - pending PR merge will be the first version in sync)

(MAJOR.MINOR) Version of this package should follow [starknet-spec](https://github.com/starkware-libs/starknet-specs) semantic versioning.
PATCH version can diverge based on bug-fixes

Starknet types v0.7.x <-> Starknet Spec v0.7.x

## Usage

As a package

```bash
npm i starknet-types
```

## Build

```bash
npm run build
```

## Testing

```bash
npm run lint
```

## License

This repository is licensed under the MIT License, see [LICENSE](LICENSE) for more information.

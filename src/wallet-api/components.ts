import type { ADDRESS, CONTRACT_CLASS, FELT, SIGNATURE } from '../api/components.js'
import type { ChainId } from '../api/index.js'

/**
 * Account Address
 */
export type Address = ADDRESS

export type Signature = SIGNATURE

/**
 * The transaction hash, as assigned in Starknet
 */
export type PADDED_TXN_HASH = PADDED_FELT // TODO: Should be like TXN_HASH_PADDED to avoid collision with api TXN_HASH

/**
 * A padded felt represent 0x0 + (0-7) + (62 hex digits)
 * @pattern ^0x(0[0-7]{1}[a-fA-F0-9]{62}$)
 */
export type PADDED_FELT = string // TODO: STORAGE_KEY should also be PADDED_FELT to remove duplication, and padded felt added to api spec ?

/**
 * A Starknet JSON-RPC spec version, following semantic versioning.
 * @pattern ^[0-9]+\\.[0-9]+(\\.[0-9]+(-[0-9A-Za-z.-]+)?)?$
 * @example "0.10" | "0.10.3" | "0.10.3-rc.3"
 */
export type SpecVersion =
  | `${number}.${number}`
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${string}`

/**
 * ERC20 Token Symbol (min:1 char - max:6 chars)
 * @pattern ^[A-Za-z0-9]{1,6}$
 */
export type TokenSymbol = string // TODO: I would recommend rename to TOKEN_SYMBOL to avoid collision with js Symbol (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

/**
 * Starknet Token
 * Details of an onchain Starknet ERC20 token
 */
export type Asset = {
  type: 'ERC20' // The asset's interface, e.g. 'ERC20'
  options: {
    address: Address // The hexadecimal Starknet address of the token contract
    symbol?: TokenSymbol // A ticker symbol or shorthand, up to 5 alphanumerical characters
    decimals?: number // The number of asset decimals
    image?: string // A string url of the token logo
    name?: string // The name of the token - not in spec
  }
}

// SPEC: STARKNET_CHAIN
export type StarknetChain = {
  id: string
  chain_id: ChainId
  chain_name: string
  rpc_urls?: string[]
  block_explorer_url?: string[]
  native_currency?: Asset
  icon_urls?: string[] // Currently ignored.
}

// SPEC: INVOKE_CALL
export type Call = {
  contract_address: Address
  entry_point: string
  calldata?: FELT[]
}

/**
 * INVOKE_TXN_V1
 * @see https://github.com/starkware-libs/starknet-specs/blob/master/api/starknet_api_openrpc.json
 */
export interface AddInvokeTransactionParameters {
  /**
   * Calls to invoke by the account
   */
  calls: Call[]
  /**
   * Optional SNIP-36-compliant ZK proof. Required when submitting a STRK20 call
   * produced by wallet_strk20PrepareInvoke; omitted for regular invocations.
   */
  proof?: STRK20_PROOF
}
export interface AddInvokeTransactionResult {
  /**
   * The hash of the invoke transaction
   */
  transaction_hash: PADDED_TXN_HASH
}

/**
 * SPEC: DECLARE_TXN
 */
export interface AddDeclareTransactionParameters {
  compiled_class_hash: FELT
  class_hash?: FELT
  contract_class: CONTRACT_CLASS
}

export interface AddDeclareTransactionResult {
  /**
   * The hash of the declare transaction
   */
  transaction_hash: PADDED_TXN_HASH
  /**
   * The hash of the declared class
   */
  class_hash: PADDED_FELT
}

/**
 * EIP-1102:
 * @see https://eips.ethereum.org/EIPS/eip-1102
 */
export interface RequestAccountsParameters {
  /**
   * If true, the wallet will not show the wallet-unlock UI in case of a locked wallet,
   * nor the dApp-approve UI in case of a non-allowed dApp.
   */
  silent_mode?: boolean
}

/**
 * EIP-747:
 * @see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-747.md
 */
export interface WatchAssetParameters extends Asset {}

/**
 * EIP-3085:
 * @see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md
 */
export interface AddStarknetChainParameters extends StarknetChain {}

export interface SwitchStarknetChainParameters {
  chainId: ChainId
  silent_mode?: boolean
}

/**
 * SPEC: ACCOUNT_DEPLOYMENT_DATA
 */
export interface AccountDeploymentData {
  address: Address // the expected address, used to double-check the returned data
  class_hash: FELT // The class hash of the contract to deploy
  salt: FELT // The salt used for the computation of the account address
  calldata: FELT[] // An array of felts
  sigdata?: FELT[] // An optional array of felts to be added in the signature
  version: 0 | 1 // Cairo version (an integer)
}

/**
 * A wallet API version, following semantic versioning (no pre-release).
 * When used as a request parameter and not specified, the latest is assumed.
 * @pattern ^[0-9]+\\.[0-9]+(\\.[0-9]+)?$
 * @example "0.8" | "0.10.3"
 */
export type API_VERSION = `${number}.${number}` | `${number}.${number}.${number}`

/**
 * The version of wallet API the request expecting. If not specified, the latest is assumed
 */
export interface ApiVersionRequest {
  api_version?: API_VERSION
}

// ==================== STRK20 Privacy Protocol ====================

/**
 * SNIP-36-compliant zero-knowledge proof material (an in-protocol stwo-cairo
 * proof) that must be included with the call when submitting the STRK20
 * transaction on-chain. When the prepared call was built in simulate mode all
 * three fields are present but empty.
 */
export type STRK20_PROOF = {
  data: string
  output: FELT[]
  proof_facts: FELT[]
}

/**
 * A Starknet call that materializes a STRK20 transaction, together with the
 * SNIP-36-compliant zero-knowledge proof needed to submit it. When produced in
 * simulate mode the proof fields are present but empty (proof.data is an empty
 * string, proof.output and proof.proof_facts are empty arrays); in that case the
 * call is not submittable on-chain and is only useful for fee estimation or UI
 * previews.
 */
export type STRK20_CALL_AND_PROOF = {
  call: Call
  proof: STRK20_PROOF
}

/**
 * A wallet-resolved placeholder that the wallet substitutes with a single felt
 * during STRK20 action assembly. ${openNoteIds[N]} expands to the ID of the Nth
 * open note in the same transaction (i.e. the Nth transfer action with amount
 * "OPEN"); ${poolAddress} expands to the privacy pool contract address. N is a
 * zero-based index.
 * @pattern ^\$\{(?:openNoteIds\[[0-9]+\]|poolAddress)\}$
 */
export type STRK20_CALLDATA_PLACEHOLDER = string

/**
 * A single calldata entry: either a literal felt, or one of the placeholder
 * strings the wallet expands during action assembly.
 */
export type STRK20_CALLDATA_ITEM = FELT | STRK20_CALLDATA_PLACEHOLDER

/**
 * Deposits public funds from the user's account into the privacy pool. Always to
 * self.
 */
export type STRK20_DEPOSIT_ACTION = {
  type: 'deposit'
  token: ADDRESS
  amount: FELT
}

/**
 * Withdraws funds from the privacy pool to a public recipient address.
 */
export type STRK20_WITHDRAW_ACTION = {
  type: 'withdraw'
  token: ADDRESS
  amount: FELT
  recipient: ADDRESS
}

/**
 * Privately transfers funds inside the privacy pool to another registered user.
 */
export type STRK20_TRANSFER_ACTION = {
  type: 'transfer'
  token: ADDRESS
  /** FELT amount in the token's smallest unit, or the literal "OPEN" to create a new open note */
  amount: FELT | 'OPEN'
  recipient: ADDRESS
}

/**
 * Invokes an arbitrary contract entry point as part of the same STRK20
 * transaction. Calldata items may be literal felts or wallet-resolved
 * placeholders that the wallet substitutes during action assembly:
 * ${openNoteIds[N]} for the ID of the Nth open note (the Nth transfer action with
 * amount "OPEN"), or ${poolAddress} for the privacy pool address.
 */
export type STRK20_INVOKE_ACTION = {
  type: 'invoke'
  contract: ADDRESS
  calldata: STRK20_CALLDATA_ITEM[]
}

/**
 * A single action to perform via the STRK20 privacy protocol. The `type` field
 * discriminates the variant.
 */
export type STRK20_ACTION =
  | STRK20_DEPOSIT_ACTION
  | STRK20_WITHDRAW_ACTION
  | STRK20_TRANSFER_ACTION
  | STRK20_INVOKE_ACTION

/**
 * A private balance for a single token held inside the privacy pool.
 */
export type STRK20_BALANCE_ENTRY = {
  token: ADDRESS
  balance: FELT
}

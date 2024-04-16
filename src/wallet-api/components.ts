export type FELT = string;

// SPEC: INVOKE_CALL
export type Call = {
  contract_address: Address;
  entry_point: string;
  calldata?: FELT[];
};

export type SIERRA_ENTRY_POINT = {
  selector: FELT;
  function_idx: number;
};

/**
 * The transaction hash, as assigned in Starknet
 */
export type TXN_HASH = PADDED_FELT; // TODO: Should be like TXN_HASH_PADDED to avoid collision with Starknet TXN_HASH

/**
 * A padded felt represented as up to 62 hex digits, 3 bits, and 5 leading zeroes
 * @pattern ^0x(0|[0-7]{1}[a-fA-F0-9]{0,62}$)
 */
export type PADDED_FELT = string; // TODO: STORAGE_KEY should also be PADDED_FELT to remove duplication

/**
 * Hex-string Starknet address of the contract
 */
export type Address = FELT;

/**
 * A Starknet RPC spec version, only two numbers are provided
 * @pattern ^[0-9]+\\.[0-9]+$
 */
export type SPEC_VERSION = string;

/**
 * ERC20 Token Symbol (min:1 char - max:6 chars)
 * @pattern ^[A-Za-z0-9]{1,6}$
 */
export type Symbol = string; // TODO: I would recommend rename to TOKEN_SYMBOL to avoid collision with js Symbol (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

/**
 * chain id, given in hex representation.
 * @pattern "^0x[a-fA-F0-9]+$"
 */
export type ChainId = string;

/**
 * Starknet Token
 * Details of an onchain Starknet ERC20 token
 */
export type Asset = {
  type: 'ERC20'; // The asset's interface, e.g. 'ERC20'
  options: {
    address: Address; // The hexadecimal Starknet address of the token contract
    symbol?: Symbol; // A ticker symbol or shorthand, up to 5 alphanumerical characters
    decimals?: number; // The number of asset decimals
    image?: string; // A string url of the token logo
    name?: string; // The name of the token - not in spec
  };
};

export type StarknetChain = {
  id: string;
  chain_id: ChainId;
  chain_name: string;
  rpc_urls?: string[];
  block_explorer_url?: string[];
  native_currency?: Asset;
  icon_urls?: string[]; // Currently ignored.
};

export type ContractClass = {
  /**
   * The list of Sierra instructions of which the program consists
   */
  sierra_program: FELT[];
  /**
   * The version of the contract class object. Currently, the Starknet OS supports version 0.1.0
   */
  contract_class_version: string;
  /**
   * Entry points by type
   */
  entry_points_by_type: {
    CONSTRUCTOR: SIERRA_ENTRY_POINT[];
    EXTERNAL: SIERRA_ENTRY_POINT[];
    L1_HANDLER: SIERRA_ENTRY_POINT[];
  };
  /**
   * The class ABI, as supplied by the user declaring the class
   */
  abi?: string;
};

/**
 * INVOKE_TXN_V1
 * @see https://github.com/starkware-libs/starknet-specs/blob/master/api/starknet_api_openrpc.json
 */
export interface AddInvokeTransactionParameters {
  /**
   * Calls to invoke by the account
   */
  calls: Call[];
}
export interface AddInvokeTransactionResult {
  /**
   * The hash of the invoke transaction
   */
  transaction_hash: TXN_HASH;
}

/**
 * SPEC: DECLARE_TXN
 */
export interface AddDeclareTransactionParameters {
  compiled_class_hash: FELT;
  class_hash?: FELT;
  contract_class: ContractClass;
}

export interface AddDeclareTransactionResult {
  /**
   * The hash of the declare transaction
   */
  transaction_hash: TXN_HASH;
  /**
   * The hash of the declared class
   */
  class_hash: PADDED_FELT;
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
  silentMode?: boolean;
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
  chainId: ChainId;
}

/**
 * SPEC: ACCOUNT_DEPLOYMENT_DATA
 */
export interface GetDeploymentDataResult {
  address: Address; // the expected address, used to double-check the returned data
  class_hash: FELT; // The class hash of the contract to deploy
  salt: FELT; // The salt used for the computation of the account address
  calldata: FELT[]; // An array of felts
  sigdata?: FELT[]; // An optional array of felts to be added in the signature
  version: 0 | 1; // Cairo version (an integer)
}

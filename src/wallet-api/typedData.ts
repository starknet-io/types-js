export enum TypedDataRevision {
  Active = '1',
  Legacy = '0',
}

export type StarknetEnumType = {
  name: string;
  type: 'enum';
  contains: string;
};

export type StarknetMerkleType = {
  name: string;
  type: 'merkletree';
  contains: string;
};

/**
 * A single type, as part of a struct. The `type` field can be any of the EIP-712 supported types.
 *
 * Note that the `uint` and `int` aliases like in Solidity, and fixed point numbers are not supported by the EIP-712
 * standard.
 */
export type StarknetType =
  | {
      name: string;
      type: string;
    }
  | StarknetEnumType // TODO: check @Penovic it is not in Spec
  | StarknetMerkleType;

/**
 * The EIP712 domain struct. Any of these fields are optional, but it must contain at least one field.
 */
export interface StarknetDomain extends Record<string, unknown> {
  name?: string;
  version?: string;
  chainId?: string | number;
  revision?: string; // TODO: check check @Penovic, not is speck
}

/**
 * The complete typed data, with all the structs, domain data, primary type of the message, and the message itself.
 */
export interface TypedData {
  types: Record<string, StarknetType[]>; // TODO: check @Penovic, in speck it is only StarknetType[]
  primary_type: string;
  domain: StarknetDomain;
  message: Record<string, unknown>; // TODO: check check @Penovic, in speck it is any object
}

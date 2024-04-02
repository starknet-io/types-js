// Optimization on events
import { StarknetChainId } from '../common/constants.js';

export type AccountChangeEventHandler = (accounts?: string[]) => void;
export type NetworkChangeEventHandler = (chainId?: StarknetChainId, accounts?: string[]) => void;

export interface WalletEventHandlers {
  accountsChanged: AccountChangeEventHandler;
  networkChanged: NetworkChangeEventHandler;
}

// TODO: Check with get-starknet team do we need it
export type WalletEvents = {
  [E in keyof WalletEventHandlers]: { type: E; handler: WalletEventHandlers[E] };
}[keyof WalletEventHandlers];

export type WalletEventListener = <E extends keyof WalletEventHandlers>(
  event: E,
  handleEvent: WalletEventHandlers[E]
) => void;

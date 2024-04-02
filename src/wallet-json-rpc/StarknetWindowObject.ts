import type { WalletEventListener } from './events';
import type { RequestFn } from './methods';

export interface StarknetWindowObject {
  id: string;
  name: string;
  version: string;
  icon: string | { dark: string; light: string };
  request: RequestFn;
  on: WalletEventListener;
  off: WalletEventListener;
}

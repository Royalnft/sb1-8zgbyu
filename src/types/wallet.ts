export interface WalletAddress {
  address: string;
  path: string;
  privateKey: string;
  publicKey: string;
}

export interface Note {
  id: string;
  content: string;
  address: string;
  timestamp: number;
  inscriptionId?: string;
}

export interface WalletState {
  mnemonic: string;
  addresses: WalletAddress[];
  notes: Note[];
  selectedAddress: string;
}
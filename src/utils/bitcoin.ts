import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

// Initialize bip32 with secp256k1
const bip32 = BIP32Factory(ecc);

// Set buffer globally
window.Buffer = Buffer;

// Bitcoin network configuration (testnet for development)
export const network = bitcoin.networks.testnet;

export interface WalletAddress {
  address: string;
  path: string;
  privateKey: string;
}

export class BitcoinWallet {
  private root: any;
  private addresses: WalletAddress[] = [];
  private mnemonic: string;

  constructor(mnemonic?: string) {
    this.mnemonic = mnemonic || bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(this.mnemonic);
    this.root = bip32.fromSeed(seed, network);
    this.generateInitialAddresses();
  }

  private generateInitialAddresses() {
    for (let i = 0; i < 5; i++) {
      this.generateNewAddress();
    }
  }

  generateNewAddress(): WalletAddress {
    const index = this.addresses.length;
    const path = `m/44'/1'/0'/0/${index}`;
    const child = this.root.derivePath(path);
    
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network
    });

    const newAddress: WalletAddress = {
      address: address!,
      path,
      privateKey: child.privateKey!.toString('hex')
    };

    this.addresses.push(newAddress);
    return newAddress;
  }

  getAddresses(): WalletAddress[] {
    return this.addresses;
  }

  getMnemonic(): string {
    return this.mnemonic;
  }
}

export const createWallet = (mnemonic?: string): BitcoinWallet => {
  return new BitcoinWallet(mnemonic);
};
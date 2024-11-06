import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import CryptoJS from 'crypto-js';
import type { WalletAddress, Note } from '../types/wallet';

const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.bitcoin; // Mainnet

export const generateMnemonic = (): string => {
  return bip39.generateMnemonic();
};

export const validateMnemonic = (mnemonic: string): boolean => {
  return bip39.validateMnemonic(mnemonic);
};

export const generateAddressesFromMnemonic = (
  mnemonic: string,
  startIndex: number = 0,
  count: number = 5
): WalletAddress[] => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  const addresses: WalletAddress[] = [];

  for (let i = startIndex; i < startIndex + count; i++) {
    const path = `m/84'/0'/0'/0/${i}`; // BIP84 for native SegWit
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network,
    });

    if (!address) continue;

    const keyPair = ECPair.fromPrivateKey(child.privateKey!);

    addresses.push({
      address,
      path,
      privateKey: child.privateKey!.toString('hex'),
      publicKey: child.publicKey.toString('hex'),
    });
  }

  return addresses;
};

export const encryptNote = (content: string, privateKey: string): string => {
  return CryptoJS.AES.encrypt(content, privateKey).toString();
};

export const decryptNote = (encryptedContent: string, privateKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, privateKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const createInscription = async (
  content: string,
  address: string,
  privateKey: string
): Promise<string> => {
  const encryptedContent = encryptNote(content, privateKey);
  
  // Here you would implement the actual inscription process using Ordinals
  // This is a placeholder that would need to be replaced with actual ordinals inscription code
  // You would need to create a transaction with the inscription data
  
  // For now, we'll return a mock inscription ID
  return `inscription_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

export const transferInscription = async (
  inscriptionId: string,
  fromAddress: string,
  toAddress: string,
  privateKey: string
): Promise<boolean> => {
  // Here you would implement the actual transfer of the inscription
  // This would involve creating a transaction that moves the UTXO containing the inscription
  
  // For now, we'll return true to simulate success
  return true;
};
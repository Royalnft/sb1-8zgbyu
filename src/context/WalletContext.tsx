import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { WalletState, WalletAddress, Note } from '../types/wallet';
import {
  generateMnemonic,
  generateAddressesFromMnemonic,
  createInscription,
  transferInscription,
} from '../lib/bitcoin';

type WalletAction =
  | { type: 'SET_MNEMONIC'; payload: string }
  | { type: 'ADD_ADDRESS'; payload: WalletAddress }
  | { type: 'SET_SELECTED_ADDRESS'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } };

const initialState: WalletState = {
  mnemonic: '',
  addresses: [],
  notes: [],
  selectedAddress: '',
};

const WalletContext = createContext<{
  state: WalletState;
  dispatch: React.Dispatch<WalletAction>;
  createNote: (content: string, address: string) => Promise<void>;
  transferNote: (noteId: string, toAddress: string) => Promise<void>;
} | null>(null);

const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_MNEMONIC':
      return { ...state, mnemonic: action.payload };
    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.payload] };
    case 'SET_SELECTED_ADDRESS':
      return { ...state, selectedAddress: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates }
            : note
        ),
      };
    default:
      return state;
  }
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  useEffect(() => {
    const initializeWallet = () => {
      const mnemonic = generateMnemonic();
      const addresses = generateAddressesFromMnemonic(mnemonic);
      
      dispatch({ type: 'SET_MNEMONIC', payload: mnemonic });
      addresses.forEach((address) => {
        dispatch({ type: 'ADD_ADDRESS', payload: address });
      });
      
      if (addresses.length > 0) {
        dispatch({ type: 'SET_SELECTED_ADDRESS', payload: addresses[0].address });
      }
    };

    if (!state.mnemonic) {
      initializeWallet();
    }
  }, []);

  const createNote = async (content: string, address: string) => {
    const addressObj = state.addresses.find((a) => a.address === address);
    if (!addressObj) throw new Error('Address not found');

    const inscriptionId = await createInscription(
      content,
      address,
      addressObj.privateKey
    );

    const note: Note = {
      id: uuidv4(),
      content,
      address,
      timestamp: Date.now(),
      inscriptionId,
    };

    dispatch({ type: 'ADD_NOTE', payload: note });
  };

  const transferNote = async (noteId: string, toAddress: string) => {
    const note = state.notes.find((n) => n.id === noteId);
    if (!note || !note.inscriptionId) throw new Error('Note not found');

    const fromAddress = state.addresses.find((a) => a.address === note.address);
    if (!fromAddress) throw new Error('Source address not found');

    const success = await transferInscription(
      note.inscriptionId,
      note.address,
      toAddress,
      fromAddress.privateKey
    );

    if (success) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id: noteId, updates: { address: toAddress } },
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{ state, dispatch, createNote, transferNote }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
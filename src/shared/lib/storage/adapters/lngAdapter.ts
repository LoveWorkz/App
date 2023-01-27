import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface LngStorage {
  setLanguage: (key: string, value: string) => Promise<void>;
  getLanguage: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeLanguage: (key: string) => Promise<void>;
}

const setLanguage = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getLanguage = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeLanguage = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const lngStorage: LngStorage = {
  setLanguage,
  getLanguage,
  removeLanguage,
};

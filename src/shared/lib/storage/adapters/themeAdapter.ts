import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface ThemeStorage {
  setTheme: (key: string, value: string) => Promise<void>;
  getTheme: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeTheme: (key: string) => Promise<void>;
}

const setTheme = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getTheme = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeTheme = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const themeStorage: ThemeStorage = {
  setTheme,
  getTheme,
  removeTheme,
};

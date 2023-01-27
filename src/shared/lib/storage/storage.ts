import AsyncStorage from '@react-native-async-storage/async-storage';
import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';

type LocalStorage = typeof AsyncStorage;

export interface Storage {
  getItem: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | string>;
  setItem: (key: string, value: string) => Promise<void>;
  setStorage: (newStorage: LocalStorage) => void;
  removeItem: (key: string) => Promise<void>;
}

let storage: LocalStorage = AsyncStorage;

const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await storage?.setItem(key, value);
  } catch (e) {
    console.log(e, 'setItem error');
  }
};

const getItem = async (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => {
  let value = null;
  try {
    value = await storage?.getItem(key, clb);
  } catch (e) {
    console.log(e, 'getItem error');
  }
  return value;
};

const removeItem = async (key: string): Promise<void> => {
  try {
    await storage?.removeItem(key);
  } catch (e) {
    console.log(e, 'removeItem error');
  }
};

const setStorage = (newStorage: LocalStorage): void => {
  storage = newStorage;
};

export default {
  getItem,
  setItem,
  setStorage,
  removeItem,
} as Storage;

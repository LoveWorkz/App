import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface EventEndStorage {
  setEventEndType: (key: string, value: string) => Promise<void>;
  getEventEndType: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeEventEndType: (key: string) => Promise<void>;
}

const setEventEndType = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getEventEndType = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeEventEndType = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const eventEndStorage: EventEndStorage = {
  setEventEndType,
  getEventEndType,
  removeEventEndType,
};

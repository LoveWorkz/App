import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface coreChallengeInfoStorage {
  setCoreChallengeInfo: (key: string, value: string) => Promise<void>;
  getCoreChallengeInfo: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeCoreChallengeInfo: (key: string) => Promise<void>;
}

const setCoreChallengeInfo = async (
  key: string,
  value: string,
): Promise<void> => {
  await storage.setItem(key, value);
};

const getCoreChallengeInfo = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeCoreChallengeInfo = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const coreChallengeInfoStorage: coreChallengeInfoStorage = {
  setCoreChallengeInfo,
  getCoreChallengeInfo,
  removeCoreChallengeInfo,
};

import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface GoalsStorage {
  setSelectedGoals: (key: string, value: string) => Promise<void>;
  getSelectedGoals: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeSelectedGoals: (key: string) => Promise<void>;
}

const setSelectedGoals = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getSelectedGoals = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeSelectedGoals = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const goalsStorage: GoalsStorage = {
  setSelectedGoals,
  getSelectedGoals,
  removeSelectedGoals,
};

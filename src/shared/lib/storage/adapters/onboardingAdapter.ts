import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface OnboardingStorage {
  setOnboardingData: (key: string, value: string) => Promise<void>;
  getOnboardingData: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeOnboardingData: (key: string) => Promise<void>;
}

const setOnboardingData = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getOnboardingData = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeOnboardingData = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const onboardingStorage: OnboardingStorage = {
  setOnboardingData,
  getOnboardingData,
  removeOnboardingData,
};

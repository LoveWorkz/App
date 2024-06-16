import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface GuidedTourStorage {
  setGuidedTour: (key: string, value: string) => Promise<void>;
  getGuidedTour: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeGuidedTour: (key: string) => Promise<void>;
}

const setGuidedTour = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getGuidedTour = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeGuidedTour = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const guidedTourStorage: GuidedTourStorage = {
  setGuidedTour,
  getGuidedTour,
  removeGuidedTour,
};

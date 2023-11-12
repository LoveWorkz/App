import storage from '../storage';

export interface RateUsStorage {
  setRateUsData: (key: string, value: string) => Promise<void>;
  getRateUsData: (key: string) => Promise<string | null>;
  removeRateUsData: (key: string) => Promise<void>;
}

const setRateUsData = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getRateUsData = (key: string): Promise<string | null> =>
  storage.getItem(key);

const removeRateUsData = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const rateUsStorage: RateUsStorage = {
  setRateUsData,
  getRateUsData,
  removeRateUsData,
};

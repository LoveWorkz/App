import storage from '../storage';

export interface UserSchedulersAdapterStorage {
  setUserSchedulers: (key: string, value: string) => Promise<void>;
  getUserSchedulers: (key: string) => Promise<string | null>;
  removeUserSchedulers: (key: string) => Promise<void>;
}

const setUserSchedulers = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getUserSchedulers = async (key: string): Promise<string | null> => {
  // console.log(key);
  let data = await storage.getItem(key)
  return data;
}

const removeUserSchedulers = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const userSchedulersAdapterStorage: UserSchedulersAdapterStorage = {
  setUserSchedulers,
  getUserSchedulers,
  removeUserSchedulers
};
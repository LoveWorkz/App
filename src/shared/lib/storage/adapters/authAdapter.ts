import storage from '../storage';

export interface AuthStorage {
  setAuthData: (key: string, value: string) => Promise<void>;
  getAuthData: (key: string) => Promise<string | null>;
  removeAuthData: (key: string) => Promise<void>;
}

const setAuthData = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getAuthData = (key: string): Promise<string | null> =>
  storage.getItem(key);

const removeAuthData = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const authStorage: AuthStorage = {
  setAuthData,
  getAuthData,
  removeAuthData,
};

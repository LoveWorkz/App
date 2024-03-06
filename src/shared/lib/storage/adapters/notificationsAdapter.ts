import {CallbackWithResult} from '@react-native-async-storage/async-storage/lib/typescript/types';
import storage from '../storage';

export interface NotificationsStorage {
  setNotifications: (key: string, value: string) => Promise<void>;
  getNotifications: (
    key: string,
    clb?: CallbackWithResult<string>,
  ) => Promise<string | null>;
  removeNotifications: (key: string) => Promise<void>;
}

const setNotifications = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getNotifications = (
  key: string,
  clb?: CallbackWithResult<string>,
): Promise<string | null> => storage.getItem(key, clb);

const removeNotifications = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const notificationsStorage: NotificationsStorage = {
  setNotifications,
  getNotifications,
  removeNotifications,
};

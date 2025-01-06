import storage from '../storage';
import {userStore} from '@src/entities/User';

export interface ChallengeDoneFromSessionStorage {
  setChallengeDone: (key: string) => Promise<void>;
  getChallengeDone: (key: string) => Promise<string | boolean>;
}

const setChallengeDone = async (challengeId: string): Promise<void> => {
  const key = `${userStore.userId}_1_${challengeId}`;
  await storage.setItem(key, 'DONE');
};

const getChallengeDone = async (challengeId: string): Promise<string> => {
  const key = `${userStore.userId}_1_${challengeId}`;
  const data = await storage.getItem(key);
  return data;
};

export const challengeDoneFromSessionStorage: ChallengeDoneFromSessionStorage =
  {
    setChallengeDone,
    getChallengeDone,
  };

import storage from '../storage';

export interface ChallengeInforAdapterStorage {
  setChallengeInfo: (key: string, value: string) => Promise<void>;
  getChallengeInfo: (key: string) => Promise<string | null>;
  removeChallengeInfo: (key: string) => Promise<void>;
}

const setChallengeInfo = async (key: string, value: string): Promise<void> => {
  await storage.setItem(key, value);
};

const getChallengeInfo = (key: string): Promise<string | null> =>
  storage.getItem(key);

const removeChallengeInfo = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

export const challengeInfoStorage: ChallengeInforAdapterStorage = {
  setChallengeInfo,
  getChallengeInfo,
  removeChallengeInfo,
};

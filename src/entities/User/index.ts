import {UserStore} from './model/store/userStore';
export type {User} from './model/types/userSchema';
export {AuthMethod} from './model/types/userSchema';
export {userFormatter} from './lib/user/userForamtter';

export const userStore = new UserStore();

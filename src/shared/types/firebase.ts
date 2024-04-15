import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export enum Collections {
  USERS = 'Users',
  BOOKS = 'Books',
  CATEGORIES = 'Categories',
  RUBRICS = 'Rubrics',
  QUESTIONS = 'Questions',
  ORDINARY_QUESTIONS = 'ordinary_questions',
  CHALLENGE_QUESTIONS = 'challenge_questions',
  WILD_QUESTIONS = 'wild_questions',
  RUBRIC_QUESTIONS = 'rubric_questions',
  CHALLENGE_CATEGORIES = 'Challenge_Categories',
  CORE_CHALLENGES = 'core_challenges',
  USER_CHALLENGE_CATEGORIES = 'User_Challenge_Categories',
  USER_LEVELS = 'user_levels',
  USER_RUBRICS = 'User_Rubrics',
  SPECIAL_DAYS = 'special_days',
  SPECIAL_CHALLENGES = 'special_challenges',
  GOALS = 'goals',
  CORE_CHALLENGE_GROUPS = 'core_challenge_groups',
  SPECIAL_CHALLENGE_GROUPS = 'special_challenge_groups',

  LEVELS = 'levels',
  QUADRANTS = 'quadrants',
  QUADRANTS_SESSIONS = 'quadrant_sessions',
  SESSIONS = 'sessions',
}

export enum CloudStoragePaths {
  AVATARS = 'avatars',
  QUESTIONS_SCREENSHOTS = 'questions_screenshots',
}

export enum FirebaseErrorCodes {
  AUTH_USER_NOT_FOUND = 'auth/user-not-found',
  AUTH_USER_DISABLED = 'auth/user-disabled',
  AUTH_INVALID_EMAIL = 'auth/invalid-email',
  AUTH_WRONG_PASSWORD = 'auth/wrong-password',
  AUTH_EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
}

export type DocsType =
  FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[];

// Type for the updates argument which contains the fields to update
export type UpdateData = Record<string, number | string | boolean>;

// Type for the update object that will be used in the Firestore update function
export type FirestoreUpdateObject = Record<string, number | string | boolean>;

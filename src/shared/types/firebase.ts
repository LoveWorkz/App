export enum Collections {
  USERS = 'Users',
  BOOKS = 'Books',
  CATEGORIES = 'Categories',
  RUBRICS = 'Rubrics',
  QUESTIONS = 'Questions',
  CHALLENGE_CATEGORIES = 'Challenge_Categories',
  CHALLENGES = 'Challenges',
  USER_CHALLENGE_CATEGORIES = 'User_Challenge_Categories',
  USER_CATEGORIES = 'User_Categories',
  USER_RUBRICS = 'User_Rubrics',
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

  USER_CANCELED_APPLE_SIGN_IN = 'The operation couldn’t be completed',
  USER_CANCELED_GOOGLE_SIGN_IN = 'The user canceled the sign in request',
}

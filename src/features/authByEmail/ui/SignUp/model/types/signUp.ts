export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpErrorInfo {
  confirmPasswordError: string;
}

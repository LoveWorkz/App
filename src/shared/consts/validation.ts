export const uppercaseRegexp = /[A-Z]/;
export const LovercaseRegexp = /[a-z]/;
export const weakPasswordRegexp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!_%&*?])[A-Za-z\d#$@!_%&*?]{8,30}$/;
export const whitespaceRegexp = /\s/g;
export const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

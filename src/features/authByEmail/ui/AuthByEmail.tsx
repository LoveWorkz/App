import React, {memo} from 'react';
import {View} from 'react-native';

import {ComponentWrapper as SignIn} from './SignIn/ui/SignIn';
import {ComponentWrapper as SignUp} from './SignUp/ui/SignUp';

interface AuthByEmailProps {
  isSingIn: boolean;
}

export const AuthByEmail = memo((props: AuthByEmailProps) => {
  const {isSingIn} = props;

  return <View>{isSingIn ? <SignIn /> : <SignUp />}</View>;
});

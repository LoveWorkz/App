import React, {useEffect} from 'react';

import {configureGoogleSignin} from './config/firebaseConfig';
import {AppRoute} from './providers/route/AppRoute';

const App = () => {
  useEffect(() => {
    configureGoogleSignin();
  }, []);

  return <AppRoute />;
};

export default App;

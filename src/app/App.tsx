import React, {useEffect} from 'react';

import {initAdmob} from './config/admobConfig';
import {configureGoogleSignin} from './config/firebaseConfig';
import {AppRoute} from './providers/route/AppRoute';

const App = () => {
  useEffect(() => {
    initAdmob();
    configureGoogleSignin();
  }, []);

  return <AppRoute />;
};

export default App;

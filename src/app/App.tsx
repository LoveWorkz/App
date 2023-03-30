import React, {useEffect} from 'react';

import {initAdmob} from './config/admobConfig';
import {configureGoogleSignin} from './config/firebaseConfig';
import {ColorsProvider} from './providers/colorsProvider';
import {AppRoute} from './providers/route/AppRoute';
import {ThemeProvider} from './providers/themeProvider';

const App = () => {
  useEffect(() => {
    initAdmob();
    configureGoogleSignin();
  }, []);

  return (
    <ThemeProvider>
      <ColorsProvider>
        <AppRoute />
      </ColorsProvider>
    </ThemeProvider>
  );
};

export default App;

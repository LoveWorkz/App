import React, {memo} from 'react';

import Screen1 from './StatisticScreens/Screen1';
import Screen2 from './StatisticScreens/Screen2';
import Screen3 from './StatisticScreens/Screen3';
import Screen4 from './StatisticScreens/Screen4';

interface StatisticWrapperProps {
  index: number;
}

const StatisticWrapper = (props: StatisticWrapperProps) => {
  const {index} = props;

  switch (index.toString()) {
    case '0':
      return <Screen1 />;
    case '1':
      return <Screen2 />;
    case '2':
      return <Screen3 />;
    case '3':
      return <Screen4 />;
    default:
      return <></>;
  }
};

export default memo(StatisticWrapper);

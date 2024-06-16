import {observer} from 'mobx-react-lite';
import React, {memo, useCallback, useState} from 'react';
import {useCopilot} from 'react-native-copilot';

import guidedTourStore from '../model/store/guidedTourStore';
import GuidedTourStartModal from './GuidedTourStartModal';

const GuidedTour = () => {
  const isGuidedTourCompleted = guidedTourStore.isGuidedTourCompleted;
  const {start} = useCopilot();
  const [visible, setVisible] = useState(true);

  const onStart = useCallback(() => {
    start();
    setVisible(false);
  }, [start]);

  if (isGuidedTourCompleted) {
    return null;
  }

  return (
    <GuidedTourStartModal
      onStart={onStart}
      visible={visible}
      setVisible={setVisible}
    />
  );
};

export default memo(observer(GuidedTour));

import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';

import WowThatWasFastStore from '../model/store/WowThatWasFastStore';
import WowThatWasFastModal from './WowThatWasFastModal';

export const WowThatWasFast = () => {
  return (
    <WowThatWasFastModal
      visible={WowThatWasFastStore.thatWasFastModalVisible}
      setVisible={WowThatWasFastStore.setThatWasFastModalVisible}
    />
  );
};

export default memo(observer(WowThatWasFast));

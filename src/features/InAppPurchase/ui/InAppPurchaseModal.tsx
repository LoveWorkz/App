import React, {memo} from 'react';
import {Modal} from 'react-native';
import {observer} from 'mobx-react-lite';

import {InAppPurchase} from '@src/features/InAppPurchase';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';

interface InAppPurchaseModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const InAppPurchaseModal = (props: InAppPurchaseModalProps) => {
  const {visible, setVisible} = props;

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onCancelHandler}>
      <ScrollViewWithoutIndicator>
        <InAppPurchase onCancelHandler={onCancelHandler} />
      </ScrollViewWithoutIndicator>
    </Modal>
  );
};

export default memo(observer(InAppPurchaseModal));

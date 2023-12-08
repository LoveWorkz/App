import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Modal} from '@src/shared/ui/Modal/Modal';
import {verticalScale} from '@src/shared/lib/Metrics';
import {InAppPurchase} from '@src/features/InAppPurchase';

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
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <InAppPurchase />
    </Modal>
  );
};

export default memo(observer(InAppPurchaseModal));

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(188),
    paddingHorizontal: 0,
  },
});

import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  InAppPurchaseModal,
  inAppPurchaseStore,
} from '@src/features/InAppPurchase';

interface WithInAppPurchaseProps {
  children: ReactElement;
}

export const WithInAppPurchase = observer((props: WithInAppPurchaseProps) => {
  const {children} = props;

  const isInAppPurchaseModalVisible =
    inAppPurchaseStore.isInAppPurchaseModalVisible;

  const setIsInAppPurchaseModalVisible =
    inAppPurchaseStore.setIsInAppPurchaseModalVisible;

  return (
    <View>
      {children}
      <InAppPurchaseModal
        visible={isInAppPurchaseModalVisible}
        setVisible={setIsInAppPurchaseModalVisible}
      />
    </View>
  );
});

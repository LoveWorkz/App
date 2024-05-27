import React, {ReactElement} from 'react';
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
    <>
      {children}
      <InAppPurchaseModal
        visible={isInAppPurchaseModalVisible}
        setVisible={setIsInAppPurchaseModalVisible}
      />
    </>
  );
});

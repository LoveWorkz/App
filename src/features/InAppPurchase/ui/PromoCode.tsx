import React, { memo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet, View } from 'react-native';

import { Input } from '@src/shared/ui/Input/Input';
import { Button, ButtonTheme } from '@src/shared/ui/Button/Button';
import { AppText, TextSize } from '@src/shared/ui/AppText/AppText';
import { useColors } from '@src/app/providers/colorsProvider';
import { Spinner } from '@src/shared/ui/Spinner/Spinner';
import inAppPurchaseStore from '../model/store/InAppPurchaseStore';

const PromoCode = () => {
  const colors = useColors();
  const promoCode = inAppPurchaseStore.promoCode;
  const promoCodeErrorMessage = inAppPurchaseStore.promoCodeErrorMessage;
  const isCheckingPromoCode = inAppPurchaseStore.isCheckingPromoCode;

  const onPromoCodeChangeHandler = useCallback((v: string) => {
    inAppPurchaseStore.setPromoCode(v);
  }, []);

  const onPressHandler = () => {
    inAppPurchaseStore.checkPromoCode();
  }

  return (
    <View style={styles.PromoCode}>
      <Input
        error={promoCodeErrorMessage}
        style={styles.input}
        label={'Promo code'}
        value={promoCode}
        onChange={onPromoCodeChangeHandler}
      />
      <Button
        onPress={onPressHandler}
        style={styles.btn}
        theme={ButtonTheme.GRADIENT}
      >
        <AppText
          style={{ color: colors.bgQuinaryColor, }}
          weight={'700'}
          size={TextSize.LEVEL_3}
          text={'add'}
        />
      </Button>
      <Spinner visible={isCheckingPromoCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  PromoCode: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: '80%',
  },
  btn: {
    width: '15%',
    top: 5
  }
});

export default memo(observer(PromoCode));


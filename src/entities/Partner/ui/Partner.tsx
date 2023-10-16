import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import partnerStore from '../model/store/partnerStore';

const Partner = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const {partnerForm, partnerInitData, errorInfo, isSaving} = partnerStore;

  useFocusEffect(
    useCallback(() => {
      return () => partnerStore.resetForm();
    }, []),
  );

  const onNameChangeHandler = useCallback((value: string) => {
    partnerStore.setName(value);
  }, []);

  const onEmailChangeHandler = useCallback((value: string) => {
    partnerStore.setEmail(value);
  }, []);

  const onAgeChangeHandler = useCallback((value: string) => {
    partnerStore.setAge(Number(value));
  }, []);

  const onPressHandler = () => {
    partnerStore.savePartner();
  };

  return (
    <View style={styles.Partner}>
      <View style={styles.item}>
        <Input
          isSpaceAllowed
          initialValue={partnerInitData?.name}
          label={t('profile.name')}
          value={partnerForm.name}
          onChange={onNameChangeHandler}
          placeholder={t('profile.enter_name')}
          error={t(errorInfo.nameError)}
        />
      </View>
      <View style={styles.item}>
        <Input
          isSpaceAllowed
          initialValue={partnerInitData?.email}
          label={t('auth.email')}
          value={partnerForm.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email')}
          error={t(errorInfo.emailError)}
        />
      </View>
      <View style={styles.item}>
        <Input
          keyboardType={'numeric'}
          initialValue={partnerInitData?.age ? `${partnerInitData?.age}` : ''}
          label={t('profile.age')}
          value={partnerForm.age ? `${partnerForm.age}` : ''}
          onChange={onAgeChangeHandler}
          placeholder={t('profile.enter_age')}
          error={t(errorInfo.ageError)}
        />
      </View>

      <Button
        onPress={onPressHandler}
        disabled={isSaving}
        style={styles.btn}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          size={TextSize.LEVEL_4}
          text={t('save')}
        />
      </Button>
    </View>
  );
};

export default memo(observer(Partner));

const styles = StyleSheet.create({
  Partner: {
    flex: 1,
  },
  item: {
    marginBottom: 15,
  },

  btn: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
});

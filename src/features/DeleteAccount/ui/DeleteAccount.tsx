import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Wrapper as DeleteAccountModal} from './DeleteAccountModal/DeleteAccountModal';

const DeleteAccount = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onDeleteHandler = () => {
    setIsDeleteModalVisible(true);
  };

  return (
    <View>
      <Button theme={ButtonTheme.CLEAR} onPress={onDeleteHandler}>
        <AppText
          style={[styles.deleteText, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_4}
          text={t('auth.delete_my_account')}
        />
      </Button>
      <DeleteAccountModal
        visible={isDeleteModalVisible}
        setVisible={setIsDeleteModalVisible}
      />
    </View>
  );
};

export const Wrapper = memo(DeleteAccount);

const styles = StyleSheet.create({
  deleteText: {
    textDecorationLine: 'underline',
  },
});

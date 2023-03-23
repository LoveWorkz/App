import React, {memo, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Wrapper as DeleteAccountModal} from './DeleteAccountModal/DeleteAccountModal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const DeleteAccount = () => {
  const {t} = useTranslation();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onDeleteHandler = () => {
    setIsDeleteModalVisible(true);
  };

  return (
    <ScrollView>
      <Button theme={ButtonTheme.CLEAR} onPress={onDeleteHandler}>
        <AppText
          style={styles.deleteText}
          size={TextSize.LEVEL_4}
          text={t('auth.delete_my_account')}
        />
      </Button>
      <DeleteAccountModal
        visible={isDeleteModalVisible}
        setVisible={setIsDeleteModalVisible}
      />
    </ScrollView>
  );
};

export const Wrapper = memo(DeleteAccount);

const styles = StyleSheet.create({
  deleteText: {
    textDecorationLine: 'underline',
  },
});

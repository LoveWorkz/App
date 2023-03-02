import React, {memo, useState} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Wrapper as DeleteAccountModal} from './DeleteAccountModal/DeleteAccountModal';

const DeleteAccount = () => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onDeleteHandler = () => {
    setIsDeleteModalVisible(true);
  };

  return (
    <ScrollView>
      <Button theme={ButtonTheme.CLEAR} onPress={onDeleteHandler}>
        <Text style={styles.deleteText}>Delete my account</Text>
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
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
});

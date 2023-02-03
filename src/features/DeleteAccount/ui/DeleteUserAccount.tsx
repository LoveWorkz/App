import React, {memo, useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Wrapper as DeleteAccountModal} from './DeleteAccountModal/DeleteAccountModal';

const DeleteUserAccount = () => {
  const [visible, setVisible] = useState(false);

  const onPressHandler = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <SafeAreaView>
      <Button
        style={styles.btn}
        theme={ButtonTheme.OUTLINED}
        onPress={onPressHandler}>
        <Text style={styles.text}>Delete Account</Text>
      </Button>
      <DeleteAccountModal visible={visible} setVisible={setVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  },
});

export const Wrapper = memo(DeleteUserAccount);

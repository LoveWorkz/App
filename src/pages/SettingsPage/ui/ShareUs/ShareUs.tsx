import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {ShareIcon} from '@src/shared/assets/icons/Share';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {shareUsStore} from '@src/features/ShareUs';

const options = {
  message: 'App link',
};

const ShareUs = () => {
  const {t} = useTranslation();

  const onPressHandler = async () => {
    shareUsStore.share(options);
  };

  return (
    <Button
      style={styles.btn}
      theme={ButtonTheme.OUTLINED}
      onPress={onPressHandler}>
      <View style={styles.btnTextWrapper}>
        <SvgXml xml={ShareIcon} style={styles.icon} />
        <AppText
          weight={'500'}
          size={TextSize.LEVEL_4}
          style={styles.btnText}
          text={t('settings.share_us')}
        />
      </View>
    </Button>
  );
};

export default memo(ShareUs);

const styles = StyleSheet.create({
  btn: {
    marginTop: 10,
    backgroundColor: 'black',
    height: 44,
  },
  btnTextWrapper: {
    flexDirection: 'row',
  },
  btnText: {
    color: 'white',
    marginLeft: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
});

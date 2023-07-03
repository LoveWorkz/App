import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {ShareIcon} from '@src/shared/assets/icons/Share';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {shareStore} from '@src/features/Share';
import {useColors} from '@src/app/providers/colorsProvider';
import {shareAppUrl} from '@src/app/config/shareConfig';

const options = {
  message: shareAppUrl,
};

const ShareUs = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onPressHandler = async () => {
    shareStore.share(options);
  };

  return (
    <Button
      style={styles.btn}
      theme={ButtonTheme.GRADIENT}
      onPress={onPressHandler}>
      <View style={styles.btnTextWrapper}>
        <SvgXml
          xml={ShareIcon}
          stroke={colors.bgQuinaryColor}
          style={styles.icon}
        />
        <AppText
          weight={'500'}
          size={TextSize.LEVEL_4}
          style={[styles.btnText, {color: colors.bgQuinaryColor}]}
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
    height: 44,
  },
  btnTextWrapper: {
    flexDirection: 'row',
  },
  btnText: {
    marginLeft: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
});

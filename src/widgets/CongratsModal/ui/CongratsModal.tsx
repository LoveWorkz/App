import React, {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {verticalScale} from '@src/shared/lib/Metrics';
import {CongratsModalContentType} from '../model/types/congratsModalType';

interface CongratsModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  content: CongratsModalContentType;
}

const CongratsModal = (props: CongratsModalProps) => {
  const {visible, setVisible, content} = props;
  const {height, width, title, description, image} = content;
  const colors = useColors();
  const {t} = useTranslation();

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  const uri = useMemo(() => {
    return {
      uri: image,
    };
  }, [image]);

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <View style={[{height, width}]}>
        <FastImage style={styles.image} source={uri} />
      </View>

      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={title}
      />

      {description ? (
        <AppText
          style={[styles.description, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_4}
          text={description}
        />
      ) : (
        <></>
      )}
      <Button
        style={styles.btn}
        onPress={onCancelHandler}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          size={TextSize.LEVEL_4}
          text={t('continue')}
        />
      </Button>
    </Modal>
  );
};

export default memo(observer(CongratsModal));

const styles = StyleSheet.create({
  content: {
    height: verticalScale(426),
  },
  title: {
    textAlign: 'center',
    marginTop: verticalScale(25),
  },
  description: {
    marginBottom: verticalScale(40),
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    height: verticalScale(40),
  },
  dontShowAgaing: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(10),
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});

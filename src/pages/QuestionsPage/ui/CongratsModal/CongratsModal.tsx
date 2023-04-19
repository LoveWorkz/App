import React, {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {verticalScale} from '@src/shared/lib/Metrics';
import {profileStore} from '@src/entities/Profile';
import {CategoryName} from '@src/entities/Category';
import {getCongratsModalContent} from '../../model/lib/questions';

interface CongratsModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const CongratsModal = (props: CongratsModalProps) => {
  const {visible, setVisible} = props;
  const colors = useColors();
  const {t} = useTranslation();
  const currentCategory = profileStore.currentCategory;

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  const uri = useMemo(() => {
    return {
      uri: 'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FScreenshot%202023-02-14%20at%2013.20%201.png?alt=media&token=e83e70f1-0fff-47ab-8a0e-ba419fc726aa',
    };
  }, []);

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={uri} />
      </View>

      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={getCongratsModalContent(t)[currentCategory as CategoryName].title}
      />

      <AppText
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={getCongratsModalContent(t).Basic.description}
      />

      <Gradient style={styles.btn}>
        <Button onPress={onCancelHandler} theme={ButtonTheme.CLEAR}>
          <AppText
            style={styles.btnText}
            size={TextSize.LEVEL_4}
            text={t('continue')}
          />
        </Button>
      </Gradient>
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
  },
  description: {
    marginBottom: verticalScale(40),
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    paddingVertical: verticalScale(8),
  },
  btnText: {
    color: 'white',
  },
  dontShowAgaing: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(10),
  },
  imageWrapper: {
    height: verticalScale(150),
    width: verticalScale(158),
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});

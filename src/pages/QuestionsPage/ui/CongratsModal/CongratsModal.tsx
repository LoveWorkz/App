import React, {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
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
  const currentCategory = profileStore.currentCategory?.currentCategory;
  const content = getCongratsModalContent(t)[currentCategory as CategoryName];

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  const uri = useMemo(() => {
    return {
      uri: content.image,
    };
  }, [content.image]);

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <View style={[{height: content.height, width: content.width}]}>
        <Image style={styles.image} source={uri} />
      </View>

      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={content.title}
      />

      <AppText
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={content.description}
      />
      <Button
        style={styles.btn}
        onPress={onCancelHandler}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={styles.btnText}
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
  btnText: {
    color: 'white',
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

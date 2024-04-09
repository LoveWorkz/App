import React, {useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {infoTextType} from '@src/widgets/InformationBlock';
import {ButtonCoordinates, popupWidth} from './InformationBlock';
import {AppText, TextSize} from '../AppText/AppText';
import {Button, ButtonTheme} from '../Button/Button';

interface InformationBlockPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  modalPosition: ButtonCoordinates;
  text: infoTextType[];
  title: string;
}

export const InformationBlockPopup = (props: InformationBlockPopupProps) => {
  const {visible, setVisible, modalPosition, text, title} = props;

  const colors = useColors();
  const {t} = useTranslation();

  const onCancelHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancelHandler}
      backdropColor="transparent"
      animationIn="bounceIn"
      style={styles.modal}>
      <View
        style={[
          styles.content,
          modalPosition,
          {backgroundColor: colors.bgQuaternaryColor},
        ]}>
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          weight={'700'}
          size={TextSize.LEVEL_6}
          text={title}
        />
        <View style={styles.texts}>
          {text.map(item => {
            return (
              <Text key={item.text} style={styles.textItem}>
                <AppText
                  style={[styles.text, {color: colors.primaryTextColor}]}
                  weight={'bold'}
                  size={TextSize.LEVEL_3}
                  text={item.boldString}
                />
                <AppText
                  align={'justify'}
                  style={[styles.text, {color: colors.primaryTextColor}]}
                  weight={'400'}
                  size={TextSize.LEVEL_3}
                  text={item.text}
                />
              </Text>
            );
          })}
        </View>
        <Button
          style={styles.btn}
          theme={ButtonTheme.GRADIENT}
          onPress={onCancelHandler}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('ok')}
          />
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  content: {
    position: 'absolute',
    borderRadius: moderateScale(20),
    borderTopRightRadius: 0,
    padding: horizontalScale(globalPadding),
    width: popupWidth,
    alignItems: 'flex-start',
    maxWidth: windowWidth - 40,
  },
  title: {
    textAlign: 'center',
  },
  texts: {
    marginTop: verticalScale(20),
  },
  textItem: {
    textAlign: 'justify',
    marginBottom: verticalScale(20),
  },
  text: {
    lineHeight: 17,
    marginVertical: verticalScale(10),
    textAlign: 'justify',
  },
  btn: {
    width: '100%',
  },
});

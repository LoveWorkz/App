import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {infoTextType} from '@src/widgets/InformationBlock';
import {ButtonCoordinates, defaultPopupWidth} from './InformationBlock';
import {AppText, TextSize} from '../AppText/AppText';
import {Button, ButtonTheme} from '../Button/Button';
import {ArranKennedyBlock} from '../ArranKennedyBlock/ArranKennedyBlock';

interface InformationChallengeBlockPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  modalPosition: ButtonCoordinates;
  text: infoTextType[];
  popupWidth?: number;
}

export const InformationChallengeBlockPopup = memo(
  (props: InformationChallengeBlockPopupProps) => {
    const {visible, setVisible, modalPosition, text, popupWidth} = props;

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
            {
              backgroundColor: colors.bgQuaternaryColor,
              width: popupWidth || defaultPopupWidth,
            },
          ]}>
          <ArranKennedyBlock />
          <View style={styles.texts}>
            {text.map((item, i) => {
              return (
                <View key={i.toString()} style={styles.textItem}>
                  <AppText
                    weight={'600'}
                    size={TextSize.LEVEL_2}
                    text={item.text}
                  />
                </View>
              );
            })}
          </View>
          <Button
            style={styles.btn}
            theme={ButtonTheme.CLEAR}
            onPress={onCancelHandler}>
            <AppText
              style={styles.btnText}
              size={TextSize.LEVEL_2}
              weight={'600'}
              text={t('Ok. I’ve got this')}
            />
          </Button>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  content: {
    position: 'absolute',
    borderRadius: moderateScale(20),
    borderTopRightRadius: 0,
    padding: horizontalScale(30),
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
  btnText: {
    textDecorationLine: 'underline',
  },
});

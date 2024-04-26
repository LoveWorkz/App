import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import {infoTextType} from '@src/widgets/InformationBlock';
import {InformationBlockButtonCoordinates} from '@src/shared/types/types';
import {DEFAULT_INFORMATION_POPUP_WIDTH} from '@src/shared/consts/common';
import {ChallengeInfoPopupContent} from './ChallengeInfoPopupContent';

interface ChallengeInfoPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  modalPosition?: InformationBlockButtonCoordinates;
  text: infoTextType[];
  popupWidth?: number;
}

export const ChallengeInfoPopup = memo((props: ChallengeInfoPopupProps) => {
  const {visible, setVisible, modalPosition, text = [], popupWidth} = props;

  const colors = useColors();

  const onCancelHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  if (!visible) {
    return null;
  }

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
          modalPosition || {},
          {
            backgroundColor: colors.bgQuaternaryColor,
            width: popupWidth || DEFAULT_INFORMATION_POPUP_WIDTH,
          },
        ]}>
        <ChallengeInfoPopupContent
          text={text}
          onBtnPressHandler={onCancelHandler}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  content: {
    position: 'absolute',
    borderRadius: moderateScale(20),
    borderTopRightRadius: 0,
    paddingHorizontal: horizontalScale(30),
    paddingVertical: verticalScale(30),
    alignItems: 'flex-start',
    maxWidth: windowWidth - 40,
  },
});

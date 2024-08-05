import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {observer} from 'mobx-react-lite';

import {infoTextType} from '@src/widgets/InformationBlock';
import {InformationBlockButtonCoordinates} from '@src/shared/types/types';
import {ChallengeIntroInfoPopup} from './ChallengeIntroInfoPopup';
import challengeStore from '../../model/store/challengeStore';

interface ChallengeInfoPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  modalPosition?: InformationBlockButtonCoordinates;
  text: infoTextType[];
  popupWidth?: number;
}

export const ChallengeInfoPopup = (props: ChallengeInfoPopupProps) => {
  const {visible, setVisible} = props;

  const specialChallenge = challengeStore.specialChallenge;

  const onCancelHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onBtnPressHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  if (!(visible && specialChallenge)) {
    return null;
  }

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancelHandler}
      backdropColor="transparent"
      animationIn="bounceIn"
      style={styles.modal}>
      <ChallengeIntroInfoPopup
        specialChallenge={specialChallenge}
        visible={visible}
        setVisible={setVisible}
        onBtnPressHandler={onBtnPressHandler}
      />
    </Modal>
  );
};

export default memo(observer(ChallengeInfoPopup));

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
});

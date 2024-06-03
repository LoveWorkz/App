import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {ChallengeInfoPopupContent} from './ChallengeInfoPopupContent';
import {SpecialChallengeType} from '../../model/types/ChallengeTypes';
import {getChallengeInfoPopupContent} from '../../model/lib/challenge';

interface ChallengeIntroInfoPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  specialChallenge: SpecialChallengeType;
  onBtnPressHandler: () => void;
}

export const ChallengeIntroInfoPopup = memo(
  (props: ChallengeIntroInfoPopupProps) => {
    const {visible, setVisible, specialChallenge, onBtnPressHandler} = props;

    const language = useLanguage();

    const onCancelHandler = useCallback(() => {
      setVisible(false);
    }, [setVisible]);

    const textList = useMemo(() => {
      return getChallengeInfoPopupContent({specialChallenge, language});
    }, [specialChallenge, language]);

    if (!visible) {
      return null;
    }

    return (
      <Modal
        contentStyle={styles.content}
        visible={visible}
        onClose={onCancelHandler}>
        <ChallengeInfoPopupContent
          text={textList}
          onBtnPressHandler={onBtnPressHandler}
        />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  content: {
    minHeight: verticalScale(188),
    alignItems: 'flex-start',
  },
});

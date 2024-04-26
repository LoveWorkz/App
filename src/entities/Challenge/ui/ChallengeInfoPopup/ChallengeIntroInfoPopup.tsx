import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {infoTextType} from '@src/widgets/InformationBlock';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ChallengeInfoPopupContent} from './ChallengeInfoPopupContent';

interface ChallengeIntroInfoPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  text: infoTextType[];
}

export const ChallengeIntroInfoPopup = memo(
  (props: ChallengeIntroInfoPopupProps) => {
    const {visible, setVisible, text = []} = props;

    const onCancelHandler = useCallback(() => {
      setVisible(false);
    }, [setVisible]);

    const onBtnPressHandler = useCallback(() => {
      navigation.navigate(AppRouteNames.SPECIAL_CHALLENGE_CARDS);
      setVisible(false);
    }, [setVisible]);

    if (!visible) {
      return null;
    }

    return (
      <Modal
        contentStyle={styles.content}
        visible={visible}
        onClose={onCancelHandler}>
        <ChallengeInfoPopupContent
          text={text}
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

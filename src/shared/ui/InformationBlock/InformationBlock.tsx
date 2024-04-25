import React, {memo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {InformationIcon} from '@src/shared/assets/icons/Information';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {infoTextType} from '@src/widgets/InformationBlock';
import {InformationBlockPopup} from './InformationBlockPopup';
import {InformationChallengeBlockPopup} from './InformationChallengeBlockPopup';

interface InformationBlockProps {
  text: infoTextType[];
  title?: string;
  isChallenge?: boolean;
  popupWidth?: number;
}

type RefWithMeasureInWindow = React.RefObject<View> & {
  current:
    | (React.Component<ViewProps> & {
        measureInWindow: (
          callback: (
            x: number,
            y: number,
            width: number,
            height: number,
          ) => void,
        ) => void;
      })
    | null;
};

export interface ButtonCoordinates {
  top: number;
  left: number;
}

export const defaultPopupWidth = horizontalScale(280);
const iconPadding = horizontalScale(10);

const InformationBlock = (props: InformationBlockProps) => {
  const {text, title, isChallenge = false, popupWidth} = props;

  const colors = useColors();
  const buttonRef: RefWithMeasureInWindow = useRef(null);

  const [visible, setVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<ButtonCoordinates>({
    top: 0,
    left: 0,
  });

  const onPressHandler = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setModalPosition({
          top: y - iconPadding + height + verticalScale(10),
          left: x + 10 + iconPadding - (popupWidth || defaultPopupWidth),
        });

        setVisible(true);
      });
    }
  };

  const popupContent = isChallenge ? (
    <InformationChallengeBlockPopup
      modalPosition={modalPosition}
      visible={visible}
      setVisible={setVisible}
      text={text}
      popupWidth={popupWidth}
    />
  ) : (
    <InformationBlockPopup
      modalPosition={modalPosition}
      visible={visible}
      setVisible={setVisible}
      text={text}
      title={title}
      popupWidth={popupWidth}
    />
  );

  return (
    <View style={styles.container}>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity style={styles.button} onPress={onPressHandler}>
          <SvgXml
            xml={InformationIcon}
            style={styles.icon}
            stroke={isChallenge ? colors.white : colors.primaryTextColor}
          />
        </TouchableOpacity>
      </View>

      {visible && popupContent}
    </View>
  );
};

export default memo(InformationBlock);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: iconPadding,
  },
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
  },
});

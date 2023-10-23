import React, {memo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {InformationIcon} from '@src/shared/assets/icons/Information';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {infoTextType} from '@src/widgets/InformationBlock';
import {InformationBlockPopup} from './InformationBlockPopup';

interface InformationBlockProps {
  text: infoTextType[];
  title: string;
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

export const popupWidth = horizontalScale(280);

const InformationBlock = (props: InformationBlockProps) => {
  const {text, title} = props;

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
          top: y + height + verticalScale(10),
          left: x + 8 - popupWidth,
        });

        setVisible(true);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View ref={buttonRef}>
        <TouchableOpacity onPress={onPressHandler}>
          <SvgXml
            xml={InformationIcon}
            style={styles.icon}
            stroke={colors.primaryTextColor}
          />
        </TouchableOpacity>
      </View>

      {visible && (
        <InformationBlockPopup
          modalPosition={modalPosition}
          visible={visible}
          setVisible={setVisible}
          text={text}
          title={title}
        />
      )}
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
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
  },
});

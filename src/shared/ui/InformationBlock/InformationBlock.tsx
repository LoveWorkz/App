import React, {ComponentType, memo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {InformationIcon} from '@src/shared/assets/icons/Information';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {InformationBlockButtonCoordinates} from '@src/shared/types/types';
import {DEFAULT_INFORMATION_POPUP_WIDTH} from '@src/shared/consts/common';
import {infoTextType} from '@src/widgets/InformationBlock';

interface PopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  text: infoTextType[];
  title?: string;
  popupWidth?: number;
}

interface InformationBlockProps {
  text: infoTextType[];
  title?: string;
  isChallenge?: boolean;
  popupWidth?: number;
  Popup: ComponentType<PopupProps>;
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

const iconPadding = horizontalScale(10);

const InformationBlock = (props: InformationBlockProps) => {
  const {text, title, isChallenge = false, popupWidth, Popup} = props;

  const colors = useColors();
  const buttonRef: RefWithMeasureInWindow = useRef(null);

  const [visible, setVisible] = useState(false);
  const [_modalPosition, setModalPosition] =
    useState<InformationBlockButtonCoordinates>({
      top: 0,
      left: 0,
    });

  const onPressHandler = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setModalPosition({
          top: y - iconPadding + height + verticalScale(10),
          left:
            x +
            10 +
            iconPadding -
            (popupWidth || horizontalScale(DEFAULT_INFORMATION_POPUP_WIDTH)),
        });

        setVisible(true);
      });
    }
  };

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

      <Popup
        visible={visible}
        setVisible={setVisible}
        text={text}
        title={title}
        popupWidth={popupWidth}
      />
    </View>
  );
};

export default memo(InformationBlock);

const styles = StyleSheet.create({
  container: {
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

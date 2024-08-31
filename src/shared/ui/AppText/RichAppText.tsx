import {Text} from 'react-native';
import React from 'react';
import {AppText, AppTextProps} from './AppText';

type Props = AppTextProps;

export const RichAppText = ({text, ...props}: Props) => {
  const getSmartBoldText = (
    textToParse: string,
    boldWrapperText: string = '**',
  ) => {
    const splitStringArr = textToParse.split(boldWrapperText);
    const textComponentsArr: React.JSX.Element[] = [];

    splitStringArr.forEach((innerString, index) => {
      if (index % 2 !== 0 && index !== splitStringArr.length - 1) {
        const boldText = (
          <AppText
            key={index}
            text={innerString}
            weight="700"
            style={props.style}
            // style={StyleSheet.flatten([
            //   style,
            //   // {borderWidth: 2},
            //   // {
            //   //   fontFamily:
            //   //     Platform.OS === 'ios'
            //   //       ? 'Quicksand-SemiBold'
            //   //       : 'QuicksandBold',
            //   // },
            //   // Platform.OS === 'ios' && {fontWeight: '700'},
            // ])}
            {...props}
          />
        );
        textComponentsArr.push(boldText);
      } else {
        const normalText = (
          <AppText text={innerString} key={index} {...props} />
        );
        textComponentsArr.push(normalText);
      }
    });

    return textComponentsArr;
  };

  return (
    <Text style={[props.style, {textAlign: props.align}]}>
      {getSmartBoldText(text, '**')}
    </Text>
  );
};

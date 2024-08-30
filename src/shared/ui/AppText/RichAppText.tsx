import {View, Text} from 'react-native';
import React from 'react';
import {AppText, AppTextProps} from './AppText';

type Props = AppTextProps;

export const RichAppText = ({text, style, ...props}: Props) => {
  const getSmartBoldText = (
    textToParse: string,
    boldWrapperText: string = '**',
  ) => {
    const splitStringArr = textToParse.split(boldWrapperText);
    console.log('STRINGS', splitStringArr);
    const textComponentsArr: React.JSX.Element[] = [];

    // Loop over split text
    splitStringArr.forEach((string, index) => {
      if (index % 2 !== 0 && index !== splitStringArr.length - 1) {
        const boldText = (
          <AppText
            key={index}
            text={string}
            weight="700"
            style={[
              style,
              // {
              //   fontFamily:
              //     Platform.OS === 'ios'
              //       ? 'Quicksand-SemiBold'
              //       : 'QuicksandBold',
              // },
              // Platform.OS === 'ios' && {fontWeight: '700'},
            ]}
            {...props}
          />
        );
        textComponentsArr.push(boldText);
      } else {
        const normalText = <AppText key={index} text={string} {...props} />;
        textComponentsArr.push(normalText);
      }
    });

    return textComponentsArr;
  };

  return (
    <View>
      <Text>{getSmartBoldText(text, '**')}</Text>
    </View>
  );
};

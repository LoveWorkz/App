import React, {memo, useCallback, useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {
  challengeLayoutIconZIndex,
  challengeLayoutZIndex,
  globalStyles,
} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {ChallengeCategoriesNames} from '../model/types/challengeCategory';

interface ChallangeProps {
  image?: string;
  name?: ChallengeCategoriesNames;
  isActive?: boolean;
  onPressHanlder?: (data: {id: string; name: string}) => void;
  isBlocked?: boolean;
  number?: string;
  id?: string;
}

const ChallengeCategory = (props: ChallangeProps) => {
  const {
    image,
    name,
    isActive = false,
    onPressHanlder,
    isBlocked = true,
    number,
    id,
  } = props;
  const colors = useColors();

  const onPressHandler = useCallback(() => {
    if (id && name && onPressHanlder) {
      onPressHanlder({id, name});
    }
  }, [onPressHanlder, id, name]);

  const uri = useMemo(() => {
    return {
      uri: image,
    };
  }, [image]);

  if (number) {
    return (
      <View style={[styles.challange, {...globalStyles.shadowOpacity}]}>
        <View style={[styles.content]}>
          {isActive ? (
            <AppText
              style={[{color: colors.primaryTextColor}]}
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={number}
            />
          ) : (
            <GradientText
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={number}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.challangeWrapper}>
      {isActive ? (
        <Gradient style={[styles.challange, {...globalStyles.shadowOpacity}]}>
          <TouchableOpacity onPress={onPressHandler}>
            <View style={[styles.content]}>
              <Image style={styles.image} source={uri} />
            </View>
          </TouchableOpacity>
        </Gradient>
      ) : (
        <View>
          <View style={[styles.challange, {...globalStyles.shadowOpacity}]}>
            <TouchableOpacity onPress={onPressHandler}>
              <View style={[styles.content]}>
                <Image style={styles.image} source={uri} />
              </View>
            </TouchableOpacity>
          </View>
          {isBlocked && (
            <>
              <View
                style={[
                  styles.layout,
                  {
                    zIndex: challengeLayoutZIndex,
                  },
                ]}
              />
              <View
                style={[
                  styles.lockIconWrapper,
                  {zIndex: challengeLayoutIconZIndex},
                ]}>
                <SvgXml xml={LockIcon} fill={'white'} style={styles.lockIcon} />
              </View>
            </>
          )}
        </View>
      )}
      {name && (
        <AppText
          style={[
            styles.name,
            {color: isActive ? colors.primaryTextColor : '#B6B6BD'},
          ]}
          weight={'500'}
          size={TextSize.LEVEL_1}
          text={name}
        />
      )}
    </View>
  );
};

export default memo(ChallengeCategory);

const styles = StyleSheet.create<Record<string, any>>({
  challangeWrapper: {
    alignItems: 'center',
  },
  challange: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    height: verticalScale(60),
    width: horizontalScale(60),
    backgroundColor: 'white',
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#F1F3FF',
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(3),
    paddingHorizontal: horizontalScale(3),
  },
  text: {
    color: 'black',
  },
  active: {
    backgroundColor: 'black',
  },
  activeText: {
    color: 'white',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  name: {
    marginVertical: verticalScale(5),
  },

  layout: {
    backgroundColor: 'black',
    position: 'absolute',
    opacity: 0.2,
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(40),
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  lockIcon: {
    height: verticalScale(27),
    width: horizontalScale(25),
  },
});

import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Challenge} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import challengesStore from '../../model/store/challengesStore';

export const Challenges = () => {
  const challenges = challengesStore.filteredChallengesList;
  const colors = useColors();
  const {t} = useTranslation();

  return (
    <LoaderWrapper isLoading={challengesStore.isChallengesLoading}>
      <View>
        {challenges.length ? (
          challenges.map(challange => {
            return (
              <View style={styles.subChallengeWrappper} key={challange.id}>
                <Challenge challenge={challange} />
              </View>
            );
          })
        ) : (
          <View style={styles.noResults}>
            <AppText
              style={{color: colors.primaryTextColor}}
              text={t('noResults')}
              size={TextSize.LEVEL_7}
            />
          </View>
        )}
      </View>
    </LoaderWrapper>
  );
};

export default memo(observer(Challenges));

const styles = StyleSheet.create({
  subChallengeWrappper: {
    marginBottom: verticalScale(10),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
});

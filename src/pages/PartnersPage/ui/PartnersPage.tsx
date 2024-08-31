import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import therapistsStore from '../model/therapistsStore';
import {observer} from 'mobx-react-lite';
import {TherapistItem} from '@src/entities/TherapistItem';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const PartnersPage = () => {
  useEffect(() => {
    therapistsStore.init();
  }, []);

  const therapists = therapistsStore.therapists;

  return (
    <View style={styles.partners}>
      {therapists.map((therapist, index) => (
        <TherapistItem
          key={therapist.id}
          onPress={() =>
            navigation.navigate(AppRouteNames.PARTNER_DETAILS, {
              id: therapist.id,
            })
          }
          imageName={therapist.image_name}
          fullName={therapist.full_name}
          headline={therapist.tile_headline.en}
          isOdd={index % 2 === 0}
        />
      ))}
    </View>
  );
};

export const Wrapper = memo(observer(PartnersPage));

const styles = StyleSheet.create({
  partners: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

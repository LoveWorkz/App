// import {Platform} from 'react-native';
import mobileAds, {
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

export const initAdmob = () => {
  mobileAds().initialize();
};

// const interstitialID = Platform.select({
//   ios: 'ca-app-pub-4287224605926771/4098715773',
//   android: 'ca-app-pub-4287224605926771/7818468938',
// });

export const initInterstitialAd = () => {
  // const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitialID || '';
  const adUnitId = TestIds.INTERSTITIAL;

  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

  return interstitial;
};

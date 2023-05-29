import {Platform} from 'react-native';
import mobileAds, {
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

export const initAdmob = () => {
  mobileAds().initialize();
};

const interstitialID = Platform.select({
  ios: 'ca-app-pub-9255281399250879/9567590913',
  android: 'ca-app-pub-9255281399250879/1315047442',
});

export const initInterstitialAd = () => {
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitialID || '';

  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

  return interstitial;
};

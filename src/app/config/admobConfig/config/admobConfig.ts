import {Platform} from 'react-native';
import mobileAds, {
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

export const initAdmob = () => {
  mobileAds().initialize();
};

const interstitialID = Platform.select({
  ios: 'ca-app-pub-39402560777742544/44777910',
  android: 'ca-app-pub-5750711746491614/3737075935',
});

export const initInterstitialAd = () => {
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : interstitialID || '';

  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

  return interstitial;
};

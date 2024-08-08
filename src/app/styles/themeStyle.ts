export type Colors =
  | 'white'
  | 'bgColor'
  | 'primaryTextColor'
  | 'bgSecondaryColor'
  | 'bgTertiaryColor'
  | 'bgQuaternaryColor'
  | 'secondaryTextColor'
  | 'homePageCategoryTextColor'
  | 'homePageCategoryTitleColor'
  | 'challengeCategoryNameColor'
  | 'appleIconColor'
  | 'authPageAgreementText'
  | 'categoryAndFavoritesTextColor'
  | 'black'
  | 'questionCardBackColor'
  | 'bgChallengeContentColor'
  | 'bgHomePageHeaderColor'
  | 'bgQuinaryColor'
  | 'orange'
  | 'purchaseDescriptionColor'
  | 'purchaseButtonColor'
  | 'secondaryError'
  | 'skeletonColor'
  | 'skeletonHighlightColor'
  | 'bgForgotPasswordPopupColor'
  | 'bgPopup'
  | 'bgLayout'
  | 'specialChallengeBgColor'
  | 'borderBottomColor'
  | 'goalIconBgColor'
  | 'topicDescriptionColor'
  | 'bgTabViewColor'
  | 'lightGreyColor'
  | 'themeSecondaryBackground'
  | 'bgOnboardingColor'
  | 'red'
  | 'lavenderBlue'
  | 'skyBlue'
  | 'periwinkleDust'
  | 'softPeriwinkle'
  | 'lilacBreeze'
  | 'disabledSessionColor'
  | 'challengeCardBtnColor'
  | 'whisperWhite'
  | 'tabIconColor'
  | 'activeTabIconColor';

export type ColorType = Record<Colors, string>;

const commonColor = {
  // activeTabIconColor: '#6a5ea9',
  authPageAgreementText: '#9A9AA5',
  black: '#000000',
  challengeCardBtnColor: '#f5f6f9',
  disabledSessionColor: '#D8DBE2',
  goalIconBgColor: '#83C0F833',
  lavenderBlue: '#847AED',
  lightGreyColor: '#D9D9D9',
  lilacBreeze: '#E3E6F6',
  orange: 'orange',
  periwinkleDust: '#c8cbee',
  red: 'red',
  secondaryError: '#E1437C',
  skyBlue: '#83C0F8',
  softPeriwinkle: '#DCE0F5',
  specialChallengeBgColor: '#39518080',
  // tabIconColor: '#A5AEF0',
  themeSecondaryBackground: '#695FCB',
  whisperWhite: '#fafbfc',
  white: '#FFFFFF',
};

const light: ColorType = {
  activeTabIconColor: '#6a5ea9',
  tabIconColor: '#A5AEF0',
  // bg colors
  bgChallengeContentColor: '#F1F3FF',
  bgColor: '#F4F6FA',
  bgForgotPasswordPopupColor: '#F4F6FA',
  bgHomePageHeaderColor: '#EEF4FF',
  bgLayout: 'rgba(57, 81, 128, 0.5)',
  bgOnboardingColor: '#FBFCFF',
  bgPopup: '#3951804D',
  bgQuaternaryColor: '#FFFFFF',
  bgQuinaryColor: '#FFFFFF',
  bgSecondaryColor: '#FFFFFF',
  bgTabViewColor: '#94ABFD',
  bgTertiaryColor: '#FFFFFF',
  purchaseButtonColor: '#B9C3FD',
  questionCardBackColor: '#F8F5FF',
  skeletonColor: '#E1E9EE',
  skeletonHighlightColor: '#F2F8FC',
  // text colors
  categoryAndFavoritesTextColor: '#395180',
  challengeCategoryNameColor: '#B6B6BD',
  homePageCategoryTextColor: '#885FFF',
  homePageCategoryTitleColor: '#395180',
  primaryTextColor: '#395180',
  purchaseDescriptionColor: '#8698BB',
  secondaryTextColor: '#B6B6BD',
  topicDescriptionColor: '#8989C1',
  // icons colors
  appleIconColor: '#1B1B1B',
  // border colors
  borderBottomColor: '#D9D8F0',
  ...commonColor,
};

const dark: ColorType = {
  activeTabIconColor: '#FFFFFF',
  tabIconColor: '#C0C3CF',
  // bg colors
  bgChallengeContentColor: '#242832',
  bgColor: '#1F232C',
  bgForgotPasswordPopupColor: '#242832',
  bgHomePageHeaderColor: '#242832',
  bgLayout: 'rgba(0, 0, 0, 0.5)',
  bgOnboardingColor: '#FBFCFF',
  bgPopup: '#000000',
  bgQuaternaryColor: '#242832',
  bgQuinaryColor: '#1F232C',
  bgSecondaryColor: '#2E3440',
  bgTabViewColor: '#94ABFD',
  bgTertiaryColor: '#2E3440',
  purchaseButtonColor: '#242832',
  questionCardBackColor: '#242832',
  skeletonColor: '#2E3440',
  skeletonHighlightColor: '#242832',
  // text colors
  categoryAndFavoritesTextColor: '#1F232C',
  challengeCategoryNameColor: '#C0C3CF',
  homePageCategoryTextColor: '#FFFFFF',
  homePageCategoryTitleColor: '#FFFFFF',
  primaryTextColor: '#C0C3CF',
  purchaseDescriptionColor: '#565F77',
  secondaryTextColor: '#4C5465',
  topicDescriptionColor: '#C0C3CF',
  // icons colors
  appleIconColor: '#FFFFFF',
  // border colors
  borderBottomColor: '#D9D8F0',
  ...commonColor,
};

export default {light, dark};

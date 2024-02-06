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
  | 'topicDescriptionColor';

export type ColorType = Record<Colors, string>;

const commonColor = {
  white: '#FFFFFF',
  black: '#000000',
  orange: 'orange',
  authPageAgreementText: '#9A9AA5',
  secondaryError: '#E1437C',
  specialChallengeBgColor: '#39518080',
  goalIconBgColor: '#83C0F833',
};

const light: ColorType = {
  // bg colors
  bgColor: '#F4F6FA',
  bgSecondaryColor: '#FFFFFF',
  bgTertiaryColor: '#FFFFFF',
  bgQuaternaryColor: '#FFFFFF',
  bgQuinaryColor: '#FFFFFF',
  bgHomePageHeaderColor: '#EEF4FF',
  questionCardBackColor: '#F8F5FF',
  bgChallengeContentColor: '#F1F3FF',
  purchaseButtonColor: '#B9C3FD',
  skeletonColor: '#E1E9EE',
  skeletonHighlightColor: '#F2F8FC',
  bgPopup: '#3951804D',
  bgLayout: 'rgba(57, 81, 128, 0.5)',
  bgForgotPasswordPopupColor: '#F4F6FA',

  // text colors
  primaryTextColor: '#395180',
  secondaryTextColor: '#B6B6BD',
  homePageCategoryTextColor: '#885FFF',
  homePageCategoryTitleColor: '#395180',
  challengeCategoryNameColor: '#B6B6BD',
  categoryAndFavoritesTextColor: '#395180',
  purchaseDescriptionColor: '#8698BB',
  topicDescriptionColor: '#8989C1',

  // icons colors
  appleIconColor: '#1B1B1B',

  // border colors
  borderBottomColor: '#D9D8F0',

  ...commonColor,
};

const dark: ColorType = {
  // bg colors
  bgColor: '#1F232C',
  bgSecondaryColor: '#2E3440',
  bgTertiaryColor: '#2E3440',
  bgQuaternaryColor: '#242832',
  bgQuinaryColor: '#1F232C',
  bgHomePageHeaderColor: '#242832',
  questionCardBackColor: '#242832',
  bgChallengeContentColor: '#242832',
  purchaseButtonColor: '#242832',
  skeletonColor: '#2E3440',
  skeletonHighlightColor: '#242832',
  bgForgotPasswordPopupColor: '#242832',
  bgPopup: '#000000',
  bgLayout: 'rgba(0, 0, 0, 0.5)',

  // text colors
  primaryTextColor: '#C0C3CF',
  secondaryTextColor: '#4C5465',
  homePageCategoryTextColor: '#FFFFFF',
  homePageCategoryTitleColor: '#FFFFFF',
  challengeCategoryNameColor: '#C0C3CF',
  categoryAndFavoritesTextColor: '#1F232C',
  purchaseDescriptionColor: '#565F77',
  topicDescriptionColor: '#C0C3CF',

  // icons colors
  appleIconColor: '#FFFFFF',

  // border colors
  borderBottomColor: '#D9D8F0',

  ...commonColor,
};

export default {light, dark};

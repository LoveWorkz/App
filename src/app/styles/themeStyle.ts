export type Colors =
  | 'commonWhite'
  | 'commonBlack'
  | 'themeColor'
  | 'white'
  | 'bgColor'
  | 'primaryTextColor';
export type ColorType = Record<Colors, string>;

const commonColor = {
  commonWhite: '#FFFFFF',
  commonBlack: '#000000',
};

const light: ColorType = {
  themeColor: '#FFFFFF',
  white: '#000000',
  bgColor: '#F4F6FA',
  primaryTextColor: '#395180',
  ...commonColor,
};

const dark: ColorType = {
  themeColor: 'black',
  white: '#FFFFFF',
  bgColor: '',
  primaryTextColor: 'black',
  ...commonColor,
};

export default {light, dark};

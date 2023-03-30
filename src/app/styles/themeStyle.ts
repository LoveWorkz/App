export type Colors = 'commonWhite' | 'commonBlack' | 'themeColor' | 'white';
export type ColorType = Record<Colors, string>;

const commonColor = {
  commonWhite: '#FFFFFF',
  commonBlack: '#000000',
};

const light: ColorType = {
  themeColor: '#FFFFFF',
  white: '#000000',
  ...commonColor,
};

const dark: ColorType = {
  themeColor: 'red',
  white: '#FFFFFF',
  ...commonColor,
};

export default {light, dark};

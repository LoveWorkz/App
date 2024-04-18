export const ArrowDownIcon = `
<svg  viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L6 6L11 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const GradientArrowDownIcon = `
<svg viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.99999 7.00003L10 2.00003L9 0.928955L4.99999 5.00003L1 0.928955L0 2.00003L4.99999 7.00003Z" fill="url(#paint0_linear_5715_29101)"/>
<defs>
<linearGradient id="paint0_linear_5715_29101" x1="1.58835e-08" y1="3.43328" x2="10.001" y2="3.45383" gradientUnits="userSpaceOnUse">
<stop stop-color="#94ABFD"/>
<stop offset="1" stop-color="#847AED"/>
</linearGradient>
</defs>
</svg>
`;

export const getArrowDownIcon = (isGradient = false) => {
  if (isGradient) {
    return GradientArrowDownIcon;
  }

  return ArrowDownIcon;
};

const PremiumGradientIcon = `
<svg viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.09488 2.43066H3.55414L1.81152 4.9714L6.09488 10.8998L9.43413 6.43386" stroke="url(#paint0_linear_5346_44094)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.79663 1.09961V3.88232M8.40527 2.49096H11.188" stroke="url(#paint1_linear_5346_44094)" stroke-width="1.5" stroke-linecap="round"/>
<defs>
<linearGradient id="paint0_linear_5346_44094" x1="1.81152" y1="5.92418" x2="9.43495" y2="5.93274" gradientUnits="userSpaceOnUse">
<stop stop-color="#94ABFD"/>
<stop offset="1" stop-color="#847AED"/>
</linearGradient>
<linearGradient id="paint1_linear_5346_44094" x1="8.40527" y1="2.24748" x2="11.1883" y2="2.25095" gradientUnits="userSpaceOnUse">
<stop stop-color="#94ABFD"/>
<stop offset="1" stop-color="#847AED"/>
</linearGradient>
</defs>
</svg>
`;

const PremiumIcon = `<svg viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.59512 2.43066H3.05439L1.31177 4.9714L5.59512 10.8998L8.93437 6.43386" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.29712 1.09961V3.88232M7.90576 2.49096H10.6885" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

export const getPremiumIcon = ({isGradient}: {isGradient: boolean}) => {
  if (isGradient) {
    return PremiumGradientIcon;
  }

  return PremiumIcon;
};

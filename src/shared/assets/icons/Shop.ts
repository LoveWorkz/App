const ShopIcon = `
<svg viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.000634614 13.1407C-0.0372727 15.2335 1.6278 16.9613 3.72063 17.0007H10.2806C12.3735 16.9613 14.0385 15.2335 14.0006 13.1407L13.5636 8.45265C13.4527 6.68529 12.216 5.19053 10.5006 4.75065C10.1432 4.64667 9.77289 4.59348 9.40063 4.59265H4.60063C4.22837 4.59348 3.85808 4.64667 3.50063 4.75065C1.78636 5.19067 0.550259 6.68433 0.438635 8.45065L0.000634614 13.1407Z" fill="#DCDCDC"/>
<path d="M10.5005 6.38862V4.36762C10.4627 2.4718 8.89635 0.964926 7.00049 1.00062C5.10462 0.964926 3.53823 2.4718 3.50049 4.36762V6.38762" stroke="#DCDCDC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ShopIconDark = `
<svg viewBox="0 0 15 17"  xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.000634614 13.1408C-0.0372727 15.2336 1.6278 16.9614 3.72063 17.0008H10.2806C12.3735 16.9614 14.0385 15.2336 14.0006 13.1408L13.5636 8.45277C13.4527 6.68541 12.216 5.19066 10.5006 4.75077C10.1432 4.64679 9.77289 4.59361 9.40063 4.59277H4.60063C4.22837 4.59361 3.85808 4.64679 3.50063 4.75077C1.78636 5.19079 0.550259 6.68445 0.438635 8.45077L0.000634614 13.1408Z" fill="#4E5462"/>
<path d="M10.5005 6.38862V4.36762C10.4627 2.4718 8.89635 0.964926 7.00049 1.00062C5.10462 0.964926 3.53823 2.4718 3.50049 4.36762V6.38762" stroke="#4E5462" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ShopIconWithGradient = `
<svg viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.000634614 13.1408C-0.0372727 15.2336 1.6278 16.9614 3.72063 17.0008H10.2806C12.3735 16.9614 14.0385 15.2336 14.0006 13.1408L13.5636 8.45277C13.4527 6.68541 12.216 5.19066 10.5006 4.75077C10.1432 4.64679 9.77289 4.59361 9.40063 4.59277H4.60063C4.22837 4.59361 3.85808 4.64679 3.50063 4.75077C1.78636 5.19079 0.550259 6.68445 0.438635 8.45077L0.000634614 13.1408Z" fill="url(#paint0_linear_5245_1157)"/>
<path d="M10.5 6.38862V4.36762C10.4623 2.4718 8.89587 0.964926 7 1.00062C5.10413 0.964926 3.53774 2.4718 3.5 4.36762V6.38762" stroke="url(#paint1_linear_5245_1157)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_5245_1157" x1="0" y1="10.7968" x2="14.0013" y2="10.7968" gradientUnits="userSpaceOnUse">
<stop stop-color="#83C0F8"/>
<stop offset="1" stop-color="#847AED"/>
</linearGradient>
<linearGradient id="paint1_linear_5245_1157" x1="3.5" y1="3.69431" x2="10.5" y2="3.69431" gradientUnits="userSpaceOnUse">
<stop stop-color="#83C0F8"/>
<stop offset="1" stop-color="#847AED"/>
</linearGradient>
</defs>
</svg>
`;

export const getShopIcon = ({isGradient = false, isDarkMode = false}) => {
  if (isGradient) {
    return ShopIconWithGradient;
  }

  if (isDarkMode) {
    return ShopIconDark;
  }

  return ShopIcon;
};

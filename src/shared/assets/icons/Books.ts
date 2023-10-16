export const BooksIcon = `
<svg  viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.625 0C0.728 0 0 0.72 0 1.60714V13.3929C0 14.28 0.728 15 1.625 15H10.8333V2.14286H8.66667V6.42857L7.04167 5.35714L5.41667 6.42857V2.14286H1.625C1.32599 2.14286 1.08333 1.90286 1.08333 1.60714C1.08333 1.31142 1.32599 1.07143 1.625 1.07143H11.9167V12.8571H13V0H1.625Z" fill="#DCDCDC" />
</svg>
`;

export const BooksIconDark = `
<svg  viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.625 0C0.728 0 0 0.72 0 1.60714V13.3929C0 14.28 0.728 15 1.625 15H10.8333V2.14286H8.66667V6.42857L7.04167 5.35714L5.41667 6.42857V2.14286H1.625C1.32599 2.14286 1.08333 1.90286 1.08333 1.60714C1.08333 1.31142 1.32599 1.07143 1.625 1.07143H11.9167V12.8571H13V0H1.625Z"  fill="#4E5462"/>
</svg>
`;

export const BooksIconWithGradient = `
<svg viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.625 0C0.728 0 0 0.72 0 1.60714V13.3929C0 14.28 0.728 15 1.625 15H10.8333V2.14286H8.66667V6.42857L7.04167 5.35714L5.41667 6.42857V2.14286H1.625C1.32599 2.14286 1.08333 1.90286 1.08333 1.60714C1.08333 1.31142 1.32599 1.07143 1.625 1.07143H11.9167V12.8571H13V0H1.625Z" fill="url(#paint0_linear_5245_2296)"/>
<defs>
<linearGradient id="paint0_linear_5245_2296" x1="0" y1="7.5" x2="13" y2="7.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#83C0F8"/>
<stop offset="1" stop-color="#847AED"/>
</linearGradient>
</defs>
</svg>
`;

export const getBooksIcon = ({isGradient = false, isDarkMode = false}) => {
  if (isGradient) {
    return BooksIconWithGradient;
  }

  if (isDarkMode) {
    return BooksIconDark;
  }

  return BooksIcon;
};

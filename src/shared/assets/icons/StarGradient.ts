export const getStarIcon = (isGradient?: boolean) => {
  if (isGradient) {
    return `<svg viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 0L5.57151 1.41314L7.32843 1.17157L7.08686 2.92849L8.5 4L7.08686 5.07151L7.32843 6.82843L5.57151 6.58686L4.5 8L3.42849 6.58686L1.67157 6.82843L1.91314 5.07151L0.5 4L1.91314 2.92849L1.67157 1.17157L3.42849 1.41314L4.5 0Z" fill="white"/>
        </svg>`;
  }

  return `
    <svg viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 0L5.57151 1.41314L7.32843 1.17157L7.08686 2.92849L8.5 4L7.08686 5.07151L7.32843 6.82843L5.57151 6.58686L4.5 8L3.42849 6.58686L1.67157 6.82843L1.91314 5.07151L0.5 4L1.91314 2.92849L1.67157 1.17157L3.42849 1.41314L4.5 0Z" fill="url(#paint0_linear_5172_6447)"/>
    <defs>
    <linearGradient id="paint0_linear_5172_6447" x1="0.5" y1="3.30001" x2="8.50086" y2="3.30999" gradientUnits="userSpaceOnUse">
    <stop stop-color="#94ABFD"/>
    <stop offset="1" stop-color="#847AED"/>
    </linearGradient>
    </defs>
    </svg>
    `;
};

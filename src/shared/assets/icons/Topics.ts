export const TopicIcon = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 5.66667V14C17.5 16.5 16.25 18.1667 13.3333 18.1667H6.66667C3.75 18.1667 2.5 16.5 2.5 14V5.66667C2.5 3.16667 3.75 1.5 6.66667 1.5H13.3333C16.25 1.5 17.5 3.16667 17.5 5.66667Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.9168 1.66699V8.21698C12.9168 8.58365 12.4835 8.76698 12.2168 8.52531L10.2835 6.74201C10.1252 6.59201 9.87514 6.59201 9.71681 6.74201L7.78352 8.52531C7.51685 8.76698 7.0835 8.58365 7.0835 8.21698V1.66699H12.9168Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.0415 11.667H14.5832" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 15H14.5833" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const getTopicIcon = ({isDarkMode = false}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _isDarkMode = isDarkMode;
  return TopicIcon;
};

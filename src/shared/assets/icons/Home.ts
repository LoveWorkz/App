const HomeIcon = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.00091 10.9673V15.6123C4.95843 17.4397 6.40451 18.9561 8.23191 19.0003H15.7699C17.5973 18.9561 19.0434 17.4397 19.0009 15.6123V10.9673C19.003 9.59674 18.3636 8.30422 17.2729 7.47427L14.2129 5.61927C12.8535 4.79358 11.1474 4.79358 9.78791 5.61927L6.72891 7.47427C5.63826 8.30422 4.99884 9.59674 5.00091 10.9673Z" fill="#DCDCDC" />
<path d="M14.1547 15.1836C13.6498 15.8671 12.8504 16.2704 12.0007 16.2704C11.1509 16.2704 10.3516 15.8671 9.84668 15.1836" stroke="#F4F6FA" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;

const HomeIconDark = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.00091 10.9673V15.6123C4.95843 17.4397 6.40451 18.9561 8.23191 19.0003H15.7699C17.5973 18.9561 19.0434 17.4397 19.0009 15.6123V10.9673C19.003 9.59674 18.3636 8.30422 17.2729 7.47427L14.2129 5.61927C12.8535 4.79358 11.1474 4.79358 9.78791 5.61927L6.72891 7.47427C5.63826 8.30422 4.99884 9.59674 5.00091 10.9673Z" fill="#4E5462" />
<path d="M14.1547 15.1836C13.6498 15.8671 12.8504 16.2704 12.0007 16.2704C11.1509 16.2704 10.3516 15.8671 9.84668 15.1836" stroke="#1F232C" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;

const HomeIconWithGradient = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.00091 10.9673V15.6123C4.95843 17.4397 6.40451 18.9561 8.23191 19.0003H15.7699C17.5973 18.9561 19.0434 17.4397 19.0009 15.6123V10.9673C19.003 9.59674 18.3636 8.30422 17.2729 7.47427L14.2129 5.61927C12.8535 4.79358 11.1474 4.79358 9.78791 5.61927L6.72891 7.47427C5.63826 8.30422 4.99884 9.59674 5.00091 10.9673Z" fill="url(#paint0_linear_2988_1275)"/>
<path d="M14.1547 15.1836C13.6498 15.8671 12.8504 16.2704 12.0007 16.2704C11.1509 16.2704 10.3516 15.8671 9.84668 15.1836" stroke-width="1.5" stroke-linecap="round"/>
<defs>
<linearGradient id="paint0_linear_2988_1275" x1="15" y1="6" x2="1" y2="6" gradientUnits="userSpaceOnUse">
<stop stop-color="#8CBBE9"/>
<stop offset="1" stop-color="#ECB7FF"/>
</linearGradient>
</defs>
</svg>
`;

export const getHomeIcon = ({isGradient = false, isDarkMode = false}) => {
  if (isGradient) {
    return HomeIconWithGradient;
  }

  if (isDarkMode) {
    return HomeIconDark;
  }

  return HomeIcon;
};

import React from 'react';

export function GoogleDriveLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-20.4 35.3c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.4 9.35z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-10.2-17.65c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 23.8h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  );
}

export function DropboxLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 43 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6 0L0 7.7 8.8 14.2 21.4 7.1zM0 21.2L12.6 28.9 21.4 21.4 8.8 14.2zM21.4 21.4L30.3 28.9 42.9 21.2 34.1 14.2zM42.9 7.7L30.3 0 21.4 7.1 34.1 14.2zM21.5 23.1L12.6 30.6 8.8 28.2V31.6L21.5 39.1 34.1 31.6V28.2L30.3 30.6z" fill="#0061FF"/>
    </svg>
  );
}

export function OneDriveLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 5.5C10.9 4 12.8 3.1 14.9 3.1c3.1 0 5.7 1.9 6.8 4.6.3-.1.6-.1.9-.1 2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5H5.5C3 16.6 1 14.6 1 12.1c0-2 1.3-3.7 3.1-4.3.3-1.2 1.5-2.3 2.8-2.3.9 0 1.8.4 2.6 1z" fill="#0078D4" transform="scale(0.9) translate(1,3)"/>
      <path d="M9.5 7.5c.8-.8 1.9-1.3 3.1-1.3 1.8 0 3.3 1 4.1 2.5.4-.1.8-.2 1.3-.2 2.2 0 4 1.8 4 4s-1.8 4-4 4H6c-1.9 0-3.5-1.6-3.5-3.5 0-1.5 1-2.8 2.3-3.2.1-1 .9-1.8 1.9-1.8.7 0 1.4.3 1.8.8z" fill="#0364B8" transform="scale(0.9) translate(1,3)"/>
    </svg>
  );
}

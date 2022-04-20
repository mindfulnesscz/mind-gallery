import React from 'react';

/**
 * Custom icons
 */

interface Props {
  className: string;
}

export const GalleryArrow: React.FC<Props> = ( { className } ) => {
  return (
    <svg className="w-full h-full" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
      <polygon className={className} points="50,22.9 6.1,22.9 18.3,10.4 16,8.1 0,24.6 16,41 18.3,38.8 6.1,26.2 50,26.2 "/>
    </svg>
  );
};

export const GalleryBottomButton: React.FC<Props> = ( { className } ) => {
  return (
    <svg className="w-full h-full" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
      <g>
        <polygon className={className} points="23.5,3 8.5,3 1,16 8.5,29 23.5,29 31,16"/>
      </g>
    </svg>
  );
};

export const GalleryBottomButtonHexagon: React.FC<Props> = ( { className } ) => {
  return (
    <svg className="w-full h-full" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
      <path className={className} d="M24,2.1H8L0,16l8,13.9h16L32,16L24,2.1L24,2.1z"/>
    </svg>
  );
};

export const HexaBig: React.FC<Props> = ( { className } ) => {
  return (
    <svg className="w-full h-full" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 80 80 ">
      <path className={className} d="M60,5.4H20L0,40l20,34.6h40L80,40L60,5.4L60,5.4z"/>
    </svg>
  );
};


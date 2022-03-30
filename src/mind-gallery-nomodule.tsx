import React from 'react';
import ReactDOM from 'react-dom';
import MindGallery from './mind-gallery';
import { MindGalleryImage } from './mind-gallery-types';

import './css/mind-gallery.css';



const galSettings = {
  imageRatio: 1.777777777777778,
  throttleDelay: 100,
  galleryEasing: { duration: 0.5, ease: 'easeInOutCubic' }
};


document.addEventListener( 'DOMContentLoaded', () => {

  const gs = document.querySelectorAll( '.mind-gallery-wrapper' );


  // all  galleries loop

  [].forEach.call( gs, ( div: HTMLDivElement ) => {

    const images: Array<MindGalleryImage> = [];
    const cont = div.querySelector( '.mind-gallery-container' );
    const data = div.querySelector( '.mind-gallery-data' );

    [].forEach.call( data.querySelectorAll( 'img' ), ( img: HTMLImageElement ) => {
      images.push(
        {
          node: {
            sourceUrl: img.getAttribute( 'src' ),
            srcSet: img.getAttribute( 'srcset' ),
            sizes: '(min-width: 1200) 1200, 100vw',
            width: img.getAttribute( 'width' ),
            height: img.getAttribute( 'height' ),
            altText: img.getAttribute( 'alt' ),
            caption: ( img.getAttribute( 'caption' ) ? img.getAttribute( 'caption' ) : '' ),
            type: img.getAttribute( 'type' ),
            mediaDetails: { width: parseInt( img.getAttribute( 'width' ) ), height: parseInt( img.getAttribute( 'height' ) ) }
          }
        }
      );
    } );
    console.log( images );
    ReactDOM.render(
      <MindGallery feed={images} settings={galSettings} />,
      div
    );
  } );

} );
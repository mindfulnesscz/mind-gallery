/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { createRoot } from 'react-dom/client';
import MindGallery from './mind-gallery';
import { MindGalleryImage } from './mind-gallery.d';

import './css/mind-gallery.css';



const galSettings = {
  imageRatio: 1.778,
  throttleDelay: 100,
  galleryEasing: { duration: 0.5, ease: 'easeInOutCubic' }
};

declare let videojs:any;


document.addEventListener( 'DOMContentLoaded', () => {

  const gs = document.querySelectorAll( '.mind-gallery-wrapper' );


  // all  galleries loop

  [].forEach.call( gs, ( div: HTMLDivElement ) => {

    const images: Array<MindGalleryImage> = [];
    const data = div.querySelector( '.mind-gallery-data' );
    const cont = div.querySelector( '.mind-gallery-container' );

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
    console.log( cont );
    const root = createRoot( cont! );
    root.render( <MindGallery feed={images} settings={galSettings} /> );
    

  } );

  
  // Loops generated video elements and initiates videojs on them

  const VideoElements = document.querySelectorAll( 'video' );
  [].forEach.call( VideoElements, ( el:HTMLVideoElement )=>{
    videojs( el );
  } );

} );
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { createRoot } from 'react-dom/client';
import MindGallery from './mind-gallery';
import { MindGalleryImage, MindGallerySettings } from './mind-gallery.d';

import './css/mind-gallery.css';


// all are strings since they derived from html data- tags
const defaultSettings = {
  ratio: '1.778',
  throttle: '100',
  easingduration: '0.5',
  easingtype: 'easeInOut',
  type: 'default',
  autoplay: 'true',
  scale: 'contain'
};

declare let videojs:any;


document.addEventListener( 'DOMContentLoaded', () => {

  const gs = document.querySelectorAll( '.mind-gallery-wrapper' );


  // all  galleries loop

  [].forEach.call( gs, ( div: HTMLDivElement ) => {

    const images: Array<MindGalleryImage> = [];
    const data = div.querySelector( '.mind-gallery-data' ) as HTMLDivElement;
    const cont = div.querySelector( '.mind-gallery-container' );

    // update default settings with settings provided from html gallery settings
    const dataObj:MindGallerySettings = {...defaultSettings, ...data.dataset};


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
    root.render( <MindGallery feed={images} settings={dataObj} /> );
    

  } );

  
  // Loops generated video elements and initiates videojs on them

  const VideoElements = document.querySelectorAll( 'video' );
  [].forEach.call( VideoElements, ( el:HTMLVideoElement )=>{
    videojs( el );
  } );

} );
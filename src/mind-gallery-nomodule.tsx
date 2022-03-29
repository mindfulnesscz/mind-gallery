import React from 'react'
import ReactDOM from 'react-dom'
import MindGallery from './mind-gallery'

import './sss/mind-gallery.css';

interface Props {
  feed: Array<WmGalleryImage>
  settings: WmGallerySettings
}

interface WmGalleryImage {
  node: {
    sourceUrl: string,
    srcSet: string,
    altText: string,
    mediaDetails: { width: number, height: number }
  }
}
interface WmGallerySettings {
  imageRatio: number
  throttleDelay: number
  galleryEasing: { duration: number, ease: string }
}

const galSettings = {
  imageRatio: 1.503703703703704,
  throttleDelay: 100,
  galleryEasing: { duration: 0.5, ease: 'easeInOutCubic' }
}


document.addEventListener('DOMContentLoaded', () => {

  const gs = document.querySelectorAll('.mind-gallery-wrapper');


  // all  galleries loop

  [].forEach.call(gs, (div: HTMLDivElement) => {

    let images: Array<WmGalleryImage> = [];
    const cont = div.querySelector('.mind-gallery-container');
    const data = div.querySelector('.mind-gallery-data');

    [].forEach.call(data.querySelectorAll('img'), (img: HTMLImageElement) => {
      images.push(
        {
          node: {
            sourceUrl: img.getAttribute('src'),
            srcSet: 'ahoj',
            altText: img.getAttribute('alt'),
            mediaDetails: { width: parseInt(img.getAttribute('width')), height: parseInt(img.getAttribute('height')) }
          }
        }
      )
    })
    console.log(images);
    ReactDOM.render(
      <MindGallery feed={images} settings={galSettings} />,
      div
    )
  });

});
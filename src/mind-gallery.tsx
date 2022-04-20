import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MindGalleryImage, MindGalleryProps } from './mind-gallery-types';
import Vimeo from '@vimeo/player';
import { GalleryArrow, GalleryBottomButton, GalleryBottomButtonHexagon, HexaBig } from './components/_icons';

import './css/mind-gallery.css';


const MindGallery: React.FC<MindGalleryProps> = ( { feed, settings } ) => {

  const [activeTitle, setActiveTitle] = useState( '' );
  const [autoplayTimer, setAutoplayTimer] = useState<NodeJS.Timeout | null>( null );


  const {
    imageRatio = 1.618,
    throttleDelay = 100,
    galleryEasing = { duration: .6, ease: 'Sine.easeInOut' }
  } = settings;

  const [galleryWidth, setGalleryWidth] = useState( 0 );
  const [active, setActive] = useState( 0 );
  const [throttled, setThrottled] = useState( false );
  const [autoplayEnabled, setAutoplayEnabled] = useState( true ); // needs to be true by default or obtained from settings var
  const [currentPlayer, setCurrentPlayer] = useState( null );


  const galleryCont = useRef<HTMLDivElement>( null );
  const empty = Array.from( { length: feed.length }, () => React.createRef() as React.Ref<HTMLDivElement> );
  const imageElArr = useRef( empty ) as any;


  const setGallerySizes = () => {
    console.log( 'setting' );

    if ( !throttled ) {
      if ( galleryCont && galleryCont.current ) {

        const w = galleryCont.current.offsetWidth;
        galleryCont.current.style.height = w / settings.imageRatio + 'px';

        setGalleryWidth( w );

        console.log( 'new height is ' + w / settings.imageRatio );
      }

      setThrottled( true );

      setTimeout( () => {
        console.log( 'wtfwtf' );
        setThrottled( false );
      }, 100 );
    }
  };

  const get_blur_url = ( srcset: string ) => {
    return srcset.split( ' ' )[0];
  };


  const nextImage = () => {
    const nextId = active === feed.length - 1 ? 0 : active + 1;
    showImage( nextId, active, 'next' );

  };

  const prevImage = () => {
    const prevId = active === 0 ? feed.length - 1 : active - 1;
    showImage( prevId, active, 'prev' );
  };

  const showImage = ( i: number, current = 0, button = '' ) => {

    const el_current = imageElArr.current[current].current;
    const el_next = imageElArr.current[i].current;

    if ( el_current && el_next ) {

      if ( autoplayTimer ) {
        clearTimeout( autoplayTimer );
      }

      //console.log( 'changing to '+ current +' - '+i );    

      /*console.log( '-----------------------' );
      console.log( el_current );
      console.log( el_next );
      console.log( 'galleryWidth = ' +galleryWidth );
      console.log( '-----------------------' );*/



      if ( button != 'init' ) {

        gsap.set( el_current, { left: 0 } );
        gsap.set( el_next, { left: i < current && button != 'next' || button == 'prev' ? '-100%' : '100%' } );

        gsap.to( el_current, { left: i < current && button != 'next' || button == 'prev' ? '100%' : '-100%', ...settings.galleryEasing } );
        gsap.to( el_next, {
          left: 0,
          ...settings.galleryEasing,
          onComplete: () => {
            if ( autoplayEnabled ) {
              setAutoplayTimer( setTimeout( () => {
                showImage( i + 1 === feed.length ? 0 : i + 1, i, 'next' );
              }, 5000 ) );
            }
          }
        } );
      }
      else if ( autoplayEnabled ) {
        setAutoplayTimer( setTimeout( () => {
          showImage( i + 1 === feed.length ? 0 : i + 1, i, 'next' );
        }, 5000 ) );
      }

      setActive( i );

      setActiveTitle( feed[i].node.altText );

      if ( currentPlayer ) {
        console.log( currentPlayer );
        currentPlayer.pause();
      }
      if ( feed[i].node.type == 'vimeo' ) {
        console.log( el_next );
        setCurrentPlayer( new Vimeo( el_next.querySelector( 'iframe' ) ) );
      }

    }
  };

  useEffect( () => {

    setGallerySizes();

    console.log( imageElArr.current[0].current );

    gsap.set( imageElArr.current[0].current, { left: 0 } );

    window.addEventListener( 'resize', setGallerySizes );

    setActiveTitle( feed[0].node.altText );

    feed.map( ( key, index ) => {

      if ( key.node.type == 'vimeo' ) {
        // shut the Autoplay feature if video is present. About to change to handle in v1.1
        console.log( 'shutting outoplay' );
        setAutoplayEnabled( false );
      }
    } );

    console.log( autoplayEnabled + ' - autoplay' );


    showImage( 0, feed.length - 1, 'init' );


    return () => {
      if ( autoplayTimer )
        clearTimeout( autoplayTimer );
      setAutoplayTimer( null );

      //this was used in next.js app when was causing problems during routing
      //window.removeEventListener('resize', setGallerySizes);
    };

  }, [autoplayEnabled] );


  const getItem = ( imageObject: MindGalleryImage ) => {
    if ( imageObject.node.type == 'vimeo' ) {
      return (
        <div className="mind-vimeo-responsive">
          <iframe
            className="mind-vimeo-responsive-item"
            src={imageObject.node.altText}
            width="1920"
            height="1080"
            allowFullScreen={true}
          />
        </div>
      );
    } else {
      return (
        <img
          className=""
          src={imageObject.node.sourceUrl}
          sizes="(min-width: 1024px) 1024px, 100vw"
          alt={imageObject.node.altText}
        />
      );
    }

  };

  return (
    <div className="flex relative flex-wrap justify-center w-full ">
      {/* -------- CONT-------- */}

      <div ref={galleryCont} className="overflow-hidden relative w-full rounded-3xl">

        {/* -------- IMAGES -------- */}
        {
          feed.map( ( key, index ) => {
            return (
              <div
                key={`image-${index}`}
                ref={imageElArr.current[index]}
                className={`element-${index} absolute left-full top-0  w-full h-full`}
              >
                <div className="relative w-full h-full">
                  {getItem( key )}
                </div>
              </div>
            );
          } )
        }

        {/* -------- LEFT AND RIGHT BUTTONS -------- */}

        <div
          onClick={nextImage}
          className="mind-hexa-button absolute top-1/2 -mt-7 md:-mt-10 w-14 h-14 md:w-20 md:h-20 rounded-full cursor-pointer sm:bottom-0 md:right-2 right-0"
        >
          <div className="relative p-4 z-10 rotate-180"><GalleryArrow className={'fill-itsblue w-2 h-2'}/></div>
          <div className="absolute z-0 w-full h-full top-0 left-0">
            <HexaBig className="fill-white "></HexaBig>
          </div>
        </div>
        <div
          onClick={prevImage}
          className="mind-hexa-button absolute top-1/2 left-0 -mt-7 md:-mt-10 w-14 h-14 md:w-20 md:h-20 rounded-full cursor-pointer md:left-2"
        >
          <div className="relative p-4 z-10"><GalleryArrow className={'fill-itsblue w-2 h-2'}/></div>
          <div className="absolute z-0 w-full h-full top-0 left-0">
            <HexaBig className="fill-white"></HexaBig>
          </div>
        </div>

        
        
      </div>
      {/* -------- TITLES -------- */}

      {/*<div className="my-1 italic text-center text-gray-400">
        {activeTitle}
      </div>*/}

      {/* -------- HEXAGONS BOTTOM MENU -------- */}

      <div className="flex justify-center w-full rounded-full">
        <div className="px-2">
          {
            feed.map( ( el, i ) =>
              <div
                onClick={i !== active ? () => { showImage( i, active, '' ); } : () => { console.log( '' ); }}
                key={`img-button-${i}`}
                className={`relative inline-block mx-1 lg:mx-1 mt-2 w-6 h-6 lg:w-10 lg:h-10 ${i !== active ? 'cursor-pointer' : ''}`}
              >
                <div className="mind-bottom-button absolute w-full h-full">
                  <GalleryBottomButton className={`${i === active ? 'stroke-itsblue' : 'stroke-gray-300'} fill-white`} />
                </div>

                <div className={`absolute w-full h-full p-2 duration-300 transition-all ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                  <GalleryBottomButtonHexagon className='fill-itsblue' />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default MindGallery;
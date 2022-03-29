import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MindGalleryImage, MindGalleryProps } from './mind-gallery-types'
import Vimeo from '@vimeo/player';

import './sss/mind-gallery.css';


const MindGallery: React.FC<MindGalleryProps> = ({ feed, settings }) => {

  const [activeTitle, setActiveTitle] = useState('');
  const [autoplayTimer, setAutoplayTimer] = useState<NodeJS.Timeout | null>(null);


  const {
    imageRatio = 1.618,
    throttleDelay = 100,
    galleryEasing = { duration: .6, ease: 'Sine.easeInOut' }
  } = settings;

  const [galleryWidth, setGalleryWidth] = useState(0);
  const [active, setActive] = useState(0);
  const [throttled, setThrottled] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true); // needs to be true by default or obtained from settings var
  const [currentPlayer, setCurrentPlayer] = useState(null);


  const galleryCont = useRef<HTMLDivElement>(null);
  const empty = Array.from({ length: feed.length }, () => React.createRef() as React.Ref<HTMLDivElement>);
  const imageElArr = useRef(empty) as any;


  const setGallerySizes = () => {
    console.log('setting');

    if (!throttled) {
      if (galleryCont && galleryCont.current) {

        const w = galleryCont.current.offsetWidth;
        galleryCont.current.style.height = w / settings.imageRatio + 'px';

        setGalleryWidth(w);

        console.log('new height is ' + w / settings.imageRatio);
      }

      setThrottled(true);

      setTimeout(() => {
        console.log('wtfwtf');
        setThrottled(false);
      }, 100);
    }
  };

  const get_blur_url = (srcset: string) => {
    return srcset.split(' ')[0];
  };


  const nextImage = () => {
    const nextId = active === feed.length - 1 ? 0 : active + 1;
    showImage(nextId, active, 'next');

  };

  const prevImage = () => {
    const prevId = active === 0 ? feed.length - 1 : active - 1;
    showImage(prevId, active, 'prev');
  };

  const showImage = (i: number, current = 0, button = '') => {

    const el_current = imageElArr.current[current].current;
    const el_next = imageElArr.current[i].current;

    if (el_current && el_next) {

      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
      }

      //console.log( 'changing to '+ current +' - '+i );    

      /*console.log( '-----------------------' );
      console.log( el_current );
      console.log( el_next );
      console.log( 'galleryWidth = ' +galleryWidth );
      console.log( '-----------------------' );*/



      if (button != 'init') {

        gsap.set(el_current, { left: 0 });
        gsap.set(el_next, { left: i < current && button != 'next' || button == 'prev' ? '-100%' : '100%' });

        gsap.to(el_current, { left: i < current && button != 'next' || button == 'prev' ? '100%' : '-100%', ...settings.galleryEasing });
        gsap.to(el_next, {
          left: 0,
          ...settings.galleryEasing,
          onComplete: () => {
            if (autoplayEnabled) {
              setAutoplayTimer(setTimeout(() => {
                showImage(i + 1 === feed.length ? 0 : i + 1, i, 'next');
              }, 5000));
            }
          }
        });
      }
      else if (autoplayEnabled) {
        setAutoplayTimer(setTimeout(() => {
          showImage(i + 1 === feed.length ? 0 : i + 1, i, 'next');
        }, 5000));
      }

      setActive(i);

      setActiveTitle(feed[i].node.altText);

      if (currentPlayer) {
        console.log(currentPlayer)
        currentPlayer.pause();
      }
      if (feed[i].node.caption != '') {
        console.log(el_next);
        setCurrentPlayer(new Vimeo(el_next.querySelector('iframe')))
      }

    }
  };

  useEffect(() => {

    setGallerySizes();

    console.log(imageElArr.current[0].current)

    gsap.set(imageElArr.current[0].current, { left: 0 });

    window.addEventListener('resize', setGallerySizes);

    setActiveTitle(feed[0].node.altText);

    // test if there is https://player.vimeo.com/something in image caption 
    const exp = /^https?:\/\/player.vimeo.com\/\b([-a-zA-Z0-9()@:%_\+.~#?&\/=])*$/
    const reg = new RegExp(exp);
    feed.map((key, index) => {
      console.log(reg.test(key.node.caption));
      if (reg.test(key.node.caption)) {
        // shut the Autoplay feature if video is present. About to change to handle in v1.1
        console.log('shutting outoplay');
        setAutoplayEnabled(false);
      }
    });

    console.log(autoplayEnabled + ' - autoplay');


    showImage(0, feed.length - 1, 'init')


    return () => {
      if (autoplayTimer)
        clearTimeout(autoplayTimer);
      setAutoplayTimer(null);

      //this was used in next.js app when was causing problems during routing
      //window.removeEventListener('resize', setGallerySizes);
    };

  }, [autoplayEnabled]);


  const getItem = (imageObject: MindGalleryImage) => {
    const exp = /^https?:\/\/player.vimeo.com\/\b([-a-zA-Z0-9()@:%_\+.~#?&\/=])*$/
    const reg = new RegExp(exp);
    if (reg.test(imageObject.node.caption)) {
      return (
        <div className="mind-vimeo-responsive">
          <iframe
            className="mind-vimeo-responsive-item"
            src={imageObject.node.caption}
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
      )
    }

  }

  return (
    <div className="flex relative flex-wrap justify-center w-full ">
      {/* -------- CONT-------- */}

      <div ref={galleryCont} className="overflow-hidden relative w-full rounded-3xl">

        {/* -------- IMAGES -------- */}
        {
          feed.map((key, index) => {
            return (
              <div
                key={`image-${index}`}
                ref={imageElArr.current[index]}
                className={`element-${index} absolute left-full top-0  w-full h-full`}
              >
                <div className="relative w-full h-full">
                  {getItem(key)}
                </div>
              </div>
            );
          })
        }

        {/* -------- LEFT AND RIGHT BUTTONS -------- */}
        <div
          onClick={nextImage}
          className="absolute top-1/2 right-0 -mt-6 w-12 h-12 bg-gray-900/40 rounded-full border-2 border-gray-500 cursor-pointer sm:bottom-0 md:right-2"
        >
          <div className="relative top-3 left-2 w-5 h-5 border-t-2 border-r-2 border-white rotate-45"></div>
        </div>
        <div
          onClick={prevImage}
          className="absolute top-1/2 left-0 -mt-6 w-12 h-12 bg-gray-900/40 rounded-full border-2 border-gray-500 cursor-pointer md:left-2"
        >
          <div className="relative top-3 left-4 w-5 h-5 border-b-2 border-l-2 border-white rotate-45"></div>
        </div>

        {/* -------- CIRCLES MENU -------- */}
        <div className="flex absolute bottom-2 justify-center w-full h-9 rounded-full  lg:h-12">
          <div className="px-2 bg-gray-900/40 rounded-full">
            {
              feed.map((el, i) =>
                <div
                  onClick={i !== active ? () => { showImage(i, active, ''); } : () => { console.log(''); }}
                  key={`img-button-${i}`}
                  className={`inline-block mx-1 lg:mx-2 mt-2 w-5 h-5 lg:w-8 lg:h-8 border border-white rounded-full ${i !== active ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex justify-center content-center items-center w-full h-full">
                    <div className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full bg-white duration-500 transition-all ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* -------- TITLES -------- */}
      <div className="my-4 italic text-center text-gray-400">
        {activeTitle}
      </div>
    </div>
  );
};

export default MindGallery;
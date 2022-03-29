import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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

const MindGallery: React.FC<Props> = ({ feed, settings }) => {

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
  const galleryCont = useRef<HTMLDivElement>(null);
  const empty = Array.from({ length: feed.length }, () => React.createRef() as React.Ref<HTMLDivElement>);
  const imageElArr = useRef(empty) as any;


  const setGallerySizes = () => {

    if (!throttled) {
      if (galleryCont && galleryCont.current) {

        const w = galleryCont.current.offsetWidth;
        galleryCont.current.style.height = w / settings.imageRatio + 'px';

        setGalleryWidth(w);
      }
      setThrottled(true);

      setTimeout(() => {
        setThrottled(false);
      }, settings.throttleDelay);
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

  const wmLoader = (src: any) => {
    const sub = src.src.substring(0, src.src.length - 5);
    const sub_rep = sub.replace('-scaled', '');
    const add = (src.width && src.width != 2048) ? '-' + src.width + 'x' + Math.round(src.width / imageRatio) : '';

    return sub_rep + add + '.webp';

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
            setAutoplayTimer(setTimeout(() => {
              showImage(i + 1 === feed.length ? 0 : i + 1, i, 'next');
            }, 5000));
          }
        });
      }
      else {
        setAutoplayTimer(setTimeout(() => {
          showImage(i + 1 === feed.length ? 0 : i + 1, i, 'next');
        }, 5000));
      }

      setActive(i);

      setActiveTitle(feed[i].node.altText);

    }
  };

  useEffect(() => {

    setGallerySizes();

    console.log(imageElArr.current[0].current)

    gsap.set(imageElArr.current[0].current, { left: 0 });

    window.addEventListener('resize', setGallerySizes);

    setActiveTitle(feed[0].node.altText);


    showImage(0, feed.length - 1, 'init');


    return () => {
      if (autoplayTimer)
        clearTimeout(autoplayTimer);
      setAutoplayTimer(null);
      window.removeEventListener('resize', setGallerySizes);
    };

  }, []);

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
                className={`element - ${index} absolute left-full top-0  w-full h-full`}
              >
                <div className="relative w-full h-full">
                  <img
                    className=""
                    src={key.node.sourceUrl}
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    alt={key.node.altText}
                  />
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
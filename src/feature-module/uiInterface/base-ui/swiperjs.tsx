import { useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles

// import required modules
import { Pagination, Navigation, Mousewheel, Keyboard, Scrollbar, EffectCube, EffectFade, EffectFlip, EffectCoverflow, FreeMode, Thumbs, Autoplay } from 'swiper/modules';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

const Swiperjs = () => {

    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const handleThumbsSwiper = (swiper:any) => {
        setThumbsSwiper(swiper);
      };
    return (
        <div className="page-wrapper cardhead">
           
        </div>

    )
}

export default Swiperjs

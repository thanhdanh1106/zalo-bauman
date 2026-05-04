import { metaProps } from '@shared/types/meta';
import { postProps } from '@shared/types/post';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination, Parallax } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BlogBanner from '@/Templates/Blog/BlogBanner';
import { findManyPosts } from '@shared/utils/Posts';
import { IconButton } from '@mui/material';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import 'swiper/css';
type Props = {};

const APP_URL = import.meta.env.VITE_API_URL;

const FeaturedBlogs = (props: Props) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const swiperRef = useRef<SwiperType>();
  const [data, setData] = useState<postProps[]>([]);

  async function handleFindManyBlogs() {
    const response: {
      meta: metaProps;
      data: postProps[];
      error: boolean;
    } = await findManyPosts({});

    if (response && !response.error) {
      const { meta, data } = response;
      setData(data);
    }
  }

  useEffect(() => {
    handleFindManyBlogs();
  }, []);

  return (
    <div className="relative">
      <div className="flex gap-3 absolute bottom-0 right-0 z-[2] p-5">
        <div ref={navigationPrevRef}>
          <IconButton sx={{ background: '#ffffff6e' }}>
            <IoChevronBack color="#333" />
          </IconButton>
        </div>
        <div ref={navigationNextRef}>
          <IconButton sx={{ background: '#ffffff6e' }}>
            <IoChevronForward color="#333" />
          </IconButton>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Parallax]}
        spaceBetween={20}
        speed={460}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
        loop={true}
        freeMode={false}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation) {
            (swiper.params.navigation as any).prevEl =
              navigationPrevRef.current;
            (swiper.params.navigation as any).nextEl =
              navigationNextRef.current;
          }
        }}
      >
        {Array.isArray(data) && data.length
          ? data.map((val) => {
              return (
                <SwiperSlide key={val.id}>
                  <BlogBanner data={val} />
                </SwiperSlide>
              );
            })
          : ''}
      </Swiper>
    </div>
  );
};

export default FeaturedBlogs;



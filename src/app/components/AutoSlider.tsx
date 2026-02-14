"use client"
// No React hooks needed for this component
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface SliderItem {
  id: number;
  title?: string;
  name?: string;
  img: string;
}

interface AutoSliderProps {
  items: SliderItem[];
  type: 'package' | 'destination';
}

export default function AutoSlider({ items, type }: AutoSliderProps) {
  return (
    <div className="relative group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className="w-full"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            {type === 'package' ? (
              <Link href={`/${type}/${item.id}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-[250px] w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={item.img}
                      alt={type === 'package' ? item.title! : item.name!}
                      width={400}
                      height={250}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl" />
                  </div>
                  <div className="p-6 rounded-b-2xl bg-gradient-to-br from-gray-50 to-white text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {type === 'package' ? item.title : item.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
                <div className="relative h-[250px] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={item.img}
                    alt={item.name!}
                    width={400}
                    height={250}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl" />
                </div>
                <div className="p-6 rounded-b-2xl bg-gradient-to-br from-gray-50 to-white text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h3>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}

        {/* Navigation Arrows */}
        <div className="swiper-button-prev !w-12 !h-12 !bg-white/90 !rounded-full !shadow-lg after:!text-blue-600 after:!text-xl hover:!bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 !left-2" />
        <div className="swiper-button-next !w-12 !h-12 !bg-white/90 !rounded-full !shadow-lg after:!text-blue-600 after:!text-xl hover:!bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 !right-2" />
      </Swiper>

      {/* Pagination */}
      <div className="swiper-pagination !bottom-0 mt-4" />
    </div>
  );
} 
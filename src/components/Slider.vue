<template>
    <div class="w-full">
        <Swiper
  :modules="[Navigation, Pagination, Autoplay]"
  :slides-per-view="5"
  :space-between="5"
  :pagination="{ clickable: true }"
  :navigation="true"
  :autoplay="{ delay: 3000 }"
>
  <SwiperSlide v-for="(img, i) in images" :key="i">
    <img :src="img" class="rounded-xl w-full h-auto mt-2 px-2" />
  </SwiperSlide>
</Swiper>



    </div>
  </template>
  
  <script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
  '/img/slider1.png',
  '/img/slider2.png',
  '/img/slider3.png',
  '/img/slider2.png',
  '/img/slider1.png',
  '/img/slider3.png',
];
</script>

  
<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: #EA226D !important; /* Warna tombol */
  background-color: transparent !important;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  color: #FF5722 !important; /* Warna saat hover */
}
</style>


  
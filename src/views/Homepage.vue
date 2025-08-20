<template>
  <HeaderHomepage />

  <img src="../assets/img/header.png" class="h-3/4 w-screen mx-auto mt-2">
  
  <Slider />

  <div class="relative w-full">
    <!-- Bagian Atas (Ungu) -->
    <div class=" py-8 flex justify-center mt-24 animate-fade-in">
    <div class="relative bg-gradient-to-t from-pink to-ungu rounded-lg px-6 md:py-12 py-5 w-11/12 md:w-4/5 lg:w-3/4">
      <!-- Kartu Kuning di Atas -->
      <div class="absolute -top-20 right-6 flex gap-4 items-center text-center">
        <div class="w-16 h-20 md:w-36 md:h-44 bg-ungutua rounded-md flex flex-col items-center justify-center transition-all duration-1000 ease-in-out transform hover:scale-[1.10]">
          <img src="../assets/img/lokasibewarna.png" class="w-auto h-14 md:h-28 md:mb-2" />
          <h1 class="font-bold text-xs md:text-base text-ungutext">SURABAYA</h1>
        </div>

        <div class="w-16 h-20 md:w-36 md:h-44 bg-ungutua rounded-md flex flex-col items-center justify-center transition-all duration-1000 ease-in-out transform hover:scale-[1.10]">
          <img src="../assets/img/lokasibewarna.png" class="w-auto h-14 md:h-28 md:mb-2" />
          <h1 class="font-bold text-xs md:text-base text-ungutext">MALANG</h1>
        </div>

        <div class="w-16 h-20 md:w-36 md:h-44 bg-ungutua rounded-md flex flex-col items-center justify-center transition-all duration-1000 ease-in-out transform hover:scale-[1.10]">
          <img src="../assets/img/lokasibewarna.png" class="w-auto h-14 md:h-28 md:mb-2" />
          <h1 class="font-bold text-xs md:text-base text-ungutext">JAKARTA</h1>
        </div>
      </div>

      <!-- Konten Dalam Box -->
      <div class="text-center md:mt-20">
        <h2 class="md:text-xl text-sm  font-semibold md:mb-6 mb-2 text-ungutext">ABOUT US</h2>
        <p class="md:text-base text-xs text-ungutext">Weekendplan is a fun and meaningful space to learn and get creative. You can explore your interests, build your skills, and meet people who vibe with you. We believe that when learning is fun, it opens up way more chances to create — whether you're just starting out or ready to level up!</p>
      </div>
    </div>
  </div>

  <div class="relative bg-fixed bg-cover bg-center md:mt-10 mt-5 h-[30vh] md:h-[40vh]" style="background-image: url('/img/bg1.png');">
    <!-- Layer overlay hitam -->
    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 text-kuning text-center">
            <div>
                <h1 class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold">Creative Workshops Classes</h1>
            </div>
            <div>
                <h1 class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold">Community & Collaboration Space</h1>
            </div>
            <div>
                <h1 class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold">Project-Based Learning Experience</h1>
            </div>
        </div>
    </div>
</div>

            <!-- LASTEST EVENT  -->
            <div class="grid grid-cols-4 w-full">
    <Flipcard
      v-for="(item, index) in projects"
      :key="index"
      :image="item.image"
      :title="item.title"
      :backText="item.backText"
    />
  </div>
    </div>

    <div class="py-20 flex items-center justify-center ">
  <div class="grid grid-cols-1 md:grid-cols-2 w-11/12 md:w-3/4 bg-pinktua rounded-xl animate-fade-in overflow-hidden">
    <!-- Left side (Text & Button) -->
    <div class="flex flex-col p-6 md:p-8 mt-4 text-center md:text-left">
      <h2 class="text-lg md:text-xl font-bold text-pink">Make your Weekend more productive with us!</h2>
      <h1 class="text-sm md:text-md font-medium mt-4 text-pink">Register now and be part of the Weekendplan creative community.</h1>
      <RouterLink to="/createaccount">
        <button class="bg-pink text-ungutext px-6 py-2 rounded-lg w-fit mx-auto md:mx-0 mt-8 border border-pinktua">Register</button>
      </RouterLink>
    </div>

    <!-- Right side (Image) -->
    <div class="flex items-center justify-center border-t md:border-t-0 md:border-l border-pinktua p-4">
      <img src="../assets/img/dashboard.png" alt="dashboard" class="w-40 md:w-56 h-auto animate-fade-in-right">
    </div>
  </div>
</div>

<div class="relative w-full overflow-hidden bg-gradient-to-t from-kuning to-pink"> 
  <div
    ref="carousel"
    class="flex gap-4 overflow-x-auto scroll-smooth px-4 py-6 max-w-[1200px] mx-auto"
  >
  <div
  v-for="item in feedbackList"
  :key="item.id"
  class="w-[250px] h-[200px] md:w-[25%] md:h-[250px]  bg-gradient-to-t from-pink to-kuning border border-pinktua rounded-2xl p-6 flex-shrink-0 text-center flex flex-col items-center justify-start shadow-md"
>
  <!-- Foto lebih besar -->
  <div class="flex justify-center mb-4">
    <img
      :src="item.user.profile_photo_url"
      alt="User Photo"
      class="w-24 h-24 rounded-full object-cover shadow-lg"
    />
  </div>

  <!-- Nama user -->
  <p class="font-bold mb-2 text-lg md:text-xl text-ungutext">{{ item.user.name }}</p>

  <!-- Komentar -->
  <p class="text-sm md:text-base text-ungutext whitespace-pre-line mt-auto">
    {{ item.comment }}
  </p>
</div>

  </div>

  <!-- Left/Right Buttons (optional) -->
  <!-- <button @click="scrollLeft" class="absolute left-0 top-1/2 -translate-y-1/2 text-2xl px-2">
    &lt;
  </button>
  <button @click="scrollRight" class="absolute right-0 top-1/2 -translate-y-1/2 text-2xl px-2">
    &gt;
  </button> -->



  <!-- Left/Right Buttons -->
  <button
    @click="scrollLeft"
    class="absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl px-2"
  >
    &lt;
  </button>
  <button
    @click="scrollRight"
    class="absolute right-0 top-1/2 transform -translate-y-1/2 text-2xl px-2"
  >
    &gt;
  </button>
</div>
  
</template>

<script>
import axios from 'axios';
import HeaderHomepage from '@/components/HeaderHomepage.vue';
import Slider from '@/components/Slider.vue';
import Flipcard from '@/components/Flipcard.vue';

import slider1 from '../assets/img/bakingclass.jpg';
import slider2 from '../assets/img/cookingclass.jpg';
import slider3 from '../assets/img/flowerclass.jpg';
import slider4 from '../assets/img/potteryclayclass.jpg';
import slider5 from '../assets/img/cakedekor.jpg';
import slider6 from '../assets/img/craftingclass.jpg';
import slider7 from '../assets/img/formulatingclass.jpg';
import slider8 from '../assets/img/makeupclass.jpg';

export default {
  name: 'HomePage',

  components: {
    HeaderHomepage,
    Slider,
    Flipcard,
  },

  data() {
    return {
      projects: [
        { image: slider1, title: 'Baking Class', backText: 'Baking Class' },
        { image: slider2, title: 'Cooking Class', backText: 'Cooking Class' },
        { image: slider3, title: 'Flower Class', backText: 'Flower Classe' },
        { image: slider4, title: 'Cake Decor Class', backText: 'Cake Decor Class' },
        { image: slider5, title: 'Pottery & Clay Class', backText: 'Pottery & Clay Class' },
        { image: slider6, title: 'Crafting Class', backText: 'Crafting Class' },
        { image: slider7, title: 'Formulating Class', backText: 'Formulating Class' },
        { image: slider8, title: 'Makeup Class', backText: 'Makeup Class' }
      ],
      feedbackList: []
    };
  },

  mounted() {
    this.fetchFeedback(); // panggil fetch setelah mount
  },

  methods: {
    fetchFeedback() {
      const config = {
        method: 'get',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/feedback/verified'
      };

      axios(config)
        .then(response => {
          this.feedbackList = response.data.data;
        })
        .catch(error => {
          console.error('Gagal mengambil data feedback:', error);
        });
    },
    scrollLeft() {
  this.$refs.carousel.scrollBy({ left: -300, behavior: 'smooth' });
},
scrollRight() {
  this.$refs.carousel.scrollBy({ left: 300, behavior: 'smooth' });
}

  }
};
</script>


<style scoped>
button {
  transition: all 0.2s;
}
button:hover {
  transform: scale(1.05);
}
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.7s ease-out forwards;
}
.animate-slide-down {
  animation: slide-down 0.6s ease-out forwards;
}
.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}
.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out forwards;
}

</style>

<template>
  <div
    id="app"
    class="min-h-screen flex flex-col justify-between bg-pink font-poppins"
  >
    <!-- Jika header global -->
    <!-- <Header /> -->

    <main class="flex-grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'; // pastikan path-nya benar

export default {
  name: 'App',
  components: {
    Footer,
  },
};
</script>

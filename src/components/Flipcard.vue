<template>
  <div class="relative w-full aspect-[4/3] perspective">
    <div class="flip-card-inner w-full h-full">
      <div class="flip-card-front w-full h-full absolute">
        <img :src="image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center p-2">
          <p class="text-pink text-sm sm:text-base md:text-xl text-center">{{ title }}</p>
        </div>
      </div>
      <div class="flip-card-back w-full h-full absolute transform rotate-y-180">
        <img :src="image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center p-2">
          <p class="text-pink text-sm sm:text-base md:text-xl text-center">{{ backText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
defineProps({
  image: String,
  title: String,
  backText: String,
})


</script>

<style scoped>
/* Flip effect */
.perspective {
  perspective: 1000px;
}

.flip-card-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.perspective:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

</style>

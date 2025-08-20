<template>
    <div :class="navbarClasses" class="navbar w-full fixed top-0 left-0 z-50 p-4 transition-all duration-300 ease-in-out bg-ungu">
      <div class="flex flex-wrap items-center w-full">
        <!-- Logo dan Nama -->
        <div class="flex flex-col items-center mb-1 md:mb-0">
          <img src="../assets/img/logoo.png" alt="Logo" class="w-16 h-auto mt-1 ml-4 md:ml-12">
        </div>
  
        <!-- Menu Links (Desktop) -->
        <div class="hidden md:flex items-center gap-10 mt-4 ml-4 md:ml-20 flex-grow">
          <RouterLink to="/dashboard/admin" class="py-2 font-semibold">Dashboard</RouterLink>
          <RouterLink to="/classlist/admin" class="py-2 font-semibold">Class</RouterLink>
          <!-- <RouterLink to="/transaction" class="py-2 font-semibold">Transaction</RouterLink> -->
          
          <!-- Profile Dropdown Button -->
          <div class="ml-auto relative">
            <button
              ref="dropdownButton"
              @click.stop="toggleDropdown"
              class="px-4 py-2 rounded-md flex items-center space-x-2">
              <span class="font-semibold">Profile</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
  
            <!-- Dropdown Menu -->
            <transition name="fade">
              <div
                ref="dropdownMenu"
                v-if="isDropdownOpen"
                class="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50 hover:text-pinktua">
                <button class="block px-4 py-2 text-gray-800 hover:bg-pinktua w-full text-left">My Account </button>
                <RouterLink to="/login">
                  <button class="block px-4 py-2 text-red-600 hover:bg-pinktua w-full text-left">
                    Logout
                  </button>
                </RouterLink>
              </div>
            </transition>
          </div>
        </div>
  
        <!-- Burger Menu (Mobile) -->
        <div class="md:hidden ml-auto">
          <button @click="toggleMenu" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
  
        <!-- Mobile Menu -->
        <div
          class="md:hidden absolute top-16 right-0 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4 transition-transform"
          :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}">
          <ul class="space-y-4 font-semibold">
            <li>
              <RouterLink to="/dashboard">Dashboard</RouterLink>
            </li>
            <li>
              <RouterLink to="/classlist/admin">Class</RouterLink>
            </li>
            <li>
              <!-- <RouterLink to="/transaction">Transaction</RouterLink> -->
            </li>
            <li>
              <button
                @click.stop="toggleDropdown"
                class="w-full px-4 py-2 rounded-md flex items-center space-x-2 hover:text-pinktua">
                <span class="font-semibold hover:text-pinktua">Profile</span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
  
              <!-- Dropdown Menu (Mobile) -->
              <transition name="fade">
                <div v-if="isDropdownOpen" class="mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md">
                  <button class="block px-4 py-2 text-gray-800 hover:bg-pinktua w-full text-left">My Account  <UbahProfil /></button>
                  <RouterLink to="/">
                  <button class="block px-4 py-2 text-red-600 hover:bg-pinktua w-full text-left">
                    Logout
                  </button>
                </RouterLink>
                </div>
              </transition>
            </li>
          </ul>
        </div>
      </div>
    </div>
  
    <!-- Konten halaman di sini -->
    <div class="page-content pt-20"> <!-- Padding top untuk navbar -->
      <p></p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDropdownOpen: false,
        isMenuOpen: false,
        isScrolled: false,
      };
    },
    computed: {
      navbarClasses() {
        return {
          'bg-transparent': !this.isScrolled, // Warna transparan sebelum scroll
          'bg-white shadow-lg': this.isScrolled, // Ubah menjadi putih dan tambahkan bayangan saat scroll
        };
      },
    },
    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      handleScroll() {
        this.isScrolled = window.scrollY > 50; // Jika scroll lebih dari 50px
      },
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll); // Tambahkan event listener untuk scroll
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll); // Bersihkan event listener
    },
  };
  </script>
  
  <style scoped>
  
  button {
    transition: all 0.2s;
  }
  button:hover {
    transform: scale(1.05);
  }
  /* Warna default link */
  a {
    color: black;
    text-decoration: none;
  }
  
  /* Saat di-hover */
  a:hover {
    color: #A55166;
  }
  
  /* Saat link di-klik */
  a:active, a:focus {
    color: #A55166;
  }
  
  /* Saat link aktif (Vue Router) */
  .router-link-active {
    color: #A55166;
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
  </style>
  
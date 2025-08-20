<template>
<div :class="navbarClasses" class="navbar w-full fixed top-0 left-0 z-50 p-4 transition-all duration-300 ease-in-out bg-ungutua">
  <div class="flex justify-between items-center w-full animate-fade-in">
    
    <!-- KIRI: Logo -->
    <div class="flex items-center">
      <img src="../assets/img/logoo.png" alt="Logo" class="w-16 h-auto ml-4 md:ml-12" />
    </div>

    <!-- KANAN: Tombol Register & Sign Up -->
    <div class="hidden md:flex items-center gap-6 mr-4 md:mr-12 animate-fade-in">
      <RouterLink to="/createaccount" class="px-4 py-2 font-semibold text-white bg-ungu rounded-lg hover:bg-gray-600 border border-ungutext  animate-fade-in transition-all duration-1000 ease-in-out transform hover:scale-[1.10]">Register</RouterLink>
      <RouterLink to="/login" class="px-4 py-2 font-semibold text-white bg-pinktua rounded-lg hover hover:bg-gray-600 border border-ungutext animate-fade-in transition-all duration-1000 ease-in-out transform hover:scale-[1.10]">Sign Up</RouterLink>
    </div>
  

        <!-- Burger Menu (Mobile) -->
        <div class="md:hidden ml-auto">
          <button @click="toggleMenu" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-ungutext" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
  
        <!-- Mobile Menu -->
        <div
          class="md:hidden absolute top-16 right-0 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4 transition-transform text-ungutext"
          :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}">
          <ul class="space-y-4 font-semibold">
            <li>
              <RouterLink to="/createaccount">Register</RouterLink>
            </li>
             <li>
              <RouterLink to="/login">Sign up</RouterLink>
            </li>
            <li>
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
  
  /* Saat di-hover */
  a:hover {
    color: white;
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
  
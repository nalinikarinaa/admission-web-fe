<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      isDropdownOpen: false,
      isMenuOpen: false,
      isScrolled: false,
      isModalOpen: false,
      profileImage: '', // default image
      name: '',
      username: '',
      selectedImage: null,
      loading: false,
    };
  },

  computed: {
    imageUrl() {
      return this.profileImage || '../assets/img/profilll.png'; // Default image jika tidak ada
    },
    navbarClasses() {
      return {
        'bg-transparent': !this.isScrolled, // Warna transparan sebelum scroll
        'bg-white shadow-lg': this.isScrolled, // Ubah menjadi putih dan tambahkan bayangan saat scroll
      };
    },
  },
  methods: {
openModal() {
  console.log('Modal dibuka');
  this.profile(); // untuk refresh data saat modal dibuka
  this.isModalOpen = true;
},
      closeModal() {
        this.isModalOpen = false;
      },
      previewImage(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.profileImage = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      saveChanges() {
        alert('Profile updated successfully!');
        this.closeModal();
      },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50; // Jika scroll lebih dari 50px
    },
     mounted() {
    window.addEventListener('scroll', this.handleScroll);
     this.profile(); // Tambahkan event listener untuk scroll
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll); // Bersihkan event listener
  },

  previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        // Periksa ukuran file, jika lebih dari 2MB (2 * 1024 * 1024 = 2MB)
        if (file.size > 2 * 1024 * 1024) {
          Swal.fire('Peringatan', 'Ukuran foto harus kurang dari 2MB!', 'warning');
          // Reset input jika ukuran terlalu besar
          event.target.value = '';
          return;
        }

        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result; // Menampilkan preview image sebelum upload
        };
        reader.readAsDataURL(file);
      }
    },
    async profile() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL_API}/profile`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('access_token')}`, // <- diperbaiki
              Accept: 'application/json',
            },
          }
        );
        console.log(response.data); 
        this.name = response.data.name;
        this.username = response.data.username;

        if (response.data.profile_photo_url) {
          this.profileImage = response.data.profile_photo_url;
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Gagal', 'Gagal memuat profil user', 'error');
      }
    },
    async saveChanges() {
      if (!this.name || !this.username) {
        Swal.fire('Peringatan', 'Nama dan Username harus diisi!', 'warning');
        return;
      }

      this.loading = true;

      try {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('username', this.username);
        if (this.selectedImage) {
          formData.append('profile_photo', this.selectedImage);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL_API}/profile?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('access_token')}`, // <- diperbaiki
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        Swal.fire('Berhasil', response.data.message, 'success');
        this.closeModal();
        this.profile(); // Refresh profile image & data
      } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || 'Terjadi kesalahan saat update!';
        Swal.fire('Gagal', msg, 'error');
      } finally {
        this.loading = false;
      }
    },
  },
 
};
</script>

<template>
  <div :class="navbarClasses" class="navbar w-full fixed top-0 left-0 z-50 p-4 transition-all duration-300 ease-in-out bg-ungutua">
    <div class="flex flex-wrap items-center w-full">
      <!-- Logo dan Nama -->
      <div class="flex flex-col items-center mb-1 md:mb-0">
        <img src="../assets/img/logoo.png" alt="Logo" class="w-16 h-auto mt-1 ml-4 md:ml-12">
      </div>

      <!-- Menu Links (Desktop) -->
      <div class="hidden md:flex items-center gap-10 mt-4 ml-4 md:ml-20 flex-grow">
        <RouterLink to="/dashboard" class="py-2 font-semibold text-white">Dashboard</RouterLink>
        <RouterLink to="/classlist" class="py-2 font-semibold text-white">Class</RouterLink>
        <RouterLink to="/transaction" class="py-2 font-semibold text-white">Transaction</RouterLink>
        
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
              <button @click="openModal" class="block px-4 py-2 text-gray-800 hover:bg-pinktua w-full text-left">My Account </button>
              <RouterLink to="/">
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
            <RouterLink to="/classlist">Class</RouterLink>
          </li>
          <li>
            <RouterLink to="/transaction">Transaction</RouterLink>
          </li>
         <li>
<button
  @click.stop="toggleDropdown"
  class="w-full px-4 py-2 rounded-md flex items-center space-x-2 text-ungutext hover:text-pinktua"
>
  <span class="font-semibold">Profile</span>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
  </svg>
</button>


  <!-- Dropdown Menu -->
  <transition name="fade">
    <div
      v-if="isDropdownOpen"
      class="mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md"
    >
      <button
        @click="openModal"
        class="block px-4 py-2 text-ungutext hover:bg-pinktua w-full text-left"
      >
        My Account
      </button>

      <RouterLink to="/login">
        <button
          class="block px-4 py-2 text-red-600 hover:bg-pinktua w-full text-left"
        >
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

   <!-- Modal Overlay -->
<!-- Modal Overlay -->
<div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <!-- Modal Content -->
  <div class="bg-pinktua text-white rounded-lg p-6 w-full max-w-md shadow-lg z-60">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-white">Profile</h2>
      <button @click="closeModal" class="text-gray-300 hover:text-white text-2xl">&times;</button>
    </div>

    <!-- Profile Picture -->
    <div class="flex justify-center mb-4">
      <img :src="imageUrl" class="w-24 h-24 rounded-full object-cover" alt="Profile Picture" />
    </div>

    <!-- Profile Info (Tampilan Saja) -->
    <div class="space-y-4 text-white">
      <div>
        <label class="block text-sm">Full Name</label>
        <p class="bg-gray-700 px-3 py-2 rounded-md">{{ name }}</p>
      </div>
      <div>
        <label class="block text-sm">Username</label>
        <p class="bg-gray-700 px-3 py-2 rounded-md">{{ username }}</p>
      </div>
    </div>

    <!-- Close Button -->
    <div class="flex justify-end mt-6">
      <button @click="closeModal" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-orange">
        Close
      </button>
    </div>
  </div>
</div>

</template>



<style scoped>

button {
  transition: all 0.2s;
}
button:hover {
  transform: scale(1.05);
}
/* Warna default link */
a {
  color: #5D69B4;
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

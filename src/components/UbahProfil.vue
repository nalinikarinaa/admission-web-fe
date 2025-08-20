<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import defaultProfile from '@/assets/img/profilll.png'; // jika menggunakan alias @


export default {
  name: 'UbahProfil',
  data() {
    return {
      isModalOpen: false,
      profileImage: '', // default image
      name: '',
      username: '',
      selectedImage: null,
      loading: false,
    };
  },
  mounted() {
    this.profile();
  },
  computed: {
    // imageUrl() {
    //   return this.profileImage || defaultProfile;
    // }
     imageUrl() {
    return this.profileImage?.trim() ? this.profileImage : 'http://127.0.0.1:8000/storage/images/default-profile.png';
  }

  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          Swal.fire('Peringatan', 'Ukuran foto harus kurang dari 2MB!', 'warning');
          event.target.value = '';
          return;
        }
        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
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
              Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
              Accept: 'application/json',
            },
          }
        );

        this.name = response.data.name;
        this.username = response.data.username;

       
        const url = response.data.profile_photo_url;

if (url && url.includes('/storage/')) {
  this.profileImage = url.startsWith('http')
    ? url.replace('https://', 'http://')
    : `http://127.0.0.1:8000${url}`;
} else {
  this.profileImage = ''; // fallback ke default
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
      Swal.fire({
        title: 'Mengubah profil',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

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
              Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        Swal.fire('Berhasil', response.data.message, 'success');
        this.closeModal();
        this.profile(); // Refresh
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
  <!-- Bagian Profil -->
  <div class="bg-ungutua text-white rounded-lg p-6 shadow-lg w-full md:w-72 self-start">
    <!-- Profile Picture -->
    <div class="flex justify-center md:justify-start">
      <img :src="imageUrl" class="w-24 h-24 rounded-full object-cover" alt="Profile" />
    </div>

    <!-- Profile Information -->
    <div class="text-center md:text-start mt-4">
      <h2 class="md:text-lg text-base font-semibold text-ungutext">{{ name || 'User' }}</h2>
      <p class="text-sm mt-2">Username: @{{ username || 'username' }}</p>
    </div>

    <!-- Buttons -->
    <div class="mt-6 flex justify-around md:justify-between">
      <button @click="openModal" class="bg-kuning text-ungutext border border-ungutext px-3 py-1 rounded-md hover:bg-gray-600 md:text-base text-sm transition-all duration-700 ease-in-out transform hover:scale-[1.01]">
        Change Profile
      </button>
    </div>
  </div>

  <!-- Modal Overlay -->
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Modal Content -->
    <div class="bg-ungutext text-white rounded-lg p-6 w-full max-w-md shadow-lg z-60">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Change Profile</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>

      <!-- Form Profile Picture -->
      <div class="flex justify-center mb-4">
        <img :src="imageUrl" class="w-24 h-24 rounded-full object-cover" alt="Profile Picture" />

      </div>

      <div class="flex justify-center">
        <label class="cursor-pointer bg-kuning text-gray-900 px-3 py-1 rounded-md hover:bg-gray-600 transition-all duration-700 ease-in-out transform hover:scale-[1.01]">
          Upload Picture
          <input type="file" accept="image/*" class="hidden" @change="previewImage" />
        </label>
      </div>

      <!-- Profile Form -->
      <form class="mt-6 space-y-4" @submit.prevent="saveChanges">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm">Full Name</label>
          <input 
            v-model="name" 
            id="name" 
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange" 
            placeholder="Enter your full name" />
        </div>

        <!-- Username -->
        <div>
          <label for="username" class="block text-sm">Username</label>
          <input 
            v-model="username" 
            id="username" 
            class="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange" 
            placeholder="Enter your username" />
        </div>

        <!-- Buttons -->
        <div class="flex justify-between mt-4">
          <button type="submit" class="bg-kuning text-gray-900 px-3 py-2 rounded-md hover:bg-gray-600">
            Save Changes
          </button>
          <button type="button" @click="closeModal" class="bg-gray-600 px-3 py-2 rounded-md hover:bg-orange">
            Cancel
          </button>
        </div>
      </form>
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
</style>

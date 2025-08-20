<script>
import Header from '../components/Header.vue';
import axios from 'axios';

export default {
  name: "Transaction",
  components: {
    Header,
  },
  data() {
    return {
      isLoading: false,
      activeTab: 0,
      startDate: '',
      remark: '',
      transactions: [], // Data dari backend
      lokasiList: [],
      idKelas: '',
        namakelas: '',
        tanggal: '',
        jammulai: '',
        jamselesai: '',
        lokasi: '',
        harga: '',
        kuota: '',
        deskripsi: '',
        foto: null,
        previewFoto: '', 
    };
  },
  mounted() {
    this.fetchTransactions();
    this.fetchLocations();
  },
  methods: {
    setActiveTab(index) {
      this.activeTab = index;
    },

    // Mengambil data transaksi dengan autentikasi
    fetchTransactions() {
      this.isLoading = true;
        const token = sessionStorage.getItem('access_token'); // Ambil token dari sessionStorage

        if (!token) {
            console.error('Token tidak ada');
            return;
        }

        const config = {
            method: 'get',
            url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/user/transactions`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios(config)
            .then((response) => {
                console.log('Data yang diambil:', response.data);
                this.transactions = response.data.data || response.data; // Sesuaikan dengan struktur response dari backend
            })
            .catch((error) => {
                console.error('Gagal mengambil transaksi:', error);
            })
            .finally(() => {
      this.isLoading = false;
    });
       },

       fetchLocations() {
        const config = {
          method: 'get',
          url: import.meta.env.VITE_APP_BACKEND_URL_API + '/location/locationlist'
        }
  
        axios(config)
          .then(response => {
            this.lokasiList = response.data.locations;
          })
          .catch(error => {
            console.error('Gagal ambil lokasi:', error);
          });
      },
  
      getPhotoUrl(photo) {
        if (!photo) return '/default-placeholder.jpg';
        if (photo.startsWith('http')) return photo.replace('https://', 'http://');
        let backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
        backendUrl = backendUrl.replace('https://', 'http://');
        return backendUrl + 'storage/class_photos/' + photo;
      },
  
      setActiveTab(index) {
        this.activeTab = index;
      },
  

    submitForm() {
      if (!this.startDate || !this.remark) {
        alert('Harap isi semua kolom');
        return;
      }

      console.log("Form disubmit:", this.startDate, this.remark);
      
      // Reset input
      this.startDate = '';
      this.remark = '';
    },

    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<template>
  <Header />

  <div class="md:ml-12 ml-4 pt-10">
    <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Transaksi</span>
  </div>
  <hr class="bg-pinktua h-0.5 mt-1 border-none">

  <div class="p-8 md:mx-32 mx-5 bg-white rounded-lg mb-8 mt-8">
    <p class="mb-5 font-bold text-ungutext">Riwayat Transaksi</p>

    <!-- Form -->
    <!-- <div class="flex md:space-x-4 space-x-2">
      <div>
        <label for="start-date" class="block text-sm font-medium">Tanggal Mulai</label>
        <input
          type="date"
          id="start-date"
          v-model="startDate"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs md:text-sm"
        />
      </div>
      <div>
        <label for="remark" class="block text-sm font-medium">Remark</label>
        <input
          type="text"
          id="remark"
          v-model="remark"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs md:text-sm"
        />
      </div>
      <button
        class="self-center px-4 py-2 mt-5 hover:bg-orange bg-gray-600 border border-gray-300 text-white rounded-md text-xs md:text-sm"
        @click="submitForm"
      >
        Kirim
      </button>
    </div> -->

    <div v-if="isLoading" class="flex justify-center items-center py-8">
  <svg class="animate-spin h-6 w-6 text-ungu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
    </path>
  </svg>
  <span class="ml-2 text-gray-600 font-medium">Loading classes...</span>
</div>

    <!-- Daftar Transaksi -->
    <div
      v-for="(kelas, index) in transactions"
      :key="index"
      class="p-3 rounded-lg shadow-xl bg-kuning mt-3 flex flex-col md:flex-row"
    >
          <img
            :src="getPhotoUrl(kelas.kelas.photo)"
            alt="Foto Kelas"
            class="w-28 h-28 md:w-32 md:h-32 object-cover mx-auto md:ml-8 rounded-lg"
          />

      <div class="flex-1 md:ml-4">
        <p class="font-bold ml-3 mb-1 md:text-base text-sm mt-2 md:mt-0 text-ungutext">{{ kelas.kelas.title }}</p>
        <div class="flex">
          <img src="../assets/img/kalender.png" class="w-5 h-5 ml-4">
          <p class="ml-3 md:text-base text-sm text-ungutext">{{ kelas.kelas.date }}</p>
        </div>
        <div class="flex">
          <img src="../assets/img/jam.png" class="w-5 h-5 ml-4">
          <p class="ml-3 md:text-base text-sm text-ungutext">{{ kelas.kelas.start_time }}-{{ kelas.kelas.end_time }}</p>
        </div>
        <div class="flex">
          <img src="../assets/img/lokasi.png" class="w-5 h-5 ml-4">
          <p class="ml-4 md:text-base text-sm text-ungutext">{{ kelas.kelas.location.name || 'Lokasi tidak tersedia' }}</p>
        </div>
      </div>

      <div class="flex flex-col justify-end items-end w-full md:w-auto mt-4 md:mt-0 mb-5 mr-8">
        <div class="flex space-x-2 mt-2 justify-center md:justify-end">
          <button
            :class="[
              'text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm',
              kelas.payment_verification.toUpperCase() === 'LUNAS' ? 'bg-pinktua' :
              kelas.payment_verification.toUpperCase() === 'PENDING' ? 'bg-gray-600' :
              kelas.payment_verification.toUpperCase() === 'GAGAL' ? 'bg-red-600' :
              'bg-gray-400'
            ]"
          >
            {{ kelas.payment_verification.toUpperCase() }}
          </button>

        </div>
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
</style>

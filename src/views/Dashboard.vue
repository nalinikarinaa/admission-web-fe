<script>
import UbahProfil from '@/components/UbahProfil.vue';
import Header from '../components/Header.vue';
import axios from 'axios'

export default {
  components: {
    Header,
    UbahProfil,
  },
  data() {
    return {
      name: '',
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
        alamat: '',
        deskripsi: '',
        foto: null,
        previewFoto: '', // Nama user akan disimpan di sini
    }
  },
  mounted() {
    this.getUserName()
    this.fetchTransactions();
    this.fetchLocations();
  },
  methods: {
    async getUserName() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL_API}/profile`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('access_token')}`, // <-- diperbaiki
              Accept: 'application/json',
            },
          }
        );
        this.name = response.data.name; // Sesuaikan kalau struktur data API berbeda
      } catch (error) {
        console.error('Gagal mengambil nama user:', error);
      }
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
            url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/user/active-classes`,
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
    formatTime(time) {
    if (!time) return '';
    return time.slice(0, 5); // ambil jam dan menit saja, misal "16:06"
  }
  }
}
</script>


<template>
  <Header />

  <div class="md:ml-12 ml-4 pt-10">
    <span class="md:text-2xl text-xl font-semibold mb-8">Dashboard</span>
  </div>
  <hr class="bg-pinktua h-0.5 mt-1 border-none">


  <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 p-4 md:p-6 animate-fade-in">
    <UbahProfil/>
    <!-- Bagian Tagihan dan Produk -->
   <div class="flex-1 animate-fade-in">
  <div class="border rounded-lg p-4 mb-5 shadow-xl bg-ungu transition-all duration-700 ease-in-out transform hover:scale-[1.01]">
    <div class="flex justify-between items-center">
      <div class="ml-10">
        <p class="md:text-3xl text-base font-semibold text-ungutext animate-slide-down">Welcome, {{ name || 'User' }}!</p>
        <p class="md:text-xl text-xs text-pink animate-slide-up">Let's make our weekend more productive!</p>
      </div>
      <div>
        <img src="../assets/img/dashboard.png" alt="dashboard" class="w-56 h-auto md:mr-20 mr-3 animate-fade-in-right">
      </div>
    </div>
  </div>

      <!-- RIWAYAT KELAS -->
      <div class="p-8 rounded-lg shadow-xl bg-white">
        <div class=" flex row-span-2 justify-between">
          <span class="font-bold">Riwayat Kelas</span>
          <!-- <button class="px-2 py-1 border rounded bg-pinktua shadow-2xl text-white hover:bg-gray-600 md:text-base text-sm justify-end">view all</button> -->
        </div>

       <!-- Loading Spinner -->
<div v-if="isLoading" class="flex justify-center items-center py-8">
  <svg class="animate-spin h-6 w-6 text-ungu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
    </path>
  </svg>
  <span class="ml-2 text-gray-600 font-medium">Loading classes...</span>
</div>

<!-- Tampilkan jika TIDAK loading dan transaksi kosong -->
<div v-else-if="transactions.length === 0" class="text-center py-8 text-gray-500 font-medium">
  Anda belum memiliki riwayat kelas.
</div>


        <div v-for="(kelas, index) in transactions"
          :key="index" class="p-3 rounded-lg shadow-xl bg-kuning mt-3 flex flex-col md:flex-row transition-all duration-700 ease-in-out transform hover:scale-[1.01]">
          <!-- Gambar -->
         <img
            :src="getPhotoUrl(kelas.kelas.photo)"
            alt="Foto Kelas"
            class="w-28 h-28 md:w-32 md:h-32 object-cover mx-auto md:ml-8 rounded-lg"
          />


 <!-- Detail Kelas -->
 <div class="flex-1 md:ml-4">
   <p class="font-bold ml-3 mb-1 md:text-base text-sm mt-2 md:mt-0 text-ungutext">{{ kelas.kelas.title }}</p>
   <div class="flex">
     <img src="../assets/img/kalender.png" class="w-5 h-5 ml-4">
     <p class="ml-3 md:text-base text-sm text-ungutext">{{ kelas.kelas.date }}</p>
   </div>
   <div class="flex">
     <img src="../assets/img/jam.png" class="w-5 h-5 ml-4">
     <p class="ml-3 md:text-base text-sm text-ungutext">{{ formatTime(kelas.kelas.start_time) }} - {{ formatTime(kelas.kelas.end_time) }}</p>
   </div>
   <div class="flex">
     <img src="../assets/img/lokasi.png" class="w-5 h-5 ml-4">
     <p class="ml-4 md:text-base text-sm text-ungutext">{{ kelas.kelas.location.name || 'Lokasi tidak tersedia' }}, {{ kelas.kelas.address }}</p>
   </div>
 </div>

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

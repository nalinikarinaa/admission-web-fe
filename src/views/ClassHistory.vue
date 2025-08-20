<script>
import Header from '../components/Header.vue';
import axios from 'axios';
import Swal from 'sweetalert2';


export default {
  name: "ClassHistory",
  props: ['classId'],
  components: {
    Header,
  },
 data() {
   return {
    isLoading: false,
    activeTab: 2,
    showModal: {
               feedback: false,
           },
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
        previewFoto: '',
        selectedClassId: null, 
        nama: '', 
        comment:null,      
   };
 },
 mounted() {
    this.fetchTransactions();
    this.fetchLocations();
    const token = sessionStorage.getItem('access_token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  console.log('TOKEN =>', token);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  if (user && user.id) {
    this.userId = user.id;
    console.log('User ID ditemukan:', this.userId);
  } else {
    console.warn('User belum login atau user ID tidak tersedia');
    Swal.fire({
      icon: 'error',
      title: 'Akses Ditolak',
      text: 'Silakan login terlebih dahulu.',
    }).then(() => {
      this.$router.push('/login');
    });
  }
  },
 methods: {
  storeDataFeedback() {
      if (!this.comment) {
        Swal.fire({
          icon: 'warning',
          title: 'Form belum lengkap',
        });
        return;
      }

      if (!this.userId) {
        Swal.fire({
          icon: 'error',
          title: 'User tidak ditemukan',
          text: 'Silakan login ulang dan coba lagi.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('comment', this.comment);
      formData.append('user_id', this.userId);
      // formData.append('class_id', this.classId);
      formData.append('class_id', this.selectedClassId);
      formData.append('nama', this.nama);  


      Swal.fire({
        // title: '...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const config = {
        method: 'post',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/feedback',
        headers: {
          Accept: 'application/json',
          // 'Content-Type': 'multipart/form-data',
        },
        data: formData
      }

      axios(config)
        .then((response) => {
          this.closeModalFeedback();
          Swal.fire({
            icon: 'success',
            title: 'Pengisian Feedback Berhasil!',
            text: 'Data kamu sudah kami terima.',
          }).then(() => {
            this.$router.push('/classhistory');
          });
        })
        .catch((error) => {
          console.error("Pengisian feedback Error:", error);

          let errorMessage = "Terjadi kesalahan saat mendaftar!";
          if (error.response) {
            const errors = error.response.data?.errors;
            errorMessage = errors
              ? Object.values(errors).flat().join('\n')
              : error.response.data?.message || errorMessage;
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Pengisian Feedback Gagal',
            text: errorMessage,
          });
        });
    },

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
   showModalFeedback(kelasItem) {
    this.selectedClassId = kelasItem.kelas.id;
    this.nama = kelasItem.nama || 'Peserta';
    this.comment = kelasItem.feedback?.comment || '';
    this.showModal.feedback  = true;
   },
   closeModalFeedback() {
     this.showModal.feedback = false;
   },
    formatTime(time) {
    if (!time) return '';
    return time.slice(0, 5); // ambil jam dan menit saja, misal "16:06"
  }
 }
};
</script>


<template>
    <Header />

<div class="md:ml-12 ml-4 pt-10">
 <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Class Active</span>
</div>
<hr class="bg-pinktua h-0.5 mt-1 border-none">

 <!-- Navigasi Atas -->
  <div class="flex mt-8 md:ml-32 ml-5 md:space-x-4 space-x-2 animate-fade-in ">
    <RouterLink
      to="/classlist"
      class="md:px-6 px-4 md:py-2 py-1 font-semibold border border-ungutext text-sm md:text-base rounded-md"
      :class="activeTab === 0 ? 'bg-ungutua text-ungutext' : 'bg-white text-ungutext hover:bg-ungutua'"
      @click="setActiveTab(0)"
    >
      Class List
    </RouterLink>

    <RouterLink
      to="/classactive"
      class="md:px-6 px-4 md:py-2 py-1 font-semibold border border-ungutext text-sm md:text-base rounded-md"
      :class="activeTab === 1 ? 'bg-ungutua text-ungutext' : 'bg-white text-ungutext hover:bg-ungutua'"
      @click="setActiveTab(1)"
    >
      Class Active
    </RouterLink>

    <RouterLink
      to="/classhistory"
      class="md:px-6 px-4 md:py-2 py-1 font-semibold border border-ungutext text-sm md:text-base rounded-md"
      :class="activeTab === 2 ? 'bg-ungutua text-ungutext' : 'bg-white text-ungutext hover:bg-ungutua'"
      @click="setActiveTab(2)"
    >
      Class History
    </RouterLink>
  </div>


<div class="p-8 md:mx-32 mx-5 bg-white rounded-lg mb-8 animate-fade-in">
 <p class="mb-5 font-bold text-ungutext">Class History</p>
 <hr class="bg-pinktua h-0.5 mt-1 border-none">

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
  Anda belum memiliki history class.
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

 <!-- Harga & Tombol -->
 <div class="flex flex-col justify-end items-end w-full md:w-auto mt-4 md:mt-0 mb-5 mr-8">
   <div class="flex space-x-2 mt-2 justify-center md:justify-end">
     <!-- <button class="bg-pinktua text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"  @click="showModalFeedback(kelas)">Feedback</button> -->
     
<button
  :disabled="kelas.feedback"
  @click="showModalFeedback(kelas)"
  class="px-3 py-1 rounded-lg text-sm"
  :class="kelas.feedback 
    ? 'bg-gray-400 text-white cursor-not-allowed' 
    : 'bg-pinktua text-white hover:bg-gray-600'"
>
  {{ kelas.feedback ? 'Feedback' : 'Feedback' }}
</button>


   </div>
 </div>
</div>


<!-- pop up Feedback -->
   <!-- Modal Overlay -->
   <div v-if="showModal.feedback" class="fixed inset-0 flex items-center justify-center z-50">
  <!-- Modal Content -->
  <div class="relative bg-ungutua bg-opacity-100 text-white rounded-lg p-6 w-full max-w-md shadow-lg z-60">
    <button @click="closeModalFeedback"
            class="absolute top-2 right-2 text-black hover:text-gray-200 text-xl font-bold">
      &times;
    </button>
    <form @submit.prevent="storeDataFeedback">
    <h2 class="text-xl font-bold text-center mb-4 text-ungutext">{{ nama }}</h2>
    <div>
      <label class="block text-ungutext mb-2">Feedback</label>
      <textarea 
  v-model="comment"
  class="w-full h-32 border border-gray-300 p-2 rounded-md bg-gray-200 resize-none overflow-y-auto text-ungutext"
  placeholder="Masukkan feedback..."
></textarea>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end mt-4">
      <button type="submit" class="bg-pinktua px-3 py-2 rounded-md hover:bg-white text-sm md:text-base">
        Kirim
      </button>
    </div>
    </form>
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
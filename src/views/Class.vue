<script>
import Header from '../components/Header.vue';
import axios from 'axios';
// import Swal from 'sweetalert2';

export default {
  name: "ClassList",
  components: {
    Header,
  },
  data() {
    return {
      isLoading: false,
      activeTab: 0,
      startDate: '',
      remark: '',
      classname: '',
      kelasList: [],
      lokasiList: [],
      filterDate: '',
      filterName: '',
      filterLocation: '',
      classId: this.$route.params.classId || null,
      showModal: {
        readMore: false,
      },
      idKelas: '',
      namakelas: '',
      tanggal: '',
      jammulai: '',
      jamselesai: '',
      lokasi: '',
      harga: '',
      kuota: '',
      deskripsi: '',
      alamat: '',
      foto: null,
      previewFoto: '', 
    };
  },
  mounted() {
    this.fetchClasses();
    this.fetchLocations();
    {
  axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_API}/location/locationlist`)
    .then(res => {
      this.lokasiList = res.data.locations
    })
    .catch(err => console.error('Gagal ambil lokasi', err))
}
  },
  computed: {
  filteredKelasList() {
    return this.kelasList.filter(kelas => {
      // const matchDate = !this.filterDate || kelas.date === this.filterDate;
      const matchDate = !this.filterDate || kelas.date.includes(this.filterDate);

      const matchName = !this.filterName || kelas.title.toLowerCase().includes(this.filterName.toLowerCase());
      const matchLocation = !this.filterLocation || kelas.location?.name === this.filterLocation;
      return matchDate && matchName && matchLocation;
    });
  },
  parsedDescription() {
    if (this.selectedClass && this.selectedClass.description) {
      return this.selectedClass.description
        .split('-')
        .filter(item => item.trim() !== '');
    }
    return [];
  }
},

  methods: {
    resetFilter() {
  this.filterDate = '';
  this.filterName = '';
  this.filterLocation = '';
},
   
    fetchClasses() {
      this.isLoading = true;
      const config = {
        method: 'get',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/classes/getclass'
      }

      axios(config)
        .then(response => {
          this.kelasList = response.data.data;
        })
        .catch(error => {
          console.error('Gagal mengambil data kelas:', error);
        })
        .finally(() => {
      this.isLoading = false; // WAJIB agar spinner hilang setelah selesai
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
    showModalReadMore(kelas) {
      this.selectedClass = kelas;
      this.showModal.readMore  = true;
    },
    closeModalReadMore() {
      this.selectedClass = null; 
      this.showModal.readMore = false;
    },
    submitForm() {
      if (!this.startDate || !this.remark) {
        alert('Please fill out all fields');
        return;
      }

      console.log("Form submitted:", this.startDate, this.remark);

      // Reset input
      this.startDate = '';
      this.remark = '';
    },
    navigateTo(route) {
      this.$router.push(route);
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
    <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Class List</span>
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

  <div class="p-8 md:mx-32 mx-5 bg-white border border-ungutext rounded-lg mb-8 animate-fade-in">

    <p class="mb-5 font-bold text-ungutext">Class List</p>

    <!-- Form untuk PENCARIAN -->
<div class="flex md:space-x-4 space-x-2 mb-6">
  <div>
    <label for="start-date" class="block text-sm font-medium text-ungutext">Date</label>
    <input
      id="start-date"
      v-model="filterDate"
      type="date"
      class="mt-1 block w-full border border-ungutext rounded-md p-2 text-xs md:text-sm"
    />
  </div>

  <div>
    <label for="classname" class="block text-sm font-medium text-ungutext">Class Name</label>
    <input
      id="classname"
      v-model="filterName"
      type="text"
      class="mt-1 block w-full border border-ungutext rounded-md p-2 text-xs md:text-sm"
    />
  </div>

  <div>
    <label for="location" class="block text-sm font-medium text-ungutext">Location</label>
    <select
      id="location"
      v-model="filterLocation"
      class="mt-1 block w-full border border-ungutext rounded-md p-2 text-xs md:text-sm"
    >
      <option value="">All Locations</option>
      <option
        v-for="lok in lokasiList"
        :key="lok.id"
        :value="lok.name"
      >{{ lok.name }}</option>
    </select>
  </div>

  <div>
  <label class="block text-sm font-medium opacity-0 text-ungutext">Reset</label>
  <button
    @click="resetFilter"
    class="bg-ungu hover:bg-gray-600 text-ungutext px-4 py-2 rounded-md text-xs md:text-sm mt-1 w-full"
  >
    Reset Filter
  </button>
</div>

</div>

<div v-if="isLoading" class="flex justify-center items-center py-8">
  <svg class="animate-spin h-6 w-6 text-ungu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
    </path>
  </svg>
  <span class="ml-2 text-gray-600 font-medium">Loading classes...</span>
</div>

    <!-- KONTEN  -->
    <div class="px-4 py-6">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    <div
       v-for="kelas in filteredKelasList"
      :key="kelas.id"
      class="bg-kuning rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center transition-all duration-700 ease-in-out transform hover:scale-[1.01]"
    >
      <!-- FOTONYA DIBUAT KONSISTEN -->
      <div class="w-32 h-32 overflow-hidden rounded-lg mb-2 flex justify-center items-center bg-white">
        <img
          :src="getPhotoUrl(kelas.photo)"
          alt="Foto Kelas"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- JUDUL -->
      <h3 class="font-bold text-lg mb-2 md:text-md text-ungutext">{{ kelas.title }}</h3>

      <!-- DETAIL -->
      <div class="text-sm text-left w-full mb-2 space-y-1 text-ungutext">
        <div class="flex items-center gap-2 md:text-base text-sm">
          <img src="../assets/img/kalender.png" class="w-5 h-5 ml-4" />
          <span>{{ kelas.date }}</span>
        </div>
        <div class="flex items-center gap-2 md:text-base text-sm">
          <img src="../assets/img/jam.png" class="w-5 h-5 ml-4" />
          <span>{{ formatTime(kelas.start_time) }} - {{ formatTime(kelas.end_time) }}</span>
        </div>
        <div class="flex items-center gap-2 md:text-base text-sm">
          <img src="../assets/img/lokasi.png" class="w-5 h-5 ml-4" />
          <span>{{ kelas.location?.name || 'Lokasi Tidak Ditemukan' }}, {{ kelas.address }}</span>
        </div>
      </div>

      <!-- KUOTA & HARGA -->
      <div class="flex justify-between text-sm font-semibold w-full px-2 mb-3 mt-2 md:text-base">
      <!-- KUOTA -->
      <div class="flex flex-col md:flex-row md:items-center text-ungutext">
        <span class="mr-1">KUOTA:</span>
        <span v-if="kelas.remaining_quota === 0" class="text-red-500 font-semibold text-sm">Kelas penuh</span>
        <span v-else>{{ kelas.remaining_quota }} / {{ kelas.max_quota }}</span>
      </div>

      <!-- FEE -->
      <div class="flex flex-col md:flex-row md:items-center text-ungutext">
        <span class="mr-1">FEE:</span>
        <span>{{ kelas.price }}K/Person</span>
      </div>
    </div>


      <!-- BUTTON -->
      <div class="flex gap-2 w-full justify-center">
        <button class="bg-ungu text-white px-3 py-1 rounded-lg hover:bg-gray-600 border text-sm" @click="showModalReadMore(kelas)">Read more</button>

        <RouterLink :to="`/registerclass/${kelas.id}`">
          <button
            class="bg-pinktua text-white px-3 py-1 rounded-lg border text-sm"
            :class="{ 'opacity-50 cursor-not-allowed': kelas.remaining_quota === 0 }"
            :disabled="kelas.remaining_quota === 0"
          >
            Register class
          </button>
        </RouterLink>

      </div>
    </div>
  </div>
</div>

  </div>

   
  <!-- pop up read more -->
<div v-if="showModal.readMore" class="fixed inset-0 flex items-center justify-center z-50">
  <div v-if="selectedClass" class="bg-pinktua bg-opacity-100 text-white rounded-lg p-6 w-full max-w-md shadow-lg z-60">
    <p class="md:text-lg text-sm font-bold">YOU'LL GET:</p>

    <!-- Render list -->
    <ul class="list-disc list-inside md:text-sm text-xs space-y-1">
      <li v-for="(item, index) in parsedDescription" :key="index">
        {{ item.trim() }}
      </li>
    </ul>

    <!-- Tombol -->
    <div class="flex justify-end mt-4">
      <button @click="closeModalReadMore" class="bg-white text-ungutext px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">Close</button>
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

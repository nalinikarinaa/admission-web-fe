<script>
  import HeaderAdmin from '@/components/HeaderAdmin.vue';
  import axios from 'axios';
  
  export default {
    name: "ClassHistoryAdmin",
    components: {
      HeaderAdmin,
    },
    data() {
      return {
        isLoading: false,
        activeTab: 2,
        startDate: '',
        remark: '',
        kelasList: [],
        lokasiList: [],
        filterDate: '',
        filterName: '',
        filterLocation: '',
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
      
        showModal: {
          verifikasi: false,
        },
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
      showModalVerifikasi() {
        this.showModal.verifikasi = true;
      },
      closeModalVerifikasi() {
        this.showModal.verifikasi = false;
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
    <HeaderAdmin />
  
    <div class="md:ml-12 ml-4 pt-10">
      <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Class History</span>
    </div>
    <hr class="bg-pinktua h-0.5 mt-1 border-none">
  
     <!-- Navigasi Atas -->
    <div class="flex mt-8 md:ml-32 ml-5 md:space-x-4 space-x-2">
      <RouterLink
        to="/classlist/admin"
        class="md:px-6 px-4 md:py-2 py-1 font-semibold border border-gray-300 text-sm md:text-base rounded-md"
        :class="activeTab === 0 ? 'bg-ungutua text-ungutext' : 'bg-white text-ungutext hover:bg-ungutua'"
        @click="setActiveTab(0)"
      >
        Class List
      </RouterLink>
  
      <RouterLink
        to="/classlist/classmanajemen"
        class="md:px-6 px-4 md:py-2 py-1 font-semibold border border-ungutext text-sm md:text-base rounded-md"
        :class="activeTab === 1 ? 'bg-ungutua text-ungutext' : 'bg-white text-ungutext hover:bg-ungutua'"
        @click="setActiveTab(1)"
      >
        Class Management
      </RouterLink>
  
      <RouterLink
        to="/classlist/classhistory"
        class="md:px-6 px-4 md:py-2 py-1 font-semibold border border-ungutext text-sm md:text-base rounded-md"
        :class="activeTab === 2 ? 'bg-ungutua text-ungutext' : 'bg-white text-ungutext hover:bg-ungutua'"
        @click="setActiveTab(2)"
      >
        Class History
      </RouterLink>
    </div>
  
  
    <div class="p-8 md:mx-32 mx-5 bg-white rounded-lg mb-8 text-ungutext">

  
       <!-- Form untuk PENCARIAN -->
<div class="flex md:space-x-4 space-x-2 mb-6">
  <div>
    <label for="start-date" class="block text-sm font-medium">Date</label>
    <input
      id="start-date"
      v-model="filterDate"
      type="date"
      class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs md:text-sm"
    />
  </div>

  <div>
    <label for="classname" class="block text-sm font-medium">Class Name</label>
    <input
      id="classname"
      v-model="filterName"
      type="text"
      class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs md:text-sm"
    />
  </div>

  <div>
    <label for="location" class="block text-sm font-medium">Location</label>
    <select
      id="location"
      v-model="filterLocation"
      class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs md:text-sm"
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
  <label class="block text-sm font-medium opacity-0">Reset</label>
  <button
    @click="resetFilter"
    class="bg-ungu hover:bg-gray-600 text-white px-4 py-2 rounded-md text-xs md:text-sm mt-1 w-full"
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

    <div  v-for="kelas in filteredKelasList" :key="kelas.id" class="p-3 rounded-lg shadow-xl bg-kuning mt-3 flex flex-col md:flex-row">
         <img
            :src="getPhotoUrl(kelas.photo)"
            alt="Foto Kelas"
            class="w-28 h-28 md:w-32 md:h-32 object-cover mx-auto md:ml-8 rounded-lg"
          />

        <div class="flex-1 md:ml-4">
          <p class="font-bold ml-3 mb-1 md:text-base text-sm mt-2 md:mt-0">{{ kelas.title }}</p>
          <div class="flex">
            <img src="../assets/img/kalender.png" class="w-5 h-5 ml-4">
            <p class="ml-3 md:text-base text-sm">{{ kelas.date }}</p>
          </div>
          <div class="flex">
            <img src="../assets/img/jam.png" class="w-5 h-5 ml-4">
            <p class="ml-3 md:text-base text-sm">{{ formatTime(kelas.start_time) }} - {{ formatTime(kelas.end_time) }}</p>
          </div>
          <div class="flex">
            <img src="../assets/img/lokasi.png" class="w-5 h-5 ml-4">
            <p class="ml-4 md:text-base text-sm">{{ kelas.location?.name || 'Lokasi Tidak Ditemukan' }}, {{ kelas.address }}</p>
          </div>
          <div class="flex">
            <!-- <img src="../assets/img/lokasi.png" class="w-4 h-auto ml-4"> -->
            <p class="ml-4 md:text-base text-sm">kuota:{{ kelas.remaining_quota }} / {{ kelas.max_quota }}</p>
          </div>
        </div>
  
        <div class="flex flex-col justify-end items-end w-full md:w-auto mt-4 md:mt-0 mb-5 mr-8">
          <!-- <div class="md:text-lg font-bold text-center md:text-right text-red-800">FEE: {{ kelas.price }}K / Person</div> -->
          <div class="flex space-x-2 mt-2 justify-center md:justify-end">

            <RouterLink :to="`/classlist/classhistory/detailclass/${kelas.id}`">
              <button class="bg-pinktua text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm">
                Detail
              </button>
            </RouterLink>
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
  
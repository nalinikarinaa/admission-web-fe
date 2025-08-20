<script>
import HeaderAdmin from '@/components/HeaderAdmin.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "ClassList",
  components: {
    HeaderAdmin,
  },
  data() {
    return {
      isLoading: false,
      activeTab: 0,
      startDate: '',
      remark: '',
      kelasList: [],
      lokasiList: [],
      filterDate: '',
      filterName: '',
      filterLocation: '',
      showModal: {
        editClass: false,
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
      foto: null,
      previewFoto: '', 
      alamat:'',
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

    showModalEditClass(kelas) {
      this.showModal.editClass = true;
      this.idKelas = kelas.id;
      this.namakelas = kelas.title;
      this.tanggal = kelas.date;
      this.jammulai = kelas.start_time;
      this.jamselesai = kelas.end_time;
      this.lokasi = kelas.location?.id || kelas.location_id || '';
      this.harga = kelas.price;
      this.kuota = kelas.max_quota;
      this.deskripsi = kelas.description;
      this.foto = null;
      this.alamat = kelas.address;
    },

    closeModalEditClass() {
      this.showModal.editClass = false;
      this.resetForm();
    },

    resetForm() {
      this.namakelas = '';
      this.tanggal = '';
      this.jammulai = '';
      this.jamselesai = '';
      this.lokasi = '';
      this.harga = '';
      this.kuota = '';
      this.deskripsi = '';
      this.foto = null;
      this.alamat = '';
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.foto = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewFoto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    storeDataEditClass() {
  if (!this.namakelas || !this.tanggal || !this.jammulai || !this.jamselesai || !this.lokasi || !this.harga || !this.kuota || !this.deskripsi) {
    Swal.fire({
      icon: 'warning',
      title: 'Form belum lengkap',
      text: 'Harap isi semua field!',
    });
    return;
  }

  const formData = new FormData();
  formData.append('title', this.namakelas);
  formData.append('description', this.deskripsi);
  formData.append('location_id', this.lokasi);
  formData.append('address', this.alamat);
  formData.append('max_quota', this.kuota);
  formData.append('start_time', this.jammulai);
  formData.append('end_time', this.jamselesai);
  formData.append('date', this.tanggal);
  formData.append('price', this.harga);
  if (this.foto) {
    formData.append('photo', this.foto);
  }
  formData.append('_method', 'PUT');

  const config = {
    method: 'post',
    url: import.meta.env.VITE_APP_BACKEND_URL_API + `/classes/${this.idKelas}updateclass`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };

  axios(config)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kelas berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        this.fetchClasses();         // perbarui data
        this.closeModalEditClass();  // tutup modal
      }, 2500); // refresh dan close modal setelah 2.5 detik
    })
    .catch(error => {
      console.error('Gagal update kelas:', error);
      let errorMessage = "Terjadi kesalahan!";
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
        title: 'Error',
        text: errorMessage,
      });
    });
},


    deleteClass(id) {
      Swal.fire({
        title: 'Apakah kamu yakin?',
        text: "Data kelas akan dihapus permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          const config = {
            method: 'delete',
            url: import.meta.env.VITE_APP_BACKEND_URL_API + `/classes/${id}deleteclass`
          }

          axios(config)
            .then(() => {
              Swal.fire('Terhapus!', 'Kelas berhasil dihapus.', 'success');
              this.fetchClasses();
            })
            .catch(error => {
              console.error('Gagal hapus kelas:', error);
              Swal.fire('Error', 'Gagal menghapus kelas.', 'error');
            });
        }
      });
    },

    exportData() {
      const link = document.createElement('a');
      link.href = import.meta.env.VITE_APP_BACKEND_URL_API + '/export/class';
      link.setAttribute('download', 'kelas.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Class List</span>
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

<!-- Container Flex Utama -->
<div class="flex flex-wrap justify-between items-end mb-6 gap-4">

<!-- Bagian Kiri: Filter -->
<div class="flex flex-wrap gap-4">
  <!-- Tanggal -->
  <div>
    <label for="start-date" class="block text-sm font-medium">Date</label>
    <input
      id="start-date"
      v-model="filterDate"
      type="date"
      class="mt-1 block w-full border border-ungutext rounded-md p-2 text-xs md:text-sm"
    />
  </div>

  <!-- Nama Kelas -->
  <div>
    <label for="classname" class="block text-sm font-medium">Class Name</label>
    <input
      id="classname"
      v-model="filterName"
      type="text"
      class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs md:text-sm"
    />
  </div>

  <!-- Lokasi -->
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

  <!-- Reset -->
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

<!-- Bagian Kanan: Tombol -->
<div class="flex gap-3 mt-1">
  <button
    @click="exportData"
    class="px-4 py-2 bg-pinktua text-white rounded-md hover:bg-gray-600 text-xs md:text-sm"
  >
    Export Class
  </button>

  <RouterLink to="/classlist/addclass">
    <button class="px-4 py-2 bg-ungu text-white rounded-md hover:bg-gray-600 text-xs md:text-sm">
      Add Class
    </button>
  </RouterLink>
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
  
      <div v-for="kelas in filteredKelasList" :key="kelas.id" class="p-3 rounded-lg shadow-xl bg-kuning mt-3 flex flex-col md:flex-row">
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
          <p class="ml-4 md:text-base text-sm">Kuota:</p>
          <p class="ml-2 md:text-base text-sm">
            <span v-if="kelas.remaining_quota === 0" class="text-red-500 font-semibold">
              Kelas sudah penuh!
            </span>
            <span v-else>
              {{ kelas.remaining_quota }} / {{ kelas.max_quota }}
            </span>
          </p>
        </div>
        </div>
  
        <div class="flex flex-col justify-end items-end w-full md:w-auto mt-4 md:mt-0 mb-5 mr-8">
          <div class="md:text-lg font-bold text-center md:text-right text-red-800">FEE: {{ kelas.price }}K / Person</div>
          <div class="flex space-x-2 mt-2 justify-center md:justify-end">
  <button
    class="bg-ungu text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"
    @click="showModalEditClass(kelas)"
  >
    Edit
  </button>
  <button
    class="bg-pinktua text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"
    @click="deleteClass(kelas.id)"
  >
    Delete
  </button>
</div>
        </div>
      </div>
    </div>
  
   <!-- Modal -->
<div v-if="showModal.editClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
    <button @click="closeModalEditClass" class="absolute top-2 right-2 text-black text-xl">&times;</button>
    <h1 class="text-black font-bold text-xl text-center mb-4">Edit Class</h1>

    <form @submit.prevent="storeDataEditClass" class="space-y-3">
        <div>
          <label class="block text-black">Class Name</label>
          <input type="text" v-model="namakelas" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label class="block text-black">Date</label>
          <input type="date" v-model="tanggal" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label class="block text-black">Time Start</label>
          <input type="time" v-model="jammulai" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label class="block text-black">Time End</label>
          <input type="time" v-model="jamselesai" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label class="block text-black">Location</label>
          <select v-model="lokasi" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
            <option disabled value="">Pilih Lokasi</option>
            <option v-for="item in lokasiList" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
        </div>

        <div>
          <label for="address" class="block text-black">Address</label>
          <textarea
            id="deskripsi"
            v-model="alamat"
            rows="4"
            class="block w-full border border-gray-300 rounded-md p-2 text-sm">
          </textarea>
        </div>

        <div>
          <label class="block text-black">Price</label>
          <input type="text" v-model="harga" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label class="block text-black">Kuota</label>
          <input type="text" v-model="kuota" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label class="block text-black">Upload Photo</label>
          <input type="file" @change="handleFileUpload" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
        </div>

        <div>
          <label for="description" class="block text-black">Description</label>
          <textarea id="deskripsi" v-model="deskripsi" rows="4" class="block w-full border border-gray-300 rounded-md p-2 text-sm"></textarea>
        </div>

        <button class="bg-pinktua text-white w-full py-1 rounded-md hover:bg-gray-600 shadow-lg">
          Update
        </button>
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
  
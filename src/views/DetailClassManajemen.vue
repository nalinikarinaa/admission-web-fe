<script>
import axios from 'axios';
import HeaderAdmin from '@/components/HeaderAdmin.vue';

export default {
  name: "DetailManajemenKelas",
  components: {
    HeaderAdmin,
  },
  props: {
    id: {
      type: String,  // or Number based on what `id` is
      required: true
    },
  },
  data() {
    return {
      isLoading: false,
      activeTab: 1,
      filterClass: '',
      users: [],
      classTitle: '',
      showBukti: false,
      paymentFile: '',

      form: {
        name: '',
        phone: '',
        instagram: '',
        email: '',
        payment: '',
        status: '',
        pembayaran: '',
        class: ''
      },

      showModal: {
        verifikasi: false,
      },
    };
  },
  computed: {
    filteredUsers() {
      if (!this.filterClass) return this.users;
      return this.users.filter(user =>
        user.class?.toLowerCase().includes(this.filterClass.toLowerCase())
      );
    }
  },
  created() {
    const classId = this.$route.params.id;
    console.log('Class ID:', classId);
    this.fetchParticipants(classId);
    this.fetchClassDetail(classId);
  },
  methods: {
   fetchClassDetail(classId) {
    this.isLoading = true;
      const config = {
        method: 'get',
        url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/classes/${classId}detailclass`
      };

  axios(config)
    .then(response => {
      this.classTitle = response.data.data.title; // Pastikan API return field `title`
      console.log('Nama kelas:', this.classTitle);
    })
    .catch(error => {
      console.error("Gagal mengambil detail kelas:", error);
    })
    .finally(() => {
      this.isLoading = false;
    });
},

    fetchParticipants(classId) {
      this.isLoading = true;
      const config = {
        method: 'get',
        url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/classes/${classId}/participants`
      };

      axios(config)
        .then(response => {
          this.users = response.data.data;
          console.log("DATA:", response.data);
          console.log("CONFIG:", response.config);
        })
        .catch(error => {
          console.error("Gagal mengambil peserta:", error);
        })
        .finally(() => {
      this.isLoading = false;
    });
    },
//  getBuktiUrl(filePath) {
  //   if (!filePath) return '/default-placeholder.jpg';
  //   if (filePath.startsWith('http')) return filePath.replace('https://', 'http://');
  //   let backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  //   backendUrl = backendUrl.replace('https://', 'http://');
  //   return backendUrl + 'storage/payments/' + filePath;
  // },
  
  // lihatBukti(filePath) {
  //   this.buktiUrl = filePath;
  //   this.showBukti = true;
  // },


  // closeBukti() {
  //   this.showBukti = false;
  //   this.buktiUrl = '';
  // },
  //  

  fetchParticipants(classId) {
    this.isLoading = true;
    const config = {
      method: 'get',
      url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/classes/${classId}/participants`,
    };

    axios(config)
      .then(response => {
        this.users = response.data.data;

        // Assuming 'payment' field contains the file path
        this.users.forEach(user => {
          // If the user has a payment file, construct the URL
          if (user.payment) {
            user.paymentUrl = this.getBuktiUrl(user.payment); // Add the full URL for the payment proof
          }
        });

        console.log("DATA:", response.data);
      })
      .catch(error => {
        console.error("Gagal mengambil peserta:", error);
      })
      .finally(() => {
      this.isLoading = false;
    });
  },

  // Method to build the URL for payment proof images
  getBuktiUrl(filePath) {
  // Cek lebih awal apakah tipe data valid
  if (typeof filePath !== 'string' || !filePath) {
    console.warn("File path invalid atau kosong:", filePath);
    return '/default-placeholder.jpg';
  }

  // Jika sudah full URL
  if (filePath.startsWith('http')) {
    return filePath.replace('https://', 'http://');
  }

  // URL backend dari env
  let backendUrl = import.meta.env.VITE_APP_BACKEND_URL || '';
  backendUrl = backendUrl.replace('https://', 'http://');

  return backendUrl + 'storage/' + filePath;
},

lihatBukti(filePath) {
  console.log('File Path:', filePath);  // Debug untuk memastikan filePath yang diteruskan valid
  this.buktiUrl = this.getBuktiUrl(filePath);  // Panggil getBuktiUrl dengan filePath
  this.showBukti = true;
},

  closeBukti() {
    this.showBukti = false;
  },

    storeDataVerifikasi() {
  const id = this.form.id; // pastikan form berisi ID pendaftaran peserta

  const config = {
    method: 'put',
    url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/registerclass/${id}/verifikasi`,
    data: {
      payment_verification: this.form.payment,
      class_verification: this.form.class
    }
  };

  axios(config)
    .then(response => {
      console.log('Verifikasi berhasil:', response.data);
      this.closeModalVerifikasi();
      this.fetchParticipants(this.$route.params.id); // refresh data
    })
    .catch(error => {
      console.error('Gagal update verifikasi:', error.response?.data || error);
    });
},

exportPesertaPerKelas(classId) {
  if (!classId) {
    console.warn('classId tidak tersedia');
    return;
  }

  const link = document.createElement('a');
  link.href = `${import.meta.env.VITE_APP_BACKEND_URL_API}/export/peserta/perkelas/${classId}`;
  link.setAttribute('download', `peserta_kelas_${classId}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
},


    setActiveTab(index) {
      this.activeTab = index;
    },
    showModalVerifikasi(user) {
  this.form = {
    id: user.id,
    nama: user.nama,
    phone_number: user.phone_number,
    instagram: user.instagram,
    email: user.email,
    payment: user.payment_verification,
    class: user.class_verification,
    paymentFile: user.payment
  };
  this.showModal.verifikasi = true;
},

    // showModalVerifikasi() {
    //   this.showModal.verifikasi = true;
    // },
    closeModalVerifikasi() {
      this.showModal.verifikasi = false;
    },
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<template>
    <HeaderAdmin />
  
    <div class="md:ml-12 ml-4 pt-10">
      <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Detail Class</span>
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
      <p class="mb-5 font-bold">Detail Class: {{ classTitle }}</p>

  
      <!-- Form untuk Batch Proctoring -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mt-4 mb-4">
  <!-- Filter Section -->
  <div class="flex flex-col sm:flex-row gap-2">
    <input
      v-model="filterClass"
      type="text"
      placeholder="Class Name"
      class="border border-ungutext px-3 py-2 rounded-md w-full sm:w-auto"
    />
    <button
      @click="applyFilter"
      class="bg-pink-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
    >
      Filter
    </button>
  </div>

  <!-- Export Button -->
  <div class="mt-2 md:mt-0">
    <button
  @click="exportPesertaPerKelas(id)"
  class="bg-ungu text-white px-4 py-2 rounded w-full md:w-auto"
>
  Export Data
</button>
</div>

</div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 text-ungutext">
          <tr>
            <th class="px-4 py-2">NO</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Phone Number</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Pembayaran</th>
            <th class="px-4 py-2">Aksi</th>
          </tr>
        </thead>

        <div v-if="isLoading" class="flex justify-center items-center py-8">
  <svg class="animate-spin h-6 w-6 text-ungu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
    </path>
  </svg>
  <span class="ml-2 text-gray-600 font-medium">Loading data...</span>
</div>

        <tbody>
          <tr
            v-for="(user, index) in filteredUsers"
            :key="index"
            class="border-b"
          >
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ user.nama }}</td>
            <td class="px-4 py-2">{{ user.phone_number }}</td>
           <td class="px-4 py-2 font-bold">
            <span :class="{
                'text-green-600': user.class_verification === 'aktif',
                'text-red-600': user.class_verification !== 'aktif'
              }">
                {{ user.class_verification }}
              </span>
          </td>

          <td class="px-4 py-2 font-bold">
              <span :class="{
                'text-green-600': user.payment_verification === 'lunas',
                'text-yellow-500': user.payment_verification === 'pending',
                'text-red-600': user.payment_verification === 'gagal'
              }">
                {{ user.payment_verification }}
              </span>
            </td>

            <td class="px-4 py-2 text-pink-600">
              <button class="bg-pinktua text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"  @click="showModalVerifikasi(user)">Verifikasi</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-between text-sm text-gray-600">
      <span>Showing 1 to {{ filteredUsers.length }} of {{ users.length }} entries</span>
      <div class="flex gap-2 items-center">
        <span>Previous</span>
        <button class="border px-2 py-1 rounded-md bg-gray-200">1</button>
        <span class="text-gray-400">10</span>
        <span>Next</span>
      </div>
    </div>
    </div>
  
   <!-- Modal -->
<div v-if="showModal.verifikasi" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
    <button @click="closeModalVerifikasi" class="absolute top-2 right-2 text-black text-xl">&times;</button>
    <h1 class="text-black font-bold text-xl text-center mb-4">Verification Class</h1>

    <form @submit.prevent="storeDataVerifikasi" class="space-y-3">
          <div>
            <label class="block text-black">Name</label>
            <input type="text" v-model="form.nama" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
          </div>
          
          <div>
            <label class="block text-black">Phone Number</label>
            <input type="text" v-model="form.phone_number" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
          </div>

          <div>
            <label class="block text-black">Instagram</label>
            <input type="text" v-model="form.instagram" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
          </div>

          <div>
            <label class="block text-black">Email</label>
            <input type="email" v-model="form.email" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
          </div>

          <div class="font-bold">
              <span class="block font-medium text-gray-600">Pembayaran:</span>
              
              <!-- Display the "Klik untuk melihat bukti pembayaran" button if paymentFile exists -->
              <span v-if="form.paymentFile" @click="lihatBukti(form.paymentFile)" style="color: purple; text-decoration: underline;" >
              Klik untuk melihat bukti pembayaran
            </span>
            <span v-else class="text-gray-400 italic">Tidak ada bukti</span>
            </div>
   
          <!-- VERIFIKASI -->
           <div class="mt-4 text-red-600">
            VERIFICATION <br>
           </div>
           
           <div>
            <label class="block text-black">Payment Verifikasi</label>
            <select v-model="form.payment" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
              <option value="" disabled selected>Select</option>
              <option value="lunas">LUNAS</option>
              <option value="gagal">GAGAL</option>
            </select>
          </div>

          <div>
            <label class="block text-black">Class Verifikasi</label>
            <select v-model="form.class" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
              <option value="" disabled selected>Select</option>
              <option value="aktif">AKTIF</option>
              <option value="tidak aktif">TIDAK AKTIF</option>
            </select>
          </div>

          <button class="bg-pinktua text-white w-full py-1 rounded-md hover:bg-gray-600 shadow-lg">submit</button>
        </form>
  </div>
</div>
  

    <!-- Modal Bukti Pembayaran -->
<div v-if="showBukti" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
  <div class="bg-white p-4 rounded-lg max-w-md w-full">
    <h2 class="text-lg font-semibold mb-2 text-center">Bukti Pembayaran</h2>
    <img :src="buktiUrl" alt="Bukti Absensi" class="w-full max-h-[400px] object-contain rounded mb-4" />
    <button @click="closeBukti" class="bg-pinktua text-white px-4 py-2 rounded w-full hover:bg-gray-600">Tutup</button>
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
  
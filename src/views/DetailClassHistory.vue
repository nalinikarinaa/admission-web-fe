<script>
  import HeaderAdmin from '@/components/HeaderAdmin.vue';
  import axios from 'axios';
  
  export default {
    name: "DetailClassHistory",
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
        users: [],
        rawAbsensi: [],
        feedbackUsers: [],
        activeTab: 2,
        startDate: '',
        remark: '',
        filterClass: '',
        showAbsensi: false,
        absensiUrl: '',
        form: {
          nama: '',
        name: '',
        phone: '',
        instagram: '',
        email: '',
        payment: '',
        status: '',
        absensi:'',
        absensiFile:'',
        comment:'',
      },
        showModal: {
          verifikasi: false,
        },
      };
    },
    computed: {
    filteredUsers() {
      if (!this.filterClass) return this.users
      return this.users.filter(user =>
        user.class.toLowerCase().includes(this.filterClass.toLowerCase())
      )
    }
  },
  created() {
    const classId = this.$route.params.id;
    console.log('Class ID:', classId);
    this.fetchParticipants(classId);
    this.fetchClassDetail(classId);
    this.fetchParticipantsFeedback(classId);
  },
    methods: {
        applyFilter() {
      // Filter otomatis jalan lewat computed
    },

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
        url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/classabsensi/${classId}/participants`
      };

      axios(config)
    .then(response => {
      this.rawAbsensi = response.data.data; // simpan dulu ke temp
      this.tryMergeAbsensiFeedback();
    })
        .catch(error => {
          console.error("Gagal mengambil peserta:", error);
        })
        .finally(() => {
      this.isLoading = false;
    });
    },

    // Method to build the URL for payment proof images
  getAbsensiUrl(filePath) {
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

lihatAbsensi(filePath) {
  console.log('File Path:', filePath);  // Debug untuk memastikan filePath yang diteruskan valid
  this.absensiUrl = this.getAbsensiUrl(filePath);  // Panggil getBuktiUrl dengan filePath
  this.showAbsensi = true;
},

  closeAbsensi() {
    this.showAbsensi = false;
  },

  storeDataVerifikasi() {
  const id = this.form.id; // pastikan form berisi ID pendaftaran peserta

  const config = {
    method: 'put',
    url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/absensiclass/${id}/verifikasi`,
    data: {
      absensi_verification: this.form.absensi_verification
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

fetchParticipantsFeedback(classId) {
  const config = {
    method: 'get',
    url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/feedback/${classId}/participants`
  };

  axios(config)
    .then(response => {
      this.feedbackUsers = response.data.data;
      this.tryMergeAbsensiFeedback();
    })
    .catch(error => {
      console.error("Gagal mengambil feedback:", error);
    });
},

// Gabungkan data jika keduanya sudah tersedia
tryMergeAbsensiFeedback() {
  // Gunakan absensi sebagai dasar, dan merge feedback kalau ada
  this.users = this.rawAbsensi.map(absenUser => {
    const matchedFeedback = this.feedbackUsers.find(f => f.user_id === absenUser.user_id);

    return {
      ...absenUser,
      feedback_id: matchedFeedback?.id || null,
      comment: matchedFeedback?.comment || null,
      status_feedback: matchedFeedback?.status || null,
      feedback_verification: matchedFeedback?.feedback_verification || "",
      nama: matchedFeedback?.nama || absenUser.nama,
      phone_number: matchedFeedback?.phone_number || "",
      instagram: matchedFeedback?.instagram || "",
      email: matchedFeedback?.email || "",
    };
  });
},


storeDataVerifikasiFeedback() {
  if (!this.form.feedback_verification) {
    alert("Mohon pilih status verifikasi terlebih dahulu.");
    return;
  }
  const id = this.form.id; // pastikan form berisi ID pendaftaran peserta

  const config = {
    method: 'put',
    url: `${import.meta.env.VITE_APP_BACKEND_URL_API}/admin/feedback/${id}/verifikasi`,
    data: {
      feedback_verification: this.form.feedback_verification
    }
  };

  axios(config)
    .then(response => {
      console.log('Verifikasi berhasil:', response.data);
      this.closeModalFeedback();
      this.fetchParticipantsFeedback(this.$route.params.id); // refresh data
    })
    .catch(error => {
      console.error('Gagal update verifikasi:', error.response?.data || error);
    });
},

      submitForm() {
        if (!this.startDate || !this.remark) {
          alert('Please fill out all fields');
          return;
        }
  
        console.log("Form submitted:", this.startDate, this.remark);
        console.log("Edit Form submitted:", this.form);
  
        // Reset form
        this.startDate = '';
        this.remark = '';
        this.form = { name: '', date: '', time: '', location: '' };
  
        // Tutup modal
        this.showModal.verifikasi = false;
      },
      setActiveTab(index) {
        this.activeTab = index;
      },
     showModalFeedback(user) {
  this.form = {
    id: user.feedback_id || null,
    name: user.nama,
    phone: user.phone_number,
    instagram: user.instagram,
    email: user.email,
    feedback: user.feedback_verification || '',
    feedback_verification: "",
    comment: user.comment || null
  };

  this.showModal.feedback = true; // Tetap buka modal meskipun feedback tidak ada
},


      closeModalFeedback() {
        this.showModal.feedback = false;
      },

      showModalVerifikasi(user) {
        console.log("USER DATA:", user); 
        console.log("DATA USER YANG DIKLIK:", user);

        this.form = {
          // id: user.absensi_id,
        id: user.id,
        name: user.nama, // gunakan data yang benar
        phone: user.phone_number,
        instagram: user.instagram,
        email: user.email,
        absensi: user.absen_verification,
        absensi_verification: user.absen_verification,
        absensiFile: user.foto_kehadiran
      };
      this.showModal.verifikasi = true;
    },
      closeModalVerifikasi() {
        this.showModal.verifikasi = false;
      },
      formatFeedbackStatus(status) {
  if (!status) return 'Belum Diverifikasi';
  if (status === 'terima') return 'Diterima';
  if (status === 'tolak') return 'Ditolak';
  return status;
},
formatAbsensiStatus(status) {
  if (!status) return 'Belum Absen';
  if (status === 'hadir') return 'Hadir';
  if (status === 'tidak_hadir') return 'Tidak Hadir';
  if (status === 'izin') return 'Izin';
  if (status === 'pending') return 'Belum Diverifikasi';
  return status;
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
       <p class="mb-5 font-bold">Detail Class: {{ classTitle }}</p>
  
      <!-- Form untuk Batch Proctoring -->
      <div class="flex items-center justify-between mb-4">
      <div class="flex gap-2">
        <input
          v-model="filterClass"
          type="text"
          placeholder="Class Name"
          class="border px-3 py-2 rounded-md"
        />
        <button @click="applyFilter" class="bg-pink-600 text-white px-4 py-2 rounded-md">
          Filter
        </button>
      </div>
      <button class="bg-pink-600 text-white px-6 py-2 rounded-md">Export</button>
    </div>



    <div class="overflow-x-auto">
  <table class="w-full text-left border-collapse">
    <thead class="bg-gray-100 text-ungutext">
      <tr>
        <th class="px-4 py-2">NO</th>
        <th class="px-4 py-2">Name</th>
        <th class="px-4 py-2">Absensi</th>
        <th class="px-4 py-2">Feedback</th>
        <th class="px-4 py-2">Aksi</th>
      </tr>
    </thead>

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

<!-- Jika tidak loading dan tidak ada data -->
<div v-else-if="users.length === 0" class="text-center py-8 text-gray-500 font-medium">
  Anda belum memiliki riwayat kelas.
</div>

    <tbody>
      <tr
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="border-b"
      >
        <td class="px-4 py-2">{{ index + 1 }}</td>
        <td class="px-4 py-2">{{ user.nama }}</td>

        <!-- Absensi Status -->
        <td class="px-4 py-2 font-bold">
          <span :class="user.status === 'hadir' ? 'text-green-600' : 'text-red-600'">
            {{ formatAbsensiStatus(user.status) }}
          </span>
        </td>

      <!-- Feedback Comment -->
        <td class="px-4 py-2 font-bold">
          <span :class="user.status_feedback === 'terima' ? 'text-green-600' : 'text-red-600'">
            {{ formatFeedbackStatus(user.status_feedback) }}
          </span>
        </td>


        <!-- Aksi -->
        <td class="px-4 py-2 space-x-2">
          <button
            class="bg-pinktua text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"
            @click="showModalVerifikasi(user)"
          >
            Verifikasi Absensi
          </button>
          <button
            class="bg-ungu text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"
            @click="showModalFeedback(user)"
          >
            Lihat Feedback
          </button>
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
  
   <!-- ModalVerifikasi -->
<div v-if="showModal.verifikasi" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
    <button @click="closeModalVerifikasi" class="absolute top-2 right-2 text-black text-xl">&times;</button>
    <h1 class="text-black font-bold text-xl text-center mb-4">Verification Class</h1>

    <form @submit.prevent="storeDataVerifikasi" class="space-y-3">
          <div>
            <label class="block text-black">Name</label>
            <input type="text" v-model="form.name" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
          </div>

          <div class="font-bold">
              <span class="block font-medium text-gray-600">Absensi:</span>
              
              <!-- Display the "Klik untuk melihat bukti pembayaran" button if paymentFile exists -->
              <span v-if="form.absensiFile" @click="lihatAbsensi(form.absensiFile)" style="color: purple; text-decoration: underline;" >
              Klik untuk melihat bukti absensi
            </span>
            <span v-else class="text-gray-400 italic">Tidak ada bukti</span>
            </div>
          
          <!-- VERIFIKASI -->
           <div class="mt-4 text-red-600">
            VERIFICATION <br>
           </div>

          <div>
            <label class="block text-black">Absen Verifikasi</label>
            <select v-model="form.absensi_verification" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
              <option value="" disabled selected>Select</option>
              <option value="verifikasi">verifikasi</option>
              <option value="tidak_hadir">tolak</option>
            </select>
          </div>
          <button class="bg-pinktua text-white w-full py-1 rounded-md hover:bg-gray-600 shadow-lg">submit</button>
        </form>
      </div>
    </div>
  
    <!-- ModalFeedback -->
<div v-if="showModal.feedback" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
    <button @click="closeModalFeedback" class="absolute top-2 right-2 text-black text-xl">&times;</button>
    <h1 class="text-black font-bold text-xl text-center mb-4">Verification Feedback</h1>

    <form @submit.prevent="storeDataVerifikasiFeedback" class="space-y-3">
      <!-- Name -->
      <div>
        <label class="block text-black">Name</label>
        <input type="text" v-model="form.name" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200" disabled>
      </div>

      <!-- Feedback Display -->
      <div class="font-bold">
        <span class="block font-medium text-gray-600">Feedback:</span>
        <span v-if="form.comment">{{ form.comment }}</span>
        <span v-else class="italic text-gray-500">User belum mengirimkan feedback.</span>
      </div>

      <!-- Verification Only If Feedback Exists -->
      <div v-if="form.comment">
        <div class="mt-4 text-red-600 font-semibold">
          VERIFICATION
        </div>

        <div>
          <label class="block text-black">Feedback Verifikasi</label>
          <select v-model="form.feedback_verification" class="w-full border border-gray-300 p-1 rounded-md bg-gray-200">
            <option disabled value="">Select</option>
            <option value="verifikasi">verifikasi</option>
            <option value="tolak">tolak</option>
          </select>
        </div>

        <button class="bg-pinktua text-white w-full py-1 rounded-md hover:bg-gray-600 shadow-lg mt-2">
          Submit
        </button>
      </div>
    </form>
  </div>
</div>

  

<!-- Modal Foto Absensi -->
<div v-if="showAbsensi" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
  <div class="bg-white p-4 rounded-lg max-w-md w-full">
    <h2 class="text-lg font-semibold mb-2 text-center">Bukti Kehadiran</h2>
    <img :src="absensiUrl" alt="Bukti Absensi" class="w-full max-h-[400px] object-contain rounded mb-4" />
    <button @click="closeAbsensi" class="bg-pinktua text-white px-4 py-2 rounded w-full hover:bg-gray-600">Tutup</button>
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
  
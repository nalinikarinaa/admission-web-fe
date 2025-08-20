<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'RegisterClassForm',
  props: ['classId'],

  data() {
    return {
      name: '',
      phone_number: '',
      instagram: '',
      email: '',
      payment: null,
      userId: null,
    };
  },

  mounted() {
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
    handleFileUpload(event) {
      this.payment = event.target.files[0];
    }, 
   
   storeDataregisterClass() {
  if (!this.phone_number || !this.instagram || !this.payment) {
    Swal.fire({
      icon: 'warning',
      title: 'Form belum lengkap',
      text: 'Harap isi semua field dan upload bukti pembayaran!',
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

  // 🔍 Cek apakah user sudah terdaftar
  axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_API}/registerclass/check?user_id=${this.userId}&class_id=${this.classId}`)
    .then((res) => {
      if (res.data && res.data.exists) {
        Swal.fire({
          icon: 'info',
          title: 'Sudah Terdaftar',
          text: 'Kamu sudah mendaftar untuk kelas ini sebelumnya.',
        });
        return;
      }

      // ✅ Belum terdaftar, lanjutkan submit
      const formData = new FormData();
      formData.append('phone_number', this.phone_number);
      formData.append('instagram', this.instagram);
      formData.append('payment', this.payment);
      formData.append('user_id', this.userId);
      formData.append('class_id', this.classId);

      Swal.fire({
        title: 'Register kelas...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const config = {
        method: 'post',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/registerclass/registerclass',
        headers: {
          Accept: 'application/json',
        },
        data: formData
      }

      axios(config)
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: 'Data kamu sudah kami terima.',
          }).then(() => {
            this.$router.push('/transaction');
          });
        })
        .catch((error) => {
          console.error("Register Class Error:", error);

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
            title: 'Pendaftaran Gagal',
            text: errorMessage,
          });
        });
    })
    .catch((err) => {
      console.error('Error checking registration status:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengecek Pendaftaran',
        text: 'Terjadi kesalahan saat mengecek status pendaftaran.',
      });
    });
}

  }
}
</script>




<template>
  <Header />
  
  <img src="../assets/img/header.png" class="w-full h-auto mx-auto mt-2" />

  <div class="md:ml-12 ml-4 pt-3">
    <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Register Class</span>
  </div>
  <hr class="bg-pinktua h-0.5 mt-1 border-none" />

  <div class="p-4 md:p-8 md:mx-32 mx-4 bg-ungu rounded-lg mb-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl">
    
    <!-- Bagian Persyaratan -->
    <div class="text-white md:ml-16 ml-0 mt-4 md:mt-10">
      <h2 class="text-ungutext font-bold text-lg mb-2">Requirements</h2>
      <ul class="list-disc list-inside text-ungutext space-y-1">
        <li>Isi data diri dengan lengkap</li>
        <li>Melakukan payment hanya melalui Nomor Rekening Berikut:</li>
        <p class="ml-5 font-bold">BCA: 8161799114 an Nabilah Fairuz</p>
        <li class="font-bold">NON REFUNDABLE</li>
      </ul>
    </div>

    <!-- Formulir -->
    <div class="md:mr-16 mr-0">
      <h1 class="text-ungutext font-bold text-xl text-center mb-4">Register In </h1>
      
      <form @submit.prevent="storeDataregisterClass" class="space-y-3">
        <!-- <div>
          <label class="block text-ungutext">Name</label>
          <input type="text" v-model="name" class="w-full border border-ungutext p-2 rounded-md bg-gray-200" />
        </div> -->

        <div>
          <label class="block text-ungutext">Phone Number</label>
          <input type="text" v-model="phone_number" class="w-full border border-ungutext p-2 rounded-md bg-gray-200" placeholder="phone number" />
        </div>

        <div>
          <label class="block text-ungutext">Instagram</label>
          <input type="text" v-model="instagram" class="w-full border border-ungutext p-2 rounded-md bg-gray-200 " placeholder="instagram" />
        </div>

        <!-- <div>
          <label class="block text-ungutext border">Email</label>
          <input type="email" v-model="email" class="w-full border border-ungutext p-2 rounded-md bg-gray-200" />
        </div> -->

        <div>
          <label class="block text-ungutext">Upload Payment</label>
          <input type="file" @change="handleFileUpload" class="w-full border text-gray-400 border-ungutext p-2 rounded-md bg-gray-200" />
        </div>

        <button class="bg-pinktua text-white w-full py-2 rounded-md hover:bg-gray-600 shadow-lg">Submit</button>
      </form>
    </div>

  </div>

</template>

<script setup>
import Header from '../components/Header.vue';
</script>



<style scoped>
button {
  transition: all 0.2s;
}
button:hover {
  transform: scale(1.05);
}
</style>
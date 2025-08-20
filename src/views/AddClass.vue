<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import HeaderAdmin from '@/components/HeaderAdmin.vue'

export default {
  name: 'AddClass',
  components: {
    HeaderAdmin,
  },
  data() {
    return {
      namakelas: '',
      tanggal: '',
      jammulai: '',
      jamselesai: '',
      lokasi: '', // selected location_id
      lokasiList: [], // daftar lokasi dari API
      alamat: '',
      harga: '',
      kuota: '',
      deskripsi: '',
      foto: null,
    }
  },
  mounted() {
    this.fetchLocations(); // ambil daftar lokasi saat halaman dibuka
  },
  methods: {
    fetchLocations() {
      axios.get(import.meta.env.VITE_APP_BACKEND_URL_API + '/location/locationlist')
        .then((response) => {
          this.lokasiList = response.data.locations; // << perbaikan disini
        })
        .catch((error) => {
          console.error('Gagal ambil lokasi:', error);
        });
    },

    handleFileUpload(event) {
      this.foto = event.target.files[0];
    },

    storeDataTambahClass() {
      if (!this.namakelas || !this.tanggal || !this.jammulai || !this.jamselesai || !this.lokasi || !this.harga || !this.kuota || !this.deskripsi || !this.foto) {
        Swal.fire({
          icon: 'warning',
          title: 'Form belum lengkap',
          text: 'Harap isi semua field dengan benar!',
        })
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
      formData.append('photo', this.foto);
      formData.append('address', this.alamat);

      const config = {
        method: 'post',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/classes/postclass',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }

      axios(config)
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Kelas berhasil ditambahkan.',
          }).then(() => {
            this.$router.push('/classlist/admin')
          })
        })
        .catch((error) => {
          console.error("Tambah kelas error:", error);

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
            title: 'Gagal',
            text: errorMessage,
          });
        });
    },
  }
}
</script>

<template>
  <HeaderAdmin/>
  <img src="../assets/img/header.png" class="h-3/4 w-screen mx-auto mt-2">

  <div class="md:ml-12 ml-4 pt-3 ">
    <span class="md:text-2xl text-xl font-semibold mb-8">Add Class</span>
  </div>
  <hr class="bg-pinktua h-0.5 mt-1 border-none">

  <div class="p-8 md:mx-32 mx-5 bg-ungu rounded-lg mb-8 mt-8 shadow-xl flex items-center justify-center">
    <div class="w-full max-w-lg">
      <h1 class="text-black font-bold text-xl text-center mb-4">Add Class</h1>
        
      <form @submit.prevent="storeDataTambahClass" class="space-y-3">
        <div>
          <label class="block text-black">Class Name</label>
          <input type="text" v-model="namakelas" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>
        
        <div>
          <label class="block text-black">Date</label>
          <input type="date" v-model="tanggal" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>

        <div>
          <label class="block text-black">Time start</label>
          <input type="time" v-model="jammulai" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>

        <div>
          <label class="block text-black">Time end</label>
          <input type="time" v-model="jamselesai" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>

        <div>
          <label class="block text-black">Location</label>
          <select v-model="lokasi" class="w-full border border-gray-300 p-1 rounded-md ">
            <option disabled value="">Pilih Lokasi</option>
            <option v-for="item in lokasiList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
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
          <input type="text" v-model="harga" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>

        <div>
          <label class="block text-black">Kuota</label>
          <input type="text" v-model="kuota" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>

        <div>
          <label class="block text-black">Upload Photo</label>
          <input type="file" @change="handleFileUpload" class="w-full border border-gray-300 p-1 rounded-md ">
        </div>

        <div>
          <label for="description" class="block text-black">Description</label>
          <textarea
            id="deskripsi"
            v-model="deskripsi"
            rows="4"
            class="block w-full border border-gray-300 rounded-md p-2 text-sm">
          </textarea>
        </div>

        <button class="bg-pinktua text-white w-full py-1 rounded-md hover:bg-gray-600 shadow-lg">
          Submit
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

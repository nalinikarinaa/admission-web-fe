<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'RegisterForm',
  data() {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
    }
  },

  methods: {
    registerUser() {
      if (!this.name || !this.username || !this.email || !this.password) {
        Swal.fire({
          icon: 'warning',
          title: 'Form belum lengkap',
          text: 'Harap isi semua field terlebih dahulu!',
        })
        return
      }

      Swal.fire({
        title: 'Mendaftarkan akun...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const config = {
        method: 'post',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/auth/register',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
        data: {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
        },
      }

      axios(config)
        .then((response) => {
          Swal.fire({
          icon: 'info',
          title: 'Cek Email Kamu!',
          text: 'Link verifikasi telah dikirim ke email. Silakan verifikasi dulu sebelum login. Jangan lupa cek di spam inbox juga yaa',
        }).then(() => {
            this.$router.push('/login')
          })
        })
        .catch((error) => {
        console.error("Register error:", error);

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
          title: 'Pendaftaran Gagal',
          text: errorMessage,
        });
      });
    },
  }
}
</script>


<template>
  <div class="bg-ungu grid grid-cols-1 md:grid-cols-2 h-screen overflow-auto">
    <!-- Gambar di kiri -->
    <div class="hidden md:flex">
      <img src="../assets/img/kontenlogin.png" class="mt-10 animate-fade-in max-w-full h-auto" />
    </div>

    <!-- Form -->
    <div class="flex items-center justify-center p-4">
      <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md animate-fade-in">
        <div class="flex items-center justify-center mb-5">
          <img src="../assets/img/logoo.png" class="w-24 h-auto" />
        </div>
        <h2 class="text-center font-bold text-lg mb-6 text-ungutext">CREATE ACCOUNT</h2>

        <form @submit.prevent="registerUser" class="space-y-4">
          <!-- Name -->
         <div>
            <label class="block text-sm font-medium text-ungutext mb-1">Name</label>
            <input
              v-model="name"
              type="name"
              class="form-input w-full border border-ungutext rounded-lg h-10 pl-4"
              placeholder="name"
            />
         </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-ungutext mb-1">Username</label>
            <input
              v-model="username"
              type="username"
              class="form-input w-full border border-ungutext rounded-lg h-10 pl-4"
              placeholder="username"
            />
          </div>


          <!-- Email -->
            <div>
            <label class="block text-sm font-medium text-ungutext mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              class="form-input w-full border border-ungutext rounded-lg h-10 pl-4"
              placeholder="email"
            />
          </div>

          <!-- Password -->
          <div>
           <label class="block text-sm font-medium text-ungutext mb-1">Password</label>
            <input
                v-model="password"
                type="password"
                class="form-input w-full border border-ungutext rounded-lg h-10 pl-4"
                placeholder="password"
              />
            </div>

          <!-- Submit -->
          <button
            type="submit"
            class="text-white bg-pinktua hover:bg-ungu w-full font-medium rounded-lg text-sm px-5 py-2.5 shadow-lg transition transform hover:scale-105"
          >
            Create Account
          </button>
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
  
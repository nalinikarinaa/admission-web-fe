<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    async loginUser() {
      // Validasi input
      if (!this.email || !this.password) {
        Swal.fire({
          icon: 'warning',
          title: 'Form belum lengkap',
          text: 'Harap isi semua field terlebih dahulu!',
        });
        return;
      }

      this.loading = true;

      Swal.fire({
        title: 'Login...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Kirim request login
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL_API}/auth/login`,
          {
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        const { token, user, redirect, message } = response.data;

        // Simpan token di sessionStorage
        sessionStorage.setItem('access_token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Simpan user ke Vuex
        this.$store.commit('setUser', user);

        // Tampilkan sukses
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: message || 'Berhasil login',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.$router.push(redirect || '/dashboard');
        });

      } catch (error) {
        console.error("Login error:", error);

        let errorMessage = 'Terjadi kesalahan!';
        if (error.response) {
          const errors = error.response.data.errors;
          errorMessage = errors
            ? Object.values(errors).flat().join('\n')
            : error.response.data.message || errorMessage;
        }

        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: errorMessage,
        });

      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Restore token (jika ada)
    const token = sessionStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};
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
        <h2 class="text-center font-bold text-lg mb-6 text-ungutext">SIGN IN</h2>

        <form @submit.prevent="loginUser" class="space-y-4">
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
            class="text-white bg-pinktua hover:bg-ungu w-full font-medium rounded-lg text-sm border border-ungutext h-10 px-5 py-2.5 shadow-lg transition transform hover:scale-105"
          >
            SIGN IN
          </button>

          <div class="flex mt-2">
            <p>Don't have an account?</p>
            <RouterLink to="/createaccount">
              <p class="ml-2 text-pinktua transition-all duration-300 ease-in-out hover:text-ungu">
                Register now
              </p>
            </RouterLink>
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

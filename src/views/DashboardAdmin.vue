<script>
import UbahProfil from '@/components/UbahProfil.vue';
import { ref } from 'vue';
import Chart from 'chart.js/auto';
import HeaderAdmin from '@/components/HeaderAdmin.vue';
import axios from 'axios';

export default {
  components: {
    HeaderAdmin,
    UbahProfil,
  },
  data() {
    return {
      name: '',
      selectedYear: '',
      selectedMonth: '',
      years: [],
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      // Tambahan statistik
      kelasKosongTotal: 0,
      kelasAktifTotal: 0,
      pendaftarAktifTotal: 0,

      // Data untuk grafik
      chartLabels: [],
      chartKosong: [],
      chartAktif: [],
      chartPendaftar: [],


      kelasKosongList: [],
kelasAktifList: [],
pendaftarAktifList: [],
showModal: {
  kosong: false,
  aktif: false,
  pendaftar: false,
},

    };
  },
  mounted() {
    this.getUserName();
    this.initializeYears();
    this.fetchDashboardData();
    this.initializeChart();
  },
  methods: {
    async getUserName() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL_API}/profile`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
              Accept: 'application/json',
            },
          }
        );
        this.name = response.data.name;
      } catch (error) {
        console.error('Gagal mengambil nama user:', error);
      }
    },
    initializeYears() {
      const currentYear = new Date().getFullYear();
      const numYearsAgo = 10;
      this.years = Array.from({ length: numYearsAgo + 1 }, (_, i) => currentYear - i);
    },
    fetchDashboardData() {
      const config = {
        method: 'get',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/dashboard/statistik'
      };

      axios(config)
        .then(res => {
          this.kelasKosongTotal = res.data.kelas_kosong;
          this.kelasAktifTotal = res.data.kelas_aktif;
          this.pendaftarAktifTotal = res.data.pendaftar_aktif;
        })
        .catch(err => {
          console.error('Gagal mengambil data ringkas:', err);
        });
    },
    initializeChart() {
      const config = {
        method: 'get',
        url: import.meta.env.VITE_APP_BACKEND_URL_API + '/dashboard/statistik-tahunan'
      };

      axios(config)
        .then(res => {
          const data = res.data.data;

          this.chartLabels = data.map(item => item.tahun);
          this.chartKosong = data.map(item => item.kelas_kosong);
          this.chartAktif = data.map(item => item.kelas_aktif);
          this.chartPendaftar = data.map(item => item.pendaftar_aktif);

          const ctx = document.getElementById('prestasiChart');
          if (ctx) {
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: this.chartLabels,
                datasets: [
                  {
                    label: 'Pendaftar Aktif',
                    data: this.chartPendaftar,
                    backgroundColor: '#A55166',
                  },
                  {
                    label: 'Kelas Aktif',
                    data: this.chartAktif,
                    backgroundColor: '#DDAAB8',
                  },
                  {
                    label: 'Kelas Kosong',
                    data: this.chartKosong,
                    backgroundColor: '#6B7280'
                  }
                ]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }
            });
          }
        })
        .catch(error => {
          console.error('Gagal memuat data chart:', error);
        });
    },

      async showDetailKelasKosong() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_API}/dashboard/kelas-kosong`);
      this.kelasKosongList = res.data;
      this.showModal.kosong = true;
    } catch (err) {
      console.error('Gagal ambil kelas kosong', err);
    }
  },

  async showDetailKelasAktif() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_API}/dashboard/kelas-aktif`);
    this.kelasAktifList = res.data;
    this.showModal.aktif = true;
  } catch (err) {
    console.error('Gagal ambil kelas aktif', err);
  }
},

async showDetailPendaftarAktif() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_API}/dashboard/pendaftar-aktif`);
    this.pendaftarAktifList = res.data;
    this.showModal.pendaftar = true;
  } catch (err) {
    console.error('Gagal ambil pendaftar aktif', err);
  }
}


  }
};
</script>



<template>
    <HeaderAdmin />
  
    <div class="md:ml-12 ml-4 pt-10">
      <span class="md:text-2xl text-xl font-semibold mb-8 text-ungutext">Dashboard</span>
    </div>
    <hr class="bg-pinktua h-0.5 mt-1 border-none">
  
  
    <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 p-4 md:p-6">
      <UbahProfil/>
      <!-- Bagian Tagihan dan Produk -->
      <div class="flex-1">
        <div class="border rounded-lg p-4 mb-5 shadow-xl bg-ungu">
          <div class="flex justify-between items-center">
            <div class="ml-10">
              <p class="md:text-3xl text-base font-semibold text-ungutext">Welcome, {{ name || 'User' }}</p>
              <p class="md:text-xl text-xs text-pink">Let's make our weekend
                more productive!</p>
            </div>
            <div>
              <img src="../assets/img/dashboard.png" alt="dashboard" class="w-56 h-auto md:mr-20 mr-3 ">
            </div>
          </div>
        </div>
  
        <!-- konten -->
  
        <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" >
      <div class="bg-white shadow rounded-xl p-4 flex items-center space-x-4 hover:bg-ungutua" @click="showDetailPendaftarAktif">
        <div class="bg-pinktua text-white rounded-full p-2">
 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M4 20h5v-2a4 4 0 00-3-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
        </div>
        <div>
          <p class="text-sm text-ungutext">Pendaftar Aktif</p>
          <p class="text-xl font-semibold text-ungutext">{{ pendaftarAktifTotal }}</p>
        </div>
      </div>


      <div class="bg-white shadow rounded-xl p-4 flex items-center space-x-4 hover:bg-ungutua" @click="showDetailKelasAktif">
        <div class="bg-ungutua text-white rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m0 0H7m5 0h5" />
        </svg>
        </div>
        <div>
          <p class="text-sm text-ungutext">Kelas Aktif</p>
          <p class="text-xl font-semibold text-ungutext">{{ kelasAktifTotal }}</p>
        </div>
      </div>

      <div class="bg-white shadow rounded-xl p-4 flex items-center space-x-4 hover:bg-ungutua" @click="showDetailKelasKosong">
        <div class="bg-abuabu text-white rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7M4 8h16M10 12h4" />
        </svg>
        </div>
        <div>
          <p class="text-sm text-ungutext">Kelas Kosong</p>
          <p class="text-xl font-semibold text-ungutext">{{ kelasKosongTotal }}</p>    
        </div>
      </div>
    </div>


    <!-- statistik -->
    <div class="bg-white shadow rounded-xl p-6">
      <h2 class="text-lg font-semibold mb-4">Statistic Pendaftar</h2>
      <canvas id="prestasiChart"></canvas>
      <div class="flex justify-center gap-6 mt-4 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-pinktua rounded-full"></div>
          <span>Pendaftar Aktif</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-ungutua rounded-full"></div>
          <span>Kelas Aktif</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-abuabu rounded-full"></div>
          <span>Kelas Kosong</span>
        </div>
      </div>
    </div>
  </div>
  
        
  
      </div>
    </div>

    <div v-if="showModal.kosong" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Daftar Kelas Kosong</h2>
      <button @click="showModal.kosong = false">✕</button>
    </div>

    <table class="w-full text-sm text-left border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">No</th>
          <th class="p-2 border">Nama Kelas</th>
          <th class="p-2 border">Kuota</th>
          <th class="p-2 border">Kuota Terisi</th>
          <th class="p-2 border">Sisa Kuota</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(kelas, index) in kelasKosongList" :key="kelas.id">
          <td class="p-2 border">{{ index + 1 }}</td>
          <td class="p-2 border">{{ kelas.nama }}</td>
          <td class="p-2 border">{{ kelas.max_quota }}</td>
          <td class="p-2 border">{{ kelas.current_quota }}</td>
          <td class="p-2 border text-red-700">{{ kelas.max_quota - kelas.current_quota }}</td>

        </tr>
      </tbody>
    </table>
        <div class="text-sm text-ungutext">
      <span>*Kelas kosong = kelas yang belum memenuhi jumlah kuota maximum </span>
    </div>
  </div>
</div>


<div v-if="showModal.aktif" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Daftar Kelas Aktif</h2>
      <button @click="showModal.aktif = false">✕</button>
    </div>
    <table class="w-full text-sm text-left border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">No</th>
          <th class="p-2 border">Nama Kelas</th>
          <th class="p-2 border">Kuota</th>
          <th class="p-2 border">Kuota Terisi</th>
          <th class="p-2 border">Sisa Kuota</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(kelas, index) in kelasAktifList" :key="kelas.id">
          <td class="p-2 border">{{ index + 1 }}</td>
          <td class="p-2 border">{{ kelas.nama }}</td>
          <td class="p-2 border">{{ kelas.max_quota }}</td>
          <td class="p-2 border">{{ kelas.current_quota }}</td>
          <td class="p-2 border text-red-700">{{ kelas.max_quota - kelas.current_quota }}</td>
        </tr>
      </tbody>
    </table>
            <div class="text-sm text-ungutext">
      <span>*Kelas aktif = kelas yang memenuhi jumlah kuota maximum </span>
    </div>
  </div>
</div>

<div v-if="showModal.pendaftar" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Daftar Pendaftar Aktif</h2>
      <button @click="showModal.pendaftar = false">✕</button>
    </div>
    <table class="w-full text-sm text-left border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">No</th>
          <th class="p-2 border">Nama User</th>
          <th class="p-2 border">Kelas</th>
          <th class="p-2 border">Tanggal Daftar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in pendaftarAktifList" :key="user.id">
          <td class="p-2 border">{{ index + 1 }}</td>
          <td class="p-2 border">{{ user.nama_user }}</td>
          <td class="p-2 border">{{ user.nama_kelas }}</td>
          <td class="p-2 border">{{ user.tanggal_daftar }}</td>
        </tr>
      </tbody>
    </table>
            <div class="text-sm text-ungutext">
      <span>*Pendaftar Aktif = pendaftar yang telah terdaftar dalam kelas </span>
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
  
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "biru": '#E0FFFF',
        // pink tua = pink bgt
        "pinktua": '#A55166',
        // ungu = pink muda 
        "ungu": '#FFCBE3',
        // kuning = pink muda bgt 
        "kuning": '#F7DAE7',
        "pink": '#FFF5F9',
        "ungutua": '#DDAAB8',
        "ungutuabgt": '#272B44',
        "ungutext": '#5D69B4',
        "abuabu": '#6B7280',
      },
    
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    
    },
  },
  plugins: [],
};


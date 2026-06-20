/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#ABC270', // Verde Suave (Vacina em dia / Sucesso)
          yellow: '#FEC868', // Amarelo (Atenção / Próxima dose)
          orange: '#FDA769', // Laranja (Atrasada / Perigo / Destaques)
          brown: '#473C33', // Marrom Escuro (Contraste premium de texto)
          paper: '#FAF8F5', // Fundo papel natural acolhedor
          cream: '#EFE9DB', // Elementos de papelaria/argila tátil
          clay: '#D5CABD', // Divisores de páginas e bordas físicas
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        'squircle': '24px',
        'handdrawn': '255px 15px 225px 15px/15px 225px 15px 255px',
      }
    },
  },
  plugins: [],
}

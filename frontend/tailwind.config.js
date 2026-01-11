/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        btsHome: 'btsHome 300ms linear 1 forwards 360ms',
      },
      keyframes: {
        btsHome: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      fontFamily: {
        'pt-sans': ['PT Sans', 'sans-serif'],
      },
      colors: {
        'purple': '#822f6b',
        'purple-2': '#711a51',
        'orange': '#f95d2b',
        'orange-2': '#ff6b27',
        'orange-3': '#ff5b00',
        'green': '#9ee100',
        'green-2': '#b3e700',
        'yellow': '#cdeb5d',
        'yellow-2': '#f0ff92',
        'blue': '#08e4bc',
        'white': '#ffffff',
        'white-2': '#eeeeee',
        'white-3': '#dddddd',
        'light-gray': '#bbbbbb',
        'white-transparent': 'rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        'purple-gradient': `
          radial-gradient(circle at 100% 150%, #822f6b 24%, #702252 25%, #702252 28%, #822f6b 29%, #822f6b 36%, #702252 36%, #702252 40%, transparent 40%, transparent),
          radial-gradient(circle at 0 150%, #822f6b 24%, #702252 25%, #702252 28%, #822f6b 29%, #822f6b 36%, #702252 36%, #702252 40%, transparent 40%, transparent),
          radial-gradient(circle at 50% 100%, #702252 10%, #822f6b 11%, #822f6b 23%, #702252 24%, #702252 30%, #822f6b 31%, #822f6b 43%, #702252 44%, #702252 50%, #822f6b 51%, #822f6b 63%, #702252 64%, #702252 71%, transparent 71%, transparent),
          radial-gradient(circle at 100% 50%, #702252 5%, #822f6b 6%, #822f6b 15%, #702252 16%, #702252 20%, #822f6b 21%, #822f6b 30%, #702252 31%, #702252 35%, #822f6b 36%, #822f6b 45%, #702252 46%, #702252 49%, transparent 50%, transparent),
          radial-gradient(circle at 0 50%, #702252 5%, #822f6b 6%, #822f6b 15%, #702252 16%, #702252 20%, #822f6b 21%, #822f6b 30%, #702252 31%, #702252 35%, #822f6b 36%, #822f6b 45%, #702252 46%, #702252 49%, transparent 50%, transparent)
        `,
      },
      backgroundSize: {
        'default-size': '100px 50px',
      },
      borderRadius: {
        'game-border': '11px',
        'game-border-2': '7px',
        'inherit': "inherit",
      },
    },
  },
  plugins: [],
}


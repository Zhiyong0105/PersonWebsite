module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  
    daisyui: {
    themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
  },
  
  theme: {
    
    extend: {
      colors: {
        highlightStart: "#ff7eb3", // 渐变起始颜色
        highlightEnd: "#8a2be2", // 渐变结束颜色
      },
    },
  },
  
  plugins: [require('daisyui'),require("@tailwindcss/typography")],
}
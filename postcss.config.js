module.exports = {
  plugins: [
    require("@tailwindcss/postcss")(), // ✅ Esta es la nueva forma
    require("autoprefixer"),
  ],
};

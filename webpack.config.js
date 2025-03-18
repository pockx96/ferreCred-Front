const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Limpia dist/ en cada build
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    hot: true, // 🔥 Hot Module Replacement
    open: true,
    watchFiles: ['./src/**/*'], // Recarga si cambias algo en src/
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      dt: 'datatables.net'
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'], // tailwind + css
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: require.resolve('quagga'),
        use: [{
          loader: 'expose-loader',
          options: 'Quagga'
        }]
      },
      // Si quieres cargar PHP como raw
      // {
      //   test: /\.php$/,
      //   use: 'webpack-php-loader'
      // }
    ]
  },

  devtool: "eval-source-map",
};

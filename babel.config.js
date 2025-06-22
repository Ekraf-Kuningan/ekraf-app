// babel.config.js
module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'nativewind/babel',
  ],
  plugins: [
    'react-native-reanimated/plugin', // This must ALWAYS be the last plugin
  ],
  // Hapus sepenuhnya blok 'env' atau pastikan tidak mengganggu preset di atas
  // Jika Anda memiliki plugin lain yang hanya untuk test, letakkan di sini
  // env: {
  //   test: {
  //     plugins: [
  //       // Misalnya, plugin mocking atau lainnya
  //     ],
  //   },
  // },
};
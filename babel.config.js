module.exports = {
   presets: ['module:@react-native/babel-preset','nativewind/babel'],
   plugins: [
    // Pastikan ini adalah plugin terakhir
    'react-native-reanimated/plugin',
  ],
};

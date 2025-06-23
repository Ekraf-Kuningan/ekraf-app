// src/screens/Auth/Login.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';

// Impor fungsi login dari file api
import { loginUser } from '../../lib/api'; // <-- PASTIKAN PATH INI BENAR

// Impor komponen PopupTemplate
import PopupTemplate from '../../components/PopUpTemplate'; // <-- PASTIKAN PATH INI BENAR

export default function Login({ navigation }: { navigation: any }) {
  const { colorScheme } = useColorScheme();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // State untuk Popup (tidak berubah)
  const [popup, setPopup] = useState({
    visible: false,
    theme: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    onClose: () => {},
    buttonText: 'OK',
  });

  // Fungsi untuk menampilkan popup (tidak berubah)
  const showPopup = (
    theme: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    buttonText: string = 'Mengerti',
    onCloseAction = () => {}
  ) => {
    setPopup({
      visible: true,
      theme,
      title,
      message,
      buttonText,
      onClose: () => {
        setPopup(prev => ({ ...prev, visible: false }));
        onCloseAction();
      },
    });
  };

  // Fungsi handleLogin yang sudah disederhanakan
  const handleLogin = async () => {
    if (!email || !password) {
      showPopup('warning', 'Perhatian', 'Email dan Kata Sandi harus diisi.');
      return;
    }

    setLoading(true);
    try {
      // Panggil fungsi login dari lib/api.ts
      const { message } = await loginUser(email, password);

      showPopup(
        'success',
        'Login Berhasil',
        message || 'Anda akan diarahkan ke halaman utama.',
        'Lanjutkan',
        () => navigation.replace('NavigationBottom')
      );
    } catch (error: any) {
      // Tangkap error yang dilemparkan dari loginUser
      console.error('Login error:', error.message);
      showPopup('error', 'Login Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- JSX (Tampilan Visual) - Tidak Ada Perubahan ---
  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-zinc-900">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header Logo */}
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/images/LogoText.png')} // <-- PASTIKAN PATH INI BENAR
          className="w-64 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <View className="mb-8">
        <Text className="font-p-semibold text-3xl mb-2 text-zinc-900 dark:text-white">
          Selamat Datang
        </Text>
        <Text className="font-p-medium text-sm leading-5 text-gray-500 dark:text-gray-400">
          Mohon isi email dan kata sandi untuk melanjutkan
        </Text>
      </View>

      {/* Form Container */}
      <View className="w-full mb-5">
        {/* Email Input */}
        <Text className="font-p-medium text-sm mb-2 text-zinc-900 dark:text-white">Email</Text>
        <View className="flex-row items-center border rounded-lg mb-4 h-12 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
          <Icon name="mail-outline" size={22} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} className="ml-3" />
          <TextInput
            className="flex-1 px-3 text-sm font-p-regular text-zinc-900 dark:text-white"
            placeholder="Masukkan email disini"
            placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#9CA3AF'}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <Text className="font-p-medium text-sm mb-2 text-zinc-900 dark:text-white">Kata Sandi</Text>
        <View className="flex-row items-center border rounded-lg h-12 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
          <Icon name="lock-closed-outline" size={22} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} className="ml-3" />
          <TextInput
            className="flex-1 px-3 text-sm font-p-regular text-zinc-900 dark:text-white"
            placeholder="Masukkan kata sandi disini"
            placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#9CA3AF'}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} className="p-3">
            <Icon
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>

        {/* Lupa Kata Sandi */}
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} className="self-end mt-2 mb-5">
          <Text className="font-p-medium text-xs text-[#FFAA01]">Lupa Kata Sandi?</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Login */}
      <TouchableOpacity
        className="w-full items-center justify-center rounded-lg h-12 mb-8 bg-[#FFAA01] active:opacity-80"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="font-p-semibold text-white text-base">Masuk</Text>
        )}
      </TouchableOpacity>

      {/* Link ke Register */}
      <View className="flex-row justify-center items-center pb-5">
        <Text className="font-p-medium text-sm text-gray-700 dark:text-gray-300">
          Tidak punya akun?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="font-p-semibold text-sm text-[#FFAA01]">Daftar</Text>
        </TouchableOpacity>
      </View>

      {/* Komponen Pop Up */}
      <PopupTemplate
        visible={popup.visible}
        onClose={popup.onClose}
        theme={popup.theme}
        title={popup.title}
        message={popup.message}
        buttonText={popup.buttonText}
        customIcon={undefined}
        customLogo={undefined}
      />
    </View>
  );
}

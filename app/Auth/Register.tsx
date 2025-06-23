// src/screens/Auth/Register.tsx

import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

// Impor fungsi dan tipe dari file api.ts
import { registerUser, fetchBusinessCategories } from '../../lib/api'; // <-- PASTIKAN PATH INI BENAR
import { CustomPicker } from '../../components/CustomPicker';
import { useTheme } from '../Context/ThemeContext';
import { BusinessCategory, RegistrationData } from '../../lib/types';


// --- KOMPONEN UTAMA REGISTER ---
export default function Register({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
  // --- STATES ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nama_user, setNamaUser] = useState('');
  const [jk, setJk] = useState<'Laki-laki' | 'Perempuan' | null>(null);
  const [nohp, setNohp] = useState('');
  const [nama_usaha, setNamaUsaha] = useState('');
  const [status_usaha, setStatusUsaha] = useState<'BARU' | 'SUDAH_LAMA' | null>(null);
  const [id_kategori_usaha, setIdKategoriUsaha] = useState<number | null>(null);

  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    // Fungsi async didefinisikan di dalam useEffect
    const loadCategories = async () => {
      try {
        const categories = await fetchBusinessCategories();
        setBusinessCategories(categories);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  // --- HANDLERS ---
  const handleRegister = async () => {
    // Validasi input tetap di komponen karena ini adalah bagian dari logika UI
    if (!username.trim() || !email.trim() || !password || !confirmPassword || !nama_user.trim() || !nohp.trim() || !nama_usaha.trim() || id_kategori_usaha === null || !jk || !status_usaha) {
      Alert.alert('Data Tidak Lengkap', 'Harap isi semua kolom yang wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Format Email Salah', 'Harap masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);

    // Siapkan data sesuai interface RegistrationData
    const registrationData: RegistrationData = {
      nama_user,
      username,
      email,
      password,
      jk,
      nohp,
      nama_usaha,
      status_usaha,
      id_kategori_usaha: String(id_kategori_usaha), // Konversi ke string sesuai kebutuhan API
    };

    try {
      // Panggil fungsi registerUser dari api.ts
      const response = await registerUser(registrationData);
      Alert.alert('Pendaftaran Berhasil', response.message);
      navigation.navigate('Login');
    } catch (error: any) {
      // Tangkap error yang sudah bersih dari api.ts
      Alert.alert('Pendaftaran Gagal', error.message);
      console.error('Registration error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STYLING CONSTANTS (Tidak Berubah) ---
  const iconColor = isDark ? '#FFFFFF' : '#757575';
  const buttonBackgroundColor = 'bg-[#FFAA01]';
  const linkTextColor = 'text-[#FFAA01]';
  const placeholderTextColorValue = isDark ? '#A9A9A9' : '#A0A0A0';
  const inputBorderColor = isDark ? 'border-neutral-600' : 'border-gray-400';
  const inputBackgroundColor = isDark ? 'bg-neutral-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const labelColor = isDark ? 'text-gray-200' : 'text-gray-700';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const subtleBackgroundColor = isDark ? 'bg-neutral-900' : 'bg-white';


  // --- RENDER (JSX tidak berubah, hanya picker kategori yang disesuaikan untuk loading) ---
  return (
    <SafeAreaView className={`flex-1 ${subtleBackgroundColor}`}>
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        className="px-6 pt-5 pb-8"
      >
        <View className="pt-12">
          <View className="items-center mt-6 mb-2">
            <Image
              source={require('../../assets/images/LogoText.png')} // <-- PASTIKAN PATH INI BENAR
              className="w-64 h-20 mb-3"
              resizeMode="contain"
            />
          </View>
          <Text className={`text-3xl mb-2 font-poppins-bold text-center ${textColor}`}>
            Buat Akun Baru
          </Text>
          <Text className={`text-base font-poppins-medium text-center mb-8 ${subtitleColor}`}>
            Isi data di bawah ini untuk melanjutkan.
          </Text>

          {/* === FORM INPUTS (TIDAK BERUBAH) === */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Username</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="person-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Masukkan username" placeholderTextColor={placeholderTextColorValue} value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>

          {/* ... semua TextInput lainnya tidak berubah ... */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Email</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="mail-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Masukkan email" placeholderTextColor={placeholderTextColorValue} keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Kata Sandi</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="lock-closed-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Masukkan kata sandi" placeholderTextColor={placeholderTextColorValue} secureTextEntry={!isPasswordVisible} value={password} onChangeText={setPassword} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-2">
              <Icon name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Konfirmasi Kata Sandi</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="lock-closed-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Konfirmasi kata sandi Anda" placeholderTextColor={placeholderTextColorValue} secureTextEntry={!isConfirmPasswordVisible} value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="p-2">
              <Icon name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nama Lengkap</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="person-circle-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Masukkan nama lengkap Anda" placeholderTextColor={placeholderTextColorValue} value={nama_user} onChangeText={setNamaUser} autoCapitalize="words" />
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nomor HP</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="call-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Contoh: 08123456789" placeholderTextColor={placeholderTextColorValue} value={nohp} onChangeText={setNohp} keyboardType="phone-pad" />
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nama Usaha</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="business-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Masukkan nama usaha Anda" placeholderTextColor={placeholderTextColorValue} value={nama_usaha} onChangeText={setNamaUsaha} autoCapitalize="words" />
          </View>

          {/* === CUSTOM PICKERS (TIDAK BERUBAH) === */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Jenis Kelamin</Text>
          <CustomPicker
            items={[
              { label: 'Laki-laki', value: 'Laki-laki' },
              { label: 'Perempuan', value: 'Perempuan' },
            ]}
            selectedValue={jk}
            onValueChange={setJk}
            placeholder="Pilih Jenis Kelamin"
            isDarkMode={isDark}
            iconColor={iconColor}
            inputBorderColor={inputBorderColor}
            inputBackgroundColor={inputBackgroundColor}
            textColor={textColor}
            placeholderTextColorValue={placeholderTextColorValue}
          />

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Status Usaha</Text>
          <CustomPicker
            items={[
              { label: 'Usaha Baru', value: 'BARU' },
              { label: 'Sudah Berjalan Lama', value: 'SUDAH_LAMA' },
            ]}
            selectedValue={status_usaha}
            onValueChange={setStatusUsaha}
            placeholder="Pilih Status Usaha"
            isDarkMode={isDark}
            iconColor={iconColor}
            inputBorderColor={inputBorderColor}
            inputBackgroundColor={inputBackgroundColor}
            textColor={textColor}
            placeholderTextColorValue={placeholderTextColorValue}
          />

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Kategori Usaha</Text>
          <CustomPicker
            items={businessCategories.map(category => ({
              label: category.nama_kategori,
              value: category.id_kategori_usaha,
            }))}
            selectedValue={id_kategori_usaha}
            onValueChange={setIdKategoriUsaha}
            placeholder={isLoadingCategories ? 'Memuat kategori...' : 'Pilih Kategori Usaha'}
            isDarkMode={isDark}
            iconColor={iconColor}
            inputBorderColor={inputBorderColor}
            inputBackgroundColor={inputBackgroundColor}
            textColor={textColor}
            placeholderTextColorValue={placeholderTextColorValue}
          />

          {/* === TOMBOL DAFTAR (TIDAK BERUBAH) === */}
          <TouchableOpacity onPress={handleRegister} disabled={isLoading || isLoadingCategories} className={`${buttonBackgroundColor} py-4 rounded-lg items-center mt-5 mb-4`}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-poppins-bold">Daftar</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4 mb-8">
            <Text className={`text-base font-poppins-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className={`text-base font-poppins-bold ${linkTextColor}`}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

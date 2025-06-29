// src/screens/Auth/Register.tsx

// Alert dihapus dari import react-native
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import { authApi, masterDataApi } from '../../lib/api';
import { KategoriUsaha, RegistrationData } from '../../lib/types';
import { CustomPicker } from '../../components/CustomPicker'; // Pastikan path benar
import PopupTemplate from '../../components/PopUpTemplate'; // <-- Impor PopupTemplate
import { useTheme } from '../Context/ThemeContext';

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

  const [businessCategories, setBusinessCategories] = useState<KategoriUsaha[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // --- STATE & HELPER UNTUK POPUP (BARU) ---
  const [popup, setPopup] = useState({
    visible: false,
    theme: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    onClose: () => { },
    buttonText: 'OK',
  });

  const showPopup = (
    theme: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    buttonText: string = 'Mengerti',
    onCloseAction = () => { }
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

  // --- EFFECTS ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await masterDataApi.getBusinessCategories();
        setBusinessCategories(categories);
      } catch (error: any) {
        // Mengganti Alert dengan Popup
        showPopup('error', 'Gagal Memuat Data', error.message);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // --- HANDLERS ---
  const handleRegister = async () => {
    // Validasi input diganti dengan Popup
    if (!username.trim() || !email.trim() || !password || !confirmPassword || !nama_user.trim() || !nohp.trim() || !jk || !status_usaha || id_kategori_usaha === null) {
      showPopup('warning', 'Data Tidak Lengkap', 'Harap isi semua kolom yang wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      showPopup('error', 'Kata Sandi Tidak Cocok', 'Kata sandi dan konfirmasi kata sandi tidak sama.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPopup('warning', 'Format Email Salah', 'Harap masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);

    const registrationData: RegistrationData = {
      nama_user,
      username,
      email,
      password,
      jk: jk!,
      nohp,
      nama_usaha,
      status_usaha: status_usaha!,
      id_kategori_usaha: String(id_kategori_usaha),
    };

    try {
      const response = await authApi.register(registrationData);
      // Mengganti Alert sukses dengan Popup dan navigasi di onClose
      showPopup(
        'success',
        'Silahkan cek email untuk verifikasi',
        response.message,
        'Buka Gmail',
        () => {
          // Buka aplikasi Gmail jika tersedia, lalu navigasi ke Login
          import('react-native').then(({ Linking }) => {
            Linking.openURL('https://gmail.app.goo.gl');
            navigation.navigate('Login');
          });
        }
      );
    } catch (error: any) {
      // Mengganti Alert gagal dengan Popup
      showPopup('error', 'Pendaftaran Gagal', error.message);
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


  // --- RENDER ---
  return (
    <SafeAreaView className={`flex-1 ${subtleBackgroundColor}`}>
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <View className="pt-12">
          {/* ... (Konten Form dan Teks tidak berubah) ... */}
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

          {/* === FORM INPUTS (Tidak ada perubahan) === */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Username</Text>
          <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name="person-outline" color={iconColor} size={24} />
            <TextInput className={`flex-1 ml-2 text-base ${textColor}`} placeholder="Masukkan username" placeholderTextColor={placeholderTextColorValue} value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>

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

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Jenis Kelamin</Text>
          <CustomPicker
            items={[{ label: 'Laki-laki', value: 'Laki-laki' }, { label: 'Perempuan', value: 'Perempuan' }]}
            selectedValue={jk}
            onValueChange={setJk}
            placeholder="Pilih Jenis Kelamin"
          />

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Status Usaha</Text>
          <CustomPicker
            items={[{ label: 'Usaha Baru', value: 'BARU' }, { label: 'Sudah Berjalan Lama', value: 'SUDAH_LAMA' }]}
            selectedValue={status_usaha}
            onValueChange={setStatusUsaha}
            placeholder="Pilih Status Usaha"
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
            disabled={isLoadingCategories}
          />

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

      {/* Komponen Pop Up yang akan ditampilkan di atas segalanya */}
      <PopupTemplate
        visible={popup.visible}
        onClose={popup.onClose}
        theme={popup.theme}
        title={popup.title}
        message={popup.message}
        buttonText={popup.buttonText}
      />
    </SafeAreaView>
  );
}

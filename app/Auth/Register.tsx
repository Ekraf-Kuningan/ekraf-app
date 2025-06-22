import { Text, View, TextInput, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { CustomPicker } from '../../components/CustomPicker';

// --- INTERFACE ---
interface BusinessCategory {
  id_kategori_usaha: number;
  nama_kategori: string;
}





// --- KOMPONEN UTAMA REGISTER ---
export default function Register({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    const fetchBusinessCategories = async () => {
      try {
        const response = await axios.get('https://ekraf.asepharyana.tech/api/master-data/business-categories');
        if (response.data && response.data.data) {
          setBusinessCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch business categories:', error);
        Alert.alert('Error', 'Gagal memuat kategori usaha. Silakan coba lagi nanti.');
      }
    };

    fetchBusinessCategories();
  }, []);

  // --- STYLING CONSTANTS ---
  const iconColor = isDarkMode ? '#FFFFFF' : '#757575';
  const buttonBackgroundColor = 'bg-[#FFAA01]';
  const linkTextColor = 'text-[#FFAA01]';
  const placeholderTextColorValue = isDarkMode ? '#A9A9A9' : '#A0A0A0';
  const inputBorderColor = isDarkMode ? 'border-neutral-600' : 'border-gray-400';
  const inputBackgroundColor = isDarkMode ? 'bg-neutral-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const labelColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const subtitleColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const subtleBackgroundColor = isDarkMode ? 'bg-neutral-900' : 'bg-white';

  // --- HANDLERS ---
  const handleRegister = async () => {
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

    const registrationData = {
      nama_user,
      username,
      email,
      password,
      jk,
      nohp,
      nama_usaha,
      status_usaha,
      id_kategori_usaha: String(id_kategori_usaha),
    };

    try {
      const response = await axios.post('https://ekraf.asepharyana.tech/api/auth/register/umkm', registrationData, {
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
      });
      if (response.data.success) {
        Alert.alert('Pendaftaran Berhasil', response.data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Pendaftaran Gagal', response.data.message || 'Terjadi kesalahan yang tidak diketahui.');
      }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.';
        Alert.alert('Pendaftaran Gagal', errorMessage);
        console.error('Registration error:', error.response?.data || error.message);
    } finally {
        setIsLoading(false);
    }
  };

  // --- RENDER ---
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
              source={require('../../assets/images/LogoText.png')}
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

          {/* === FORM INPUTS === */}
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

          {/* === CUSTOM PICKERS === */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Jenis Kelamin</Text>
          <CustomPicker
              items={[
                  { label: 'Laki-laki', value: 'Laki-laki' },
                  { label: 'Perempuan', value: 'Perempuan' },
              ]}
              selectedValue={jk}
              onValueChange={setJk}
              placeholder="Pilih Jenis Kelamin"
              isDarkMode={isDarkMode}
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
              isDarkMode={isDarkMode}
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
              placeholder="Pilih Kategori Usaha"
              isDarkMode={isDarkMode}
              iconColor={iconColor}
              inputBorderColor={inputBorderColor}
              inputBackgroundColor={inputBackgroundColor}
              textColor={textColor}
              placeholderTextColorValue={placeholderTextColorValue}
          />

          <TouchableOpacity onPress={handleRegister} disabled={isLoading} className={`${buttonBackgroundColor} py-4 rounded-lg items-center mt-5 mb-4`}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-poppins-bold">Daftar</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4 mb-8">
              <Text className={`text-base font-poppins-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className={`text-base font-poppins-bold ${linkTextColor}`}>Masuk</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


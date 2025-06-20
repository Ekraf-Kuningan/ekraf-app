import { Text, View, TextInput, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Definisikan tipe untuk kategori usaha
interface BusinessCategory {
  id_kategori_usaha: number;
  nama_kategori: string;
}

export default function Register({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // State untuk manajemen langkah form
  const [step, setStep] = useState(1);

  // State untuk Langkah 1
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State untuk Langkah 2
  const [nama_user, setNamaUser] = useState('');
  const [jk, setJk] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [nohp, setNohp] = useState('');
  const [nama_usaha, setNamaUsaha] = useState('');
  const [status_usaha, setStatusUsaha] = useState<'BARU' | 'SUDAH_LAMA'>('BARU');
  const [id_kategori_usaha, setIdKategoriUsaha] = useState<number | null>(null);

  // State untuk data dari API dan UI
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Fetch Business Categories dari API saat komponen dimuat
  useEffect(() => {
    const fetchBusinessCategories = async () => {
      try {
        const response = await axios.get('https://ekraf.asepharyana.tech/api/master-data/business-categories');
        if (response.data && response.data.data) {
          setBusinessCategories(response.data.data);
          // Set nilai default untuk picker kategori
          if (response.data.data.length > 0) {
            setIdKategoriUsaha(response.data.data[0].id_kategori_usaha);
          }
        }
      } catch (error) {
        console.error("Failed to fetch business categories:", error);
        Alert.alert('Error', 'Gagal memuat kategori usaha. Silakan coba lagi nanti.');
      }
    };

    fetchBusinessCategories();
  }, []);

  // Styling dinamis berdasarkan color scheme
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
  const pickerStyle = {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    color: isDarkMode ? '#FFFFFF' : '#000000',
  };


  const handleNextStep = () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Data Tidak Lengkap', 'Harap isi semua kolom pada langkah ini.');
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
    setStep(2); // Pindah ke langkah berikutnya
  };

  const handleRegister = async () => {
     if (!nama_user.trim() || !nohp.trim() || !nama_usaha.trim() || !id_kategori_usaha) {
        Alert.alert('Data Tidak Lengkap', 'Harap isi semua kolom pada langkah ini.');
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
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
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

  const renderStepOne = () => (
    <>
      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Username</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='person-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Masukkan username"
          placeholderTextColor={placeholderTextColorValue}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Email</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='mail-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Masukkan email"
          placeholderTextColor={placeholderTextColorValue}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Kata Sandi</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='lock-closed-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Masukkan kata sandi"
          placeholderTextColor={placeholderTextColorValue}
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-2">
          <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Konfirmasi Kata Sandi</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='lock-closed-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Konfirmasi kata sandi Anda"
          placeholderTextColor={placeholderTextColorValue}
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="p-2">
          <Icon name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleNextStep} className={`${buttonBackgroundColor} py-4 rounded-lg items-center mt-5 mb-6`}>
        <Text className="text-white text-lg font-poppins-bold">Selanjutnya</Text>
      </TouchableOpacity>
    </>
  );

  const renderStepTwo = () => (
    <>
      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nama Lengkap</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='person-circle-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Masukkan nama lengkap Anda"
          placeholderTextColor={placeholderTextColorValue}
          value={nama_user}
          onChangeText={setNamaUser}
          autoCapitalize="words"
        />
      </View>
      
      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nomor HP</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='call-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Contoh: 08123456789"
          placeholderTextColor={placeholderTextColorValue}
          value={nohp}
          onChangeText={setNohp}
          keyboardType="phone-pad"
        />
      </View>
      
      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nama Usaha</Text>
      <View className={`flex-row items-center border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
        <Icon name='business-outline' color={iconColor} size={24} />
        <TextInput
          className={`flex-1 ml-2 text-base ${textColor}`}
          placeholder="Masukkan nama usaha Anda"
          placeholderTextColor={placeholderTextColorValue}
          value={nama_usaha}
          onChangeText={setNamaUsaha}
          autoCapitalize="words"
        />
      </View>

      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Jenis Kelamin</Text>
      <View className={`border rounded-lg mb-4 ${inputBorderColor}`} style={{backgroundColor: pickerStyle.backgroundColor}}>
          <Picker selectedValue={jk} onValueChange={(itemValue) => setJk(itemValue)} dropdownIconColor={iconColor} style={{color: pickerStyle.color}}>
              <Picker.Item label="Laki-laki" value="Laki-laki" />
              <Picker.Item label="Perempuan" value="Perempuan" />
          </Picker>
      </View>

      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Status Usaha</Text>
      <View className={`border rounded-lg mb-4 ${inputBorderColor}`} style={{backgroundColor: pickerStyle.backgroundColor}}>
          <Picker selectedValue={status_usaha} onValueChange={(itemValue) => setStatusUsaha(itemValue)} dropdownIconColor={iconColor} style={{color: pickerStyle.color}}>
              <Picker.Item label="Usaha Baru" value="BARU" />
              <Picker.Item label="Sudah Berjalan Lama" value="SUDAH_LAMA" />
          </Picker>
      </View>
      
      <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Kategori Usaha</Text>
      <View className={`border rounded-lg mb-5 ${inputBorderColor}`} style={{backgroundColor: pickerStyle.backgroundColor}}>
        <Picker selectedValue={id_kategori_usaha} onValueChange={(itemValue) => setIdKategoriUsaha(itemValue)} dropdownIconColor={iconColor} style={{color: pickerStyle.color}}>
            {businessCategories.map(category => (
                <Picker.Item key={category.id_kategori_usaha} label={category.nama_kategori} value={category.id_kategori_usaha} />
            ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={handleRegister} disabled={isLoading} className={`${buttonBackgroundColor} py-4 rounded-lg items-center mt-5 mb-4`}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white text-lg font-poppins-bold">Daftar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setStep(1)} disabled={isLoading} className="py-2 rounded-lg items-center mb-6">
        <Text className={`text-lg font-poppins-medium ${linkTextColor}`}>Kembali</Text>
      </TouchableOpacity>
    </>
  );

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
            {step === 1 ? 'Buat Akun Anda' : 'Lengkapi Profil'}
          </Text>
          <Text className={`text-base font-poppins-medium text-center mb-8 ${subtitleColor}`}>
            {step === 1 ? 'Langkah 1 dari 2: Informasi Akun' : 'Langkah 2 dari 2: Informasi Usaha'}
          </Text>

          {step === 1 ? renderStepOne() : renderStepTwo()}

          {step === 1 && (
             <View className="flex-row justify-center items-center mt-4">
               <Text className={`text-base font-poppins-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sudah punya akun? </Text>
               <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                 <Text className={`text-base font-poppins-bold ${linkTextColor}`}>Masuk</Text>
               </TouchableOpacity>
             </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
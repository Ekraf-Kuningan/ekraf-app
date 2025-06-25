import { Text, View, TextInput, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function Register({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [namaUser, setNamaUser] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jk, setJk] = useState('Laki-laki');
  const [noHp, setNoHp] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const iconColor = isDarkMode ? '#FFFFFF' : '#757575';
  const buttonBackgroundColor = 'bg-[#FFAA01]';
  const linkTextColor = isDarkMode ? 'text-[#FFAA01]' : 'text-[#FFAA01]';

  const placeholderTextColorValue = isDarkMode ? '#A9A9A9' : '#A0A0A0';

  const inputBorderColor = isDarkMode ? 'border-neutral-600' : 'border-gray-400';
  const inputBackgroundColor = isDarkMode ? 'bg-neutral-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const labelColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const subtitleColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const subtleBackgroundColor = isDarkMode ? 'bg-neutral-900' : 'bg-white';
  const modalBackgroundColor = isDarkMode ? 'bg-neutral-800' : 'bg-white';


  const getGenderIcon = () => {
    if (jk === 'Laki-laki') {
      return 'male-outline';
    } else if (jk === 'Perempuan') {
      return 'female-outline';
    }
    return 'transgender-outline';
  };

  const handleRegister = async () => {
    if (!namaUser || !username || !email || !password || !confirmPassword || !jk || !noHp) {
      Alert.alert('Error', 'Semua field harus diisi.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://ekraf.asepharyana.tech/api/auth/register/umkm', {
        nama_user: namaUser,
        username: username,
        email: email,
        password: password,
        jk: jk,
        nohp: noHp,
      });

      if (response.data.success) {
        Alert.alert('Sukses', response.data.message || 'Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Pendaftaran Gagal', response.data.message || 'Terjadi kesalahan saat pendaftaran.');
      }
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      Alert.alert(
        'Pendaftaran Gagal',
        error.response?.data?.message || 'Tidak dapat terhubung ke server atau terjadi kesalahan.'
      );
    } finally {
      setLoading(false);
    }
  };

  const GenderPickerModal = () => (
    <Modal
        transparent={true}
        visible={isGenderModalVisible}
        animationType="fade"
        onRequestClose={() => setIsGenderModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setIsGenderModalVisible(false)}
        >
          <View className={`w-4/5 max-w-sm rounded-xl p-5 ${modalBackgroundColor}`}>
            <Text className={`text-lg font-poppins-bold mb-5 ${textColor}`}>Pilih Jenis Kelamin</Text>
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setJk('Laki-laki'); // gunakan strip, bukan underscore
                setIsGenderModalVisible(false);
              }}
            >
              <Text className={`text-base ${textColor}`}>Laki-laki</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setJk('Perempuan');
                setIsGenderModalVisible(false);
              }}
            >
              <Text className={`text-base ${textColor}`}>Perempuan</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
  );

  return (
    <SafeAreaView className={`flex-1 ${subtleBackgroundColor}`}>
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        className="px-6 pt-5 pb-8"
      >
        <View className="pt-2">

          <View className="items-center mt-6 mb-2">
            <Image
              source={require('../../assets/images/LogoText.png')}
              className="w-72 h-249 mb-3"
              resizeMode="contain"
            />
          </View>

          <Text className={`text-3xl mb-2 font-poppins-bold text-center ${textColor}`}>
            Daftar Akun
          </Text>
          <Text className={`text-base font-poppins-medium text-center mb-8 ${subtitleColor}`}>
            Silakan buat akun untuk mengakses aplikasi ini
          </Text>

          {/* Form Fields */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nama Lengkap</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name='person-outline' color={iconColor} size={24} className='mr-2'/>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan nama lengkap disini"
              placeholderTextColor={placeholderTextColorValue}
              value={namaUser}
              onChangeText={setNamaUser}
              autoCapitalize="words"
            />
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Username</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name='person-outline' color={iconColor} size={24} className='mr-2'/>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan username disini"
              placeholderTextColor={placeholderTextColorValue}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Email</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name='mail-outline' color={iconColor} size={24} className='mr-2'/>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan email disini"
              placeholderTextColor={placeholderTextColorValue}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Jenis Kelamin</Text>
          <TouchableOpacity
            className={`flex-row items-center border rounded-lg h-14 mb-4 px-4 ${inputBorderColor} ${inputBackgroundColor}`}
            onPress={() => setIsGenderModalVisible(true)}
          >
            <Icon name={getGenderIcon()} color={iconColor} size={24} className='mr-2'/>
            <Text className={`flex-1 text-base ${textColor}`}>
              {jk.replace('_', '-')}
            </Text>
            <Icon name="chevron-down" size={24} color="gray" />
          </TouchableOpacity>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Nomor HP</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name='call-outline' color={iconColor} size={24} className='mr-2'/>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan nomor HP disini"
              placeholderTextColor={placeholderTextColorValue}
              keyboardType="phone-pad"
              value={noHp}
              onChangeText={setNoHp}
            />
          </View>

          {/* Password Fields */}
          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Kata Sandi</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name='lock-closed-outline' color={iconColor} size={24} className='mr-2'/>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan kata sandi disini"
              placeholderTextColor={placeholderTextColorValue}
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="p-2"
            >
              <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <Text className={`text-sm font-poppins-medium mb-1 ml-1 ${labelColor}`}>Konfirmasi Kata Sandi</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor}`}>
            <Icon name='lock-closed-outline' color={iconColor} size={24} className='mr-2'/>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan kata sandi disini"
              placeholderTextColor={placeholderTextColorValue}
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              className="p-2"
            >
              <Icon name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`${buttonBackgroundColor} py-4 rounded-lg items-center mt-5 mb-6`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-poppins-bold">Selanjutnya</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className={`text-lg font-poppins-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className={`text-lg font-poppins-bold ${linkTextColor}`}>Masuk</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
      <GenderPickerModal />
    </SafeAreaView>
  );
}
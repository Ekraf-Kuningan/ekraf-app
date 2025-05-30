import { Text, View, TextInput, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Register({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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


  return (
    <SafeAreaView className={`flex-1 ${subtleBackgroundColor}`}>
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        className="px-6 pt-5 pb-8"
      >
        <View className="pt-24">

          <View className="items-center mt-6 mb-2">
            <Image
              source={require('../../assets/images/LogoText.png')}
              className="w-72 h-249 mb-3"
              resizeMode="contain"
            />
          </View>

          <Text className={`text-3xl font-bold mb-2 text-center ${textColor}`}>
            Daftar Akun
          </Text>
          <Text className={`text-base text-center mb-8 ${subtitleColor}`}>
            Silakan buat akun untuk mengakses aplikasi ini
          </Text>

          <Text className={`text-sm font-medium mb-1 ml-1 ${labelColor}`}>Username</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
            <TextInput
              className={`flex-1 text-base ${textColor}`}
              placeholder="Masukkan username disini"
              placeholderTextColor={placeholderTextColorValue}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <Text className={`text-sm font-medium mb-1 ml-1 ${labelColor}`}>Email</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
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

          <Text className={`text-sm font-medium mb-1 ml-1 ${labelColor}`}>Kata Sandi</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}>
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

          <Text className={`text-sm font-medium mb-1 ml-1 ${labelColor}`}>Konfirmasi Kata Sandi</Text>
          <View className={`flex-row items-center border rounded-lg px-4 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor}`}>
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

          <TouchableOpacity className={`${buttonBackgroundColor} py-4 rounded-lg items-center mt-5 mb-6`}>
            <Text className="text-white text-lg font-semibold">Selanjutnya</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className={`text-lg font-semibold ${linkTextColor}`}>Masuk</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
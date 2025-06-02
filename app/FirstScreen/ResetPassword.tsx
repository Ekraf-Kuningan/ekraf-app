import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white pt-2">
      <StatusBar barStyle="dark-content" />
      <View className="p-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8 self-start">
        <Icon name="arrow-back-outline" size={28} color="#374151" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Reset Password
        </Text>
        <Text className="text-sm text-gray-500 mb-10 text-center">
          Password baru akan dikirimkan melalui email yang telah didaftarkan
        </Text>

        <Text className="text-sm text-gray-700 mb-1 ml-1">
          Email
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-8 text-base"
          placeholder="Masukkan email disini"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="bg-yellow-500 rounded-lg py-4"
          onPress={() => console.log('Kirim email ke:', email)}
        >
          <Text className="text-white text-center font-semibold text-base">
            Kirim
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
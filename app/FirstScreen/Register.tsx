import { Text, View, TextInput, TouchableOpacity, useColorScheme, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';


export default function Register() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const placeholderTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const iconColor = isDarkMode ? '#FFFFFF' : '#757575';
  const buttonBackgroundColor = 'bg-[#FFAA01]';
  const linkTextColor = isDarkMode ? 'text-orange-400' : 'text-orange-600';

  const inputBorderColor = isDarkMode ? 'border-neutral-600' : 'border-black';
  const inputBackgroundColor = isDarkMode ? 'bg-neutral-800' : 'bg-white';
  const shadowClass = 'shadow-md';

  const placeholderTextColorValue = isDarkMode ? '#A9A9A9' : '#A0A0A0';
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
      <ScrollView
        contentContainerClassName="flex-grow justify-center"
        keyboardShouldPersistTaps="handled"
        className="px-7 py-5"
      >
        <View>


          <View className="flex-row items-center justify-center mb-16 mt-3">
            <Image
              source={require('../../assets/images/ekraf.png')}
              className="w-20 h-20 mr-4"
              resizeMode="contain"
            />

            <View>
              <Text className={`text-2xl font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-black'}`}>
                EKONOMI KREATIF
              </Text>
              <Text className={`text-2xl font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-black'}`}>
                KUNINGAN
              </Text>
            </View>
          </View>


          <Text className={`text-3xl font-bold mb-7 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Register
          </Text>


          <View className={`flex-row items-center border-2 rounded-xl px-4 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor} ${shadowClass}`}>
            <Icon name="person-outline" size={22} color={iconColor} className="mr-3" />
            <TextInput
              className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
              placeholder="Username"
              placeholderTextColor={isDarkMode ? '#A9A9A9' : '#A0A0A0'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>


          <View className={`flex-row items-center border-2 rounded-xl px-4 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor} ${shadowClass}`}>
            <Icon name="mail-outline" size={22} color={iconColor} className="mr-3" />
            <TextInput
              className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
              placeholder="Email address"
              placeholderTextColor={isDarkMode ? '#A9A9A9' : '#A0A0A0'}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>


          <View className={`flex-row items-center border-2 rounded-xl px-4 h-14 mb-5 ${inputBorderColor} ${inputBackgroundColor} ${shadowClass}`}>
            <Icon name="lock-closed-outline" size={22} color={iconColor} className="mr-3" />
            <TextInput
              className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
              placeholder="Password"
              placeholderTextColor={isDarkMode ? '#A9A9A9' : '#A0A0A0'}
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


          <View className={`flex-row items-center border-2 rounded-xl px-4 h-14 mb-6 ${inputBorderColor} ${inputBackgroundColor} ${shadowClass}`}>
            <Icon name="lock-closed-outline" size={22} color={iconColor} className="mr-3" />
            <TextInput
              className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
              placeholder="Confirm password"
              placeholderTextColor={isDarkMode ? '#A9A9A9' : '#A0A0A0'}
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


          <TouchableOpacity className={`${buttonBackgroundColor} py-4 rounded-xl items-center mt-5 mb-6 shadow-md`}>
            <Text className="text-white text-lg font-bold">Create Account</Text>
          </TouchableOpacity>


          <View className="flex-row justify-center items-center mt-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Already have an account? </Text>
            <TouchableOpacity onPress={() => console.log('Navigate to Login')}>
              <Text className={`text-lg font-bold ${linkTextColor}`}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
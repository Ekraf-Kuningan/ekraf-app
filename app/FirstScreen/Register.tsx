import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, useColorScheme, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
// For the eye icon, you might want to use an icon library like react-native-vector-icons
// For simplicity, I'll use a text character here.
// import Icon from 'react-native-vector-icons/Ionicons';

export default function Register() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const inputStyle = [
    styles.input,
    isDarkMode ? styles.darkInput : styles.lightInput,
    isDarkMode ? styles.darkText : styles.lightText // For input text color
  ];
  const placeholderTextColor = isDarkMode ? '#A9A9A9' : '#888888';

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.container, containerStyle]}>

          <View style={styles.header}>
            <Image
              source={require('../../assets/images/LogoText.png')}
              style={styles.logo}
            />
            <Text style={[styles.title, textStyle, styles.titleText]}>
              Ekonomi Kreatif Kuningan
            </Text>
          </View>

          <Text style={[styles.mainTitle, textStyle]}>Daftar Akun</Text>
          <Text style={[styles.subtitle, textStyle, styles.subtitleText]}>
            Silakan buat akun untuk mengakses aplikasi ini
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, textStyle]}>Username</Text>
            <TextInput
              style={inputStyle}
              placeholder="Masukkan username disini"
              placeholderTextColor={placeholderTextColor}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, textStyle]}>Email</Text>
            <TextInput
              style={inputStyle}
              placeholder="Masukkan email disini"
              placeholderTextColor={placeholderTextColor}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, textStyle]}>Kata Sandi</Text>
            <View style={styles.passwordInputView}>
              <TextInput
                style={[inputStyle, styles.passwordInput]}
                placeholder="Masukkan kata sandi disini"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Text style={textStyle}>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
                {/* Or use an Icon: <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color={isDarkMode ? "#FFFFFF" : "#000000"} /> */}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, textStyle]}>Konfirmasi Kata Sandi</Text>
            <View style={styles.passwordInputView}>
              <TextInput
                style={[inputStyle, styles.passwordInput]}
                placeholder="Masukkan kata sandi disini"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <Text style={textStyle}>{isConfirmPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
                {/* Or use an Icon: <Icon name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color={isDarkMode ? "#FFFFFF" : "#000000"} /> */}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Selanjutnya</Text>
          </TouchableOpacity>

          <View style={styles.loginRedirect}>
            <Text style={[styles.loginText, textStyle]}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => console.log('Navigate to Login')}>
              <Text style={[styles.loginLink, isDarkMode ? styles.darkLink : styles.lightLink]}>Masuk</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingVertical: 20, // Added padding for scroll view
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212', // A slightly off-black for dark mode
  },
  header: {
    flexDirection: 'column', // Changed to column for better alignment of logo and text
    alignItems: 'center',
    marginBottom: 30, // Increased margin
  },
  logo: {
    width: 249, // Adjusted size
    height: 72, // Adjusted size
    resizeMode: 'contain',
    marginBottom: 10, // Space between logo and title text
  },
  titleText: {
    fontSize: 22, // Adjusted size
    fontFamily: 'Poppins-Bold', // Assuming you have this font
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 28, // Larger title
    fontFamily: 'Poppins-ExtraBold', // Assuming you have this font
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular', // Assuming you have this font
    textAlign: 'center',
    marginBottom: 30, // Space before form
    color: '#666666',
  },
  subtitleText: {
     lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium', // Assuming you have this font
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  lightInput: {
    borderColor: '#D0D0D0',
    backgroundColor: '#F9F9F9',
    color: '#000000',
  },
  darkInput: {
    borderColor: '#555555',
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  passwordInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  button: {
    backgroundColor: '#FFA500', // Orange color from image
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Space above button
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold', // Assuming you have this font
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold', // Assuming you have this font
  },
  lightLink: {
    color: '#FFA500', // Orange color
  },
  darkLink: {
    color: '#FFC107', // A lighter orange for dark mode
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
});
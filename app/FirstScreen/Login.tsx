import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { colors } from '../../constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';// Pastikan path ini sesuai dengan struktur folder Anda
import { LinearGradient } from 'react-native-linear-gradient'; // Pastikan Anda telah menginstal react-native-linear-gradient
export default function Login({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme(); 
  const isDarkMode = colorScheme === 'dark';

  const [passwordVisible, setPasswordVisible] = useState(false); 

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Status Bar */}
      <StatusBar
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {/* Logo and Title */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/ekraf_2.png')} 
          style={styles.logo}
        />
        <View>
          <GradientColor text ='Ekonomi Kreatif'/>
          <GradientColor text ='Kuningan' />
        </View>
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeText, isDarkMode ? styles.darkText : styles.lightText]}>Hallo, Selamat datang</Text>
        <Text style={[styles.subText, isDarkMode ? styles.darkSubText : styles.lightSubText]}>
          Silahkan login untuk mengakses aplikasi ini
        </Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        <Text style={[styles.label, isDarkMode ? styles.darkText : styles.lightText]}>Login</Text>

        {/* Email Input */}
        <View style={[styles.inputContainer, isDarkMode ? styles.darkInputContainer : styles.lightInputContainer]}>
        <Icon name="envelope-o" size={20} color={isDarkMode ? '#AAAAAA' : '#CCCCCC'} style={styles.icon} />
          <TextInput
            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Email address"
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#CCCCCC'}
          />
        </View>

        {/* Password Input */}
        <View style={[styles.inputContainer, isDarkMode ? styles.darkInputContainer : styles.lightInputContainer]}>
          <Icon name="lock" size={22} color={isDarkMode ? '#AAAAAA' : '#CCCCCC'} style={styles.icon} />
          <TextInput
            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#CCCCCC'}
            secureTextEntry={!passwordVisible} // Kontrol visibilitas password
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eyes' : 'eyes-slash'}
              size={20}
              color={isDarkMode ? '#AAAAAA' : '#CCCCCC'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, isDarkMode ? styles.darkLink : styles.lightLink]}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={[styles.loginButton, isDarkMode ? styles.darkButton : styles.lightButton]}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={[styles.registerText, isDarkMode ? styles.darkSubText : styles.lightSubText]}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.registerLink, isDarkMode ? styles.darkLink : styles.lightLink]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
type GradientColorProps = {
  text: string;
};

const GradientColor = ({ text }: GradientColorProps) => {
   const colorScheme = useColorScheme(); 
  const isDarkMode = colorScheme === 'dark';
  return (
    <MaskedView maskElement={<Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>{text}</Text>}>
      <LinearGradient
        colors={['#FFAA01', '#1F6361']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={{ textAlign: 'center', fontFamily:'Poppins-SemiBold', fontSize:23 }}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 60,
  },
  logo: {
    width: 122,
    height: 122,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 10,
    marginTop: 12,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
  },
  subText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    textAlign: 'left',
    marginTop: 5,
  },
  lightSubText: {
    color: '#666666',
  },
  darkSubText: {
    color: '#AAAAAA',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  lightInputContainer: {
    borderColor: '#CCCCCC',
  },
  darkInputContainer: {
    borderColor: '#444444',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  lightInput: {
    color: '#000000',
  },
  darkInput: {
    color: '#FFFFFF',
  },
  icon: {
    marginRight: 12,
  },
  forgotPassword: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 5,
  },
  lightLink: {
    color: '#FFAA01',
  },
  darkLink: {
    color: '#FFAA01',
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  lightButton: {
    backgroundColor: '#FFAA01',
  },
  darkButton: {
    backgroundColor: '#FFAA01',
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, useColorScheme, StatusBar, Animated, ActivityIndicator } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function SplashScreen() { // navigation prop tidak perlu di-destructure di sini jika menggunakan useNavigation
  const navigation = useNavigation(); // Dapatkan objek navigasi
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const iconFadeAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.5)).current;

  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Jalankan semua animasi
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 700,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateYAnim, {
          toValue: 0,
          duration: 700,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Setelah semua animasi selesai, baru periksa status otentikasi
      const checkAuthStatus = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          const userData = await AsyncStorage.getItem('userData');

          if (userToken && userData) {
            // Token ditemukan, pengguna sudah login. Arahkan ke NavigationBottom.
            navigation.replace('NavigationBottom');
          } else {
            // Token tidak ditemukan, pengguna belum login. Arahkan ke Login.
            navigation.replace('Login');
          }
        } catch (e) {
          console.error("Gagal memuat token dari penyimpanan:", e);
          // Jika ada error, tetap arahkan ke Login sebagai fallback
          navigation.replace('Login');
        }
      };

      // Jalankan pemeriksaan status otentikasi setelah animasi selesai
      checkAuthStatus();
    });

    // Tidak perlu setTimeout terpisah karena logika navigasi ada di callback .start() animasi
    // dan useNavigation() sudah menangani dependensi navigasi

  }, [iconFadeAnim, iconScaleAnim, textFadeAnim, textTranslateYAnim, navigation]); // Tambahkan navigation sebagai dependensi

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: iconFadeAnim,
            transform: [{ scale: iconScaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ekraf.png')}
          style={styles.logo}
        />
        <Animated.Image
          source={require('../../assets/images/SplashText.png')}
          style={[
            styles.splashTextLogo,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textTranslateYAnim }],
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
      <ActivityIndicator size="large" color="#FFAA01" style={styles.activityIndicator} />

      <View style={styles.footer}>
        <Text style={[styles.directedBy, isDarkMode ? styles.darkText : styles.lightText]}>Directed by :</Text>
        <View style={styles.footerLogos}>
          <Image
            source={require('../../assets/images/ekraf-pusat.png')}
            style={styles.footerLogo}
          />
          <Image
            source={require('../../assets/images/disporapar.png')}
            style={styles.footerLogo}
          />
        </View>
      </View>
    </View>
  );
}

type GradientColorProps = {
  text: string;
};

const GradientColor = ({ text }: GradientColorProps) => {
  return (
    <MaskedView maskElement={<Text style={{ textAlign: 'center', fontFamily:'Poppins-SemiBold',fontSize:20 }}>{text}</Text>}>
      <LinearGradient
        colors={['#FFAA01', '#1F6361']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={{ textAlign: 'center', fontFamily:'Poppins-SemiBold', fontSize:30 }}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  splashTextLogo: {
    width: 200,
    height: 60,
    marginBottom: 3,
    resizeMode: 'contain',
  },
  logoText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  directedBy: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  footerLogos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  footerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginHorizontal: 30,
  },
  activityIndicator: {
    marginTop: 50, // Sesuaikan posisi indikator agar terlihat baik
  }
});
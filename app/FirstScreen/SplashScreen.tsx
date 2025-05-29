import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, useColorScheme, StatusBar } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import {LinearGradient} from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
export default function SplashScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme(); // Deteksi mode gelap atau terang
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnBoarding'); // Navigasi ke OnBoarding setelah 3 detik
    }, 3000);

    return () => clearTimeout(timer); // Bersihkan timer saat komponen unmount
  }, [navigation]);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Status Bar */}
      <StatusBar
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/ekraf.png')} // Path yang benar
          style={styles.logo}
        />
        <Text style={[styles.logoText, isDarkMode ? styles.darkText : styles.lightText]}>.Ekraf</Text>
        <GradientColor text="Ekonomi Kreatif Kuningan" />
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={[styles.directedBy, isDarkMode ? styles.darkText : styles.lightText]}>Directed by :</Text>
        <View style={styles.footerLogos}>
          <Image
            source={require('../../assets/images/ekraf-pusat.png')} // Path yang benar
            style={styles.footerLogo}
          />
          <Image
            source={require('../../assets/images/disporapar.png')} // Path yang benar
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
    width: 100,
    height: 100,
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
});


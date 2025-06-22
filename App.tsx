// App.js (Main Application File)
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text, // Menambahkan Text untuk dummy components jika diperlukan
  View, // Menambahkan View untuk dummy components jika diperlukan
} from 'react-native';
import React, { useCallback, ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useIsFocused,
  getFocusedRouteNameFromRoute,
  RouteProp,
  ParamListBase,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeProvider, useTheme } from './app/Context/ThemeContext';

// Import komponen layar yang telah dipisahkan
import Login from './app/Auth/Login';
import Register from './app/Auth/Register';
import ResetPassword from './app/Auth/ResetPassword';
import DashboardScreen from './app/DashboardScreen/Dashboard';
import ProfileScreen from './app/DashboardScreen/ProfilScreen'; // Diperbarui ke ProfilScreen.js
import AddProdukScreen from './app/DashboardScreen/AddProduk'; // Diperbarui ke AddProduk.js

import './global.css'; // Asumsi ini adalah file CSS global untuk web, jika relevan dengan setup RN Anda.
import SplashScreen from './app/layout/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Antarmuka untuk properti komponen
interface FadeScreenProps {
  children: ReactNode;
}

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

/**
 * Komponen pembungkus untuk menerapkan efek fade-in/fade-out pada layar navigasi tab.
 * Menggunakan React Native's Animated API.
 */
function FadeScreen({ children }: FadeScreenProps) {
  const isFocused = useIsFocused();
  // Menggunakan useRef untuk mempertahankan Animated.Value antar render
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animasi opacity berdasarkan fokus layar
    Animated.timing(opacity, {
      toValue: isFocused ? 1 : 0,
      duration: 300, // Durasi animasi 300ms
      useNativeDriver: true, // Mengaktifkan native driver untuk performa yang lebih baik
    }).start(); // Memulai animasi
  }, [isFocused, opacity]); // Dependencies untuk useEffect

  return (
    <Animated.View style={[styles.animatedContainer, { opacity }]}>
      {children}
    </Animated.View>
  );
}

// Komponen ikon tab bar untuk setiap layar
const DashboardTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
);
// MitraTabBarIcon dan ProdukTabBarIcon dihapus karena komponen terkait tidak lagi diimpor
const ProfileTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
);
const AddProdukTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={24} color={color} />
);

/**
 * Tombol untuk mengganti tema terang/gelap di header.
 * Menggunakan hook `useTheme` dari ThemeContext.
 */
const HeaderThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={styles.headerRightButton}
      accessibilityLabel="Toggle dark mode">
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
    </TouchableOpacity>
  );
};

/**
 * Navigator tab bawah utama aplikasi.
 * Berisi semua layar yang dapat diakses melalui tab bar.
 */
function MainTabNavigator() {
  const { isDark } = useTheme(); // Mendapatkan status tema dari konteks

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Header layar tab diatur oleh Stack Navigator di atasnya
        tabBarActiveTintColor: '#FFAA01', // Warna ikon/label aktif
        tabBarInactiveTintColor: '#BEBEBE', // Warna ikon/label tidak aktif
        tabBarStyle: {
          backgroundColor: isDark ? '#18181b' : '#fff', // Warna latar belakang tab bar berdasarkan tema
          borderTopWidth: 0, // Menghilangkan border atas
          height: 60, // Tinggi tab bar
        },
        tabBarLabelStyle: {
          fontSize: 11,
          paddingBottom: 6, // Padding bawah untuk label
        },
        tabBarIconStyle: {
          marginTop: 4, // Margin atas untuk ikon
        },
      }}
    >
      <Tab.Screen name="Dashboard" options={{ tabBarIcon: DashboardTabBarIcon }}>
        {() => <FadeScreen><DashboardScreen isDark={false} /></FadeScreen>}
      </Tab.Screen>
      {/* Tab Manajemen Mitra dan Manajemen Produk dihapus */}
      <Tab.Screen name="Add Produk" options={{ tabBarIcon: AddProdukTabBarIcon }}>
        {() => <FadeScreen><AddProdukScreen isDark={false} /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Profil" options={{ tabBarIcon: ProfileTabBarIcon }}>
        {() => <FadeScreen><ProfileScreen isDark={false} /></FadeScreen>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

/**
 * Fungsi pembantu untuk mendapatkan judul header berdasarkan rute yang difokuskan di tab navigator.
 */
function getHeaderTitle(route: RouteProp<ParamListBase, 'MainApp'>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard'; // Dapatkan nama rute yang difokuskan
  switch (routeName) {
    // Case untuk 'Manajemen Mitra' dan 'Manajemen Produk' dihapus
    case 'Add Produk': return 'Tambah Produk';
    case 'Profil': return 'Profil';
    case 'Dashboard':
    default:
      return 'Dashboard';
  }
}

/**
 * Komponen utama yang berisi NavigationContainer dan Stack Navigator.
 * Ini adalah titik masuk utama untuk navigasi aplikasi setelah splash screen.
 */
function AppContent() {
  const { isDark } = useTheme(); // Mendapatkan status tema dari konteks

  // Definisi tema untuk NavigationContainer
  const MyTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f2f2f2' } };
  const MyDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#121212' } };

  // Menggunakan useCallback untuk mengoptimalkan renderHeaderRight
  const renderHeaderRight = useCallback(() => <HeaderThemeToggleButton />, []);

  return (
    <NavigationContainer theme={isDark ? MyDarkTheme : MyTheme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* Layar otentikasi dan splash */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

        {/* Layar utama aplikasi dengan tab navigator */}
        <Stack.Screen
          name="MainApp"
          component={MainTabNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route), // Judul header dinamis
            headerStyle: { backgroundColor: isDark ? '#18181b' : '#fff' }, // Gaya header berdasarkan tema
            headerTitleStyle: { color: isDark ? '#fff' : '#18181b' }, // Gaya judul header berdasarkan tema
            headerRight: renderHeaderRight, // Tombol toggle tema di kanan atas
            headerShadowVisible: false, // Menghilangkan bayangan header
          })}
        />

        {/* Layar EditMitra dihapus karena komponen tidak lagi diimpor */}
        {/* Tambahkan layar Stack.Screen lainnya di sini jika diperlukan */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Komponen akar aplikasi.
 * Membungkus seluruh aplikasi dengan ThemeProvider untuk menyediakan konteks tema.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Gaya StyleSheet untuk komponen
const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1, // Pastikan komponen mengisi seluruh ruang yang tersedia
  },
  headerRightButton: {
    marginRight: 16, // Margin kanan untuk tombol header
  },
});

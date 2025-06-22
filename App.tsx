// App.js (Main Application File)
import {
  StyleSheet,
  TouchableOpacity, // Dipertahankan untuk FadeScreen di dark mode
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

// --- Import dari React Native Reanimated ---
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Import komponen layar
import Login from './app/Auth/Login';
import Register from './app/Auth/Register';
import ResetPassword from './app/Auth/ResetPassword';
import DashboardScreen from './app/DashboardScreen/Dashboard';
import ProfileScreen from './app/DashboardScreen/ProfilScreen';
import AddProdukScreen from './app/DashboardScreen/AddProduk';
import SplashScreen from './app/layout/SplashScreen';

import './global.css';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
 * --- Diperbarui menggunakan React Native Reanimated ---
 */
function FadeScreen({ children }: FadeScreenProps) {
  const { isDark } = useTheme();
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const targetOpacity = isFocused ? 1 : 0;
    // Hanya jalankan animasi (withTiming) di mode terang.
    // Di mode gelap, langsung ubah opacity tanpa animasi.
    if (isDark) {
      opacity.value = targetOpacity;
    } else {
      opacity.value = withTiming(targetOpacity, { duration: 300 });
    }
  }, [isFocused, isDark, opacity]); // isDark ditambahkan sebagai dependency

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Selalu render Animated.View, logikanya ada di dalam useEffect.
  return (
    <Animated.View style={[styles.animatedContainer, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

// Komponen ikon tab bar untuk setiap layar (tetap sama)
const DashboardTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
);
const ProfileTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
);
const AddProdukTabBarIcon = ({ focused, color }: TabBarIconProps) => (
  <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={24} color={color} />
);

// Tombol toggle tema (tetap sama)
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

// MainTabNavigator (sedikit penyesuaian pada pemanggilan komponen)
function MainTabNavigator() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFAA01',
        tabBarInactiveTintColor: '#BEBEBE',
        tabBarStyle: {
          backgroundColor: isDark ? '#18181b' : '#fff',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          paddingBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      {/* Prop isDark yang hardcoded dihapus, karena komponen screen seharusnya mengambil dari context jika perlu */}
      <Tab.Screen name="Dashboard" options={{ tabBarIcon: DashboardTabBarIcon }}>
        {() => <FadeScreen><DashboardScreen /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Add Produk" options={{ tabBarIcon: AddProdukTabBarIcon }}>
        {() => <FadeScreen><AddProdukScreen /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="Profil" options={{ tabBarIcon: ProfileTabBarIcon }}>
        {() => <FadeScreen><ProfileScreen /></FadeScreen>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Fungsi getHeaderTitle (tetap sama)
function getHeaderTitle(route: RouteProp<ParamListBase, 'MainApp'>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
  switch (routeName) {
    case 'Add Produk': return 'Tambah Produk';
    case 'Profil': return 'Profil';
    case 'Dashboard':
    default:
      return 'Dashboard';
  }
}

// Komponen AppContent (tetap sama)
function AppContent() {
  const { isDark } = useTheme();

  const MyTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f2f2f2' } };
  const MyDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#121212' } };

  const renderHeaderRight = useCallback(() => <HeaderThemeToggleButton />, []);

  return (
    <NavigationContainer theme={isDark ? MyDarkTheme : MyTheme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainApp"
          component={MainTabNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle: { backgroundColor: isDark ? '#18181b' : '#fff' },
            headerTitleStyle: { color: isDark ? '#fff' : '#18181b' },
            headerRight: renderHeaderRight,
            headerShadowVisible: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Komponen App (tetap sama)
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// StyleSheet (tetap sama)
const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1, // Pastikan komponen mengisi seluruh ruang yang tersedia
  },
  headerRightButton: {
    marginRight: 16, // Margin kanan untuk tombol header
  },
});

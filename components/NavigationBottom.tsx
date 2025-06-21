import { StyleSheet, Text, View, useColorScheme, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../app/DashboardScreen/Dashboard';
import ProfileScreen from '../app/DashboardScreen/ProfilScreen';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import ProdukDataScreen from '../app/DashboardScreen/ProdukData';
import NotificationScreen from '../app/DashboardScreen/Notification';
import { useIsFocused } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

function FadeScreen({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  if (isDark) {
    return <>{children}</>;
  }
  const isFocused = useIsFocused();
  const opacity = useSharedValue(isFocused ? 1 : 0);
  React.useEffect(() => {
    opacity.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>;
}

export default function NavigationBottom({navigation}: { navigation: any }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  // Tombol toggle di header Dashboard
  const dashboardOptions: BottomTabNavigationOptions = {
    headerShown: true,
    headerTitle: 'Dashboard',
    headerStyle: {
      backgroundColor: isDark ? '#18181b' : '#fff',
    },
    headerTitleStyle: {
      color: isDark ? '#fff' : '#18181b',
      fontFamily: 'Poppins-Medium', // perbaiki case font
      marginBottom: 4,
    },
    headerRight: () => (
      <TouchableOpacity
        onPress={() => setTheme(isDark ? 'light' : 'dark')}
        style={{ marginRight: 16 }}
        accessibilityLabel="Toggle dark mode">
        <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={isDark ? '#FFAA01' : '#18181b'} />
      </TouchableOpacity>
    ),
    tabBarLabel: 'Dashboard',
    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
      <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
    ),
  };

  return (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#FFAA01',
            tabBarInactiveTintColor: '#BEBEBE',
            tabBarStyle: {
              backgroundColor: isDark ? '#18181b' : '#fff',
              borderTopColor: isDark ? '#27272a' : '#e5e7eb',
                borderTopWidth: 0,
                height: 60,
            },
            tabBarLabelStyle: {
              fontFamily: 'Poppins-Medium', // perbaiki case font
              fontSize: 11,
                marginBottom: 6,
            },
            tabBarIconStyle: {
              marginTop: 4,
            },
            headerShown: false,
          }}
        >
            <Tab.Screen 
              name="Dashboard" 
              options={dashboardOptions}
            >
              {() => (
                <FadeScreen isDark={isDark}>
                  <DashboardScreen isDark={isDark} />
                </FadeScreen>
              )}
            </Tab.Screen>
            <Tab.Screen name="Produk" options={{
                tabBarLabel: 'Produk',
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
                  <Ionicons name={focused ? 'cube' : 'cube-outline'} size={24} color={color} />
                )
            }}>
              {() => (
                <FadeScreen isDark={isDark}>
                  <ProdukDataScreen isDark={isDark} />
                </FadeScreen>
              )}
            </Tab.Screen>
            <Tab.Screen name="Notification" options={{
                tabBarLabel: 'Notifikasi',
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
                  <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
                )
            }}>
              {() => (
                <FadeScreen isDark={isDark}>
                  <NotificationScreen isDark={isDark} />
                </FadeScreen>
              )}
            </Tab.Screen>
            <Tab.Screen name="Profile" options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
                  <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                )
            }}>
              {() => (
                <FadeScreen isDark={isDark}>
                  <ProfileScreen isDark={isDark} />
                </FadeScreen>
              )}
            </Tab.Screen>
        </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})
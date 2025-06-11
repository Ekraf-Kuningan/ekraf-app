import { StyleSheet, Linking, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import SplashScreen from './app/FirstScreen/SplashScreen';
import Login from './app/FirstScreen/Login';
import Register from './app/FirstScreen/Register';
import NavigationBottom from './components/NavigationBottom';
import ResetPassword from './app/FirstScreen/ResetPassword';
import "./global.css";

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    const handleDeepLink = (url) => {
      if (!url) {
        return;
      }

      const route = url.replace(/.*?:\/\//g, '');
      const host = route.split('?')[0];

      if (host === 'verification-success') {
        Alert.alert("Verifikasi Berhasil!", "Akun Anda telah diaktifkan. Silakan login untuk melanjutkan.");
        if (navigationRef.current) {
          navigationRef.current.navigate('Login');
        }
      }

      if (host === 'reset-password') {
         const params = new URLSearchParams(route.split('?')[1]);
         const token = params.get('token');
         if (navigationRef.current && token) {
           navigationRef.current.navigate('ResetPassword', { token: token });
         }
      }
    };

    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    getInitialUrl();

    const urlSubscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      urlSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="NavigationBottom" component={NavigationBottom} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})

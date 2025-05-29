import { StyleSheet, Text, View, useColorScheme, StatusBar } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Button from '../../components/Button';

type RootStackParamList = {
  SplashScreen: undefined;
  OnBoarding: undefined;
  Login: undefined;
  Register: undefined;
};

export default function OnBoarding() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'OnBoarding'>>();
  const colorScheme = useColorScheme(); // Deteksi mode gelap atau terang
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Status Bar */}
      <StatusBar
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {/* Content */}
      <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>Welcome to the OnBoarding Screen!</Text>
      <Button btn_text={"Lanjutkan.."} on_press={() => navigation.navigate("Login")} />
    </View>
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
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
});
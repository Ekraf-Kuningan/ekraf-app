import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useColorScheme } from 'react-native';

export default function Register() {
  const colorScheme = useColorScheme(); // Deteksi mode gelap atau terang
  const isDarkMode = colorScheme === 'dark';
  return (
    <View style={styles.container}>


    </View>
  )
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
    right: 20,
  },
  logo: {
    width: 122,
    height: 122,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-ExtraBold',
    marginLeft: 10,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
})
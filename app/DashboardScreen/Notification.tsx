import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../Context/ThemeContext';

export default function Notification() {
  const { isDark } = useTheme(); 
  return (
    <View>
      <Text>Notification</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
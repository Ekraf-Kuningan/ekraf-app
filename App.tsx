import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './app/FirstScreen/SplashScreen';
import OnBoarding from './app/FirstScreen/OnBoarding';
import Login from './app/FirstScreen/Login';
import Register from './app/FirstScreen/Register';
import {  } from 'react-native';


const Stack = createNativeStackNavigator();

export default function App2() {
  return (
   <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false,animation: 'fade'}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} />
            <Stack.Screen name="OnBoarding" component={OnBoarding} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
            <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
        </Stack.Navigator>
   </NavigationContainer>
  )
}

const styles = StyleSheet.create({})
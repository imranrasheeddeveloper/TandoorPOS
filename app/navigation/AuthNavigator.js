import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import AccountScreen from '../screens/AccountScreen';
import AppNavigator from './AppNavigator';
const Stack = createStackNavigator();
const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
        {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Acccount" component={AccountScreen} />
        <Stack.Screen name="AppNavigator" component={AppNavigator} />
        
    </Stack.Navigator>
)
export default AuthNavigator;
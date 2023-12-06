import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScanningHistoryScreen from '../screens/ScanningHistoryScreen';
const Stack = createStackNavigator();

const FeedNavigator = () => (
    <Stack.Navigator mode="modal" screenOptions={{ headerShown: false}}>
        <Stack.Screen name={lang === 'en'? 'ScanningHistory' : 'تاريخ'} component={ScanningHistoryScreen}/>
    </Stack.Navigator>
);
export default FeedNavigator;

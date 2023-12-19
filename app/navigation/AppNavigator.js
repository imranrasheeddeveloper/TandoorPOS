import React, { useContext, useEffect, useState } from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import MainContainer from '../screens/MainContainer';
import TicketForm from '../screens/TicketForm';
import POSScreen from '../screens/POSScreen';
import OrderScreen from '../screens/OrderScreen';
import AccountNavigator from './AccountNavigator';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import NewListingButton from './NewListingButton';
import cache from '../utility/cache';
import AuthContext from '../auth/context';
import ActivitySelectionNavigator from './ActivitySelectionNavigator';
import ActivityScanningHistoryScreen from '../screens/ActivityScanningHistoryScreen';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();


const AppNavigator = () => { 
    const [lang, setLang] = useState("en");
    const {user, setUser} = useContext(AuthContext);
    useEffect(()=>{
        (async () => {
        const { value } = await cache.getLang("lang");
        setLang(value);
        })();
    }, []);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="MainContainer" component={MainContainer} />
            <Stack.Screen name="POSScreen" component={POSScreen} />
            <Stack.Screen name="Ticket" component={TicketForm} />
            <Stack.Screen name="Barcode" component={BarcodeScannerScreen} />
            <Stack.Screen name="Acccount" component={AccountNavigator} />
        </Stack.Navigator>
    )
   
}
export default AppNavigator;
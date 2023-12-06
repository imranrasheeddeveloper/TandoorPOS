import React, { useEffect, useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AccountScreen from "../screens/AccountScreen";
import ScanningHistoryScreen from '../screens/ScanningHistoryScreen';
import cache from '../utility/cache';
const Stack = createStackNavigator();

const AccountNavigator = () => {
    const [lang, setLang] = useState("en");
    useEffect(()=>{
        (async () => {
        const { value } = await cache.getLang("lang");
        setLang(value);
        })();
    }, []);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name={lang === 'en'? 'ScanningHistory' : 'تاريخ'} component={ScanningHistoryScreen} />
        </Stack.Navigator>
    );
}
export default AccountNavigator;

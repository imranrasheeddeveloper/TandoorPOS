import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SelectEventActivityType from '../screens/SelectEventActivityType';
import TicketTransactionBarcodeScreen from '../screens/TicketTransactionBarcodeScreen';
const Stack = createStackNavigator();

const ActivitySelectionNavigator = () => (
    <Stack.Navigator mode="modal" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="TicketTransactionBarcodeScreen" component={TicketTransactionBarcodeScreen} />
        <Stack.Screen name="SelectEvent" component={SelectEventActivityType} />
        
    </Stack.Navigator>
);
export default ActivitySelectionNavigator;

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import styles from '../components/Styles'
function TestingStyles(props) {
    return (
        <View style={styles.container}>
            <AppText>My First React Native App, Hello world </AppText>
            <View 
                style={{
                    width:100,
                    height:100,
                }}    
            >
               
            </View>
            <MaterialCommunityIcons name="email" size={200} color="dodgerblue" />
        </View>
    );
}
export default TestingStyles;

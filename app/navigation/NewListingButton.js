import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

function NewListingButton({onPress}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
                <MaterialCommunityIcons 
                    name="camera"
                    color={colors.white}
                    size={40}
                />
            
        </TouchableOpacity>
          
    );
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        height: 80,
        width: 80,
        borderRadius: 40,
        bottom: 35,
        borderColor: colors.white,
        borderWidth: 10

    }
});

export default NewListingButton;
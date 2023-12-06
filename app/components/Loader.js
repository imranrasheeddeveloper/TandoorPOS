import React from 'react';
import {View, StyleSheet} from 'react-native';
import AppText from './AppText';
import LottieView from 'lottie-react-native';
import colors from '../config/colors';

function Loader({lang}) {
    return (
        <View style={styles.lottieViewContainer}>
        <View style={styles.animationContainer}>
            <LottieView 
                source={require('../assets/animations/loader.json')}
                autoPlay
                loop={false}
                style={styles.animation}
            />
            <AppText style={styles.animationText}>{lang === 'en'? 'Loading...':'جار التحميل...'}</AppText>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    animation: {
        width: 250,
        height:250,
        color: colors.primary,
    },
    animationContainer: {
        justifyContent:"center",
        alignItems: "center",
        marginTop: "20%",
        width: '100%'
    },
    lottieViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animationText: {
        bottom:180
    }
});

export default Loader;
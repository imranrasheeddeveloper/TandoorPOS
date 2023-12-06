import React from 'react';
import {StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import colors from '../config/colors';
import OfflineNotice from './OfflineNotice';
function Screen({children, style}) {
    return (
        <>
        <SafeAreaView style={[styles.container, style]}>
            <OfflineNotice/>
            <StatusBar
                animated={true}
                backgroundColor={colors.placeholderColor}
                />
                {children}
        </SafeAreaView>
       </>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: colors.backgroundPrimary,
    }
})
export default Screen;
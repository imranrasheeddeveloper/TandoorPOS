import {React, useEffect, useState} from 'react';
import {ImageBackground, Image, Platform, StyleSheet, View, StatusBar, Text } from 'react-native';
import styles from '../components/Styles';
import Button from '../components/AppButton';
import Screen from '../components/Screen';
import { BarCodeScanner } from 'expo-barcode-scanner';
import cache from '../utility/cache';
import Loader from '../components/Loader';
function WelcomeScreen({navigation}) {
    const [lang, setLang] = useState("en");
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
        })();
        (async () => {
            const result = await cache.getLang("lang");
            if(result)
            {
                setLang(result.value);
            }
            setLoaded(true);
        })();
      }, []);
    if(loaded)
    {
        return (
            <Screen>
                <ImageBackground 
                    blurRadius={10}
                    style={styles.background} 
                    source={require('../assets/background.png')}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo} 
                            source={require('../assets/latestLogoWhite.png')}
                        />
                        <Text style={styles.logoText}>First platform where organizer can meet suppliers, sponsors and users.</Text>
                    </View>
                    <View style={styles.loginButton}>
                        <Button title={ lang === 'en'? 'Login':'تسجيل الدخول'} color='primary'  onPress={() => navigation.navigate("Login")} />
                    </View>
                </ImageBackground>
            </Screen>
        );
    }
    return <Loader lang={lang?lang:'en'} />
   
}


export default WelcomeScreen;
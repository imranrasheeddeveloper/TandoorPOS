import {StyleSheet, Image, Modal, View , Dimensions} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import * as Yup from 'yup';
import {AppForm, AppFormField, SubmitButton, ErrorMessage} from '../components/forms';
import authApi from '../api/auth';
import Screen from '../components/Screen';
import AuthContext from '../auth/context';
import authStorage from '../auth/storage';
import LottieView from 'lottie-react-native';
import colors from '../config/colors';
import AppText from '../components/AppText';
import cache from '../utility/cache';
import Loader from '../components/Loader';

function LoginScreen(props) {
    const [loaded, setLoaded] = useState(false);
    const [lang, setLang] = useState("en");
    const [userData, setUserData] = useState('');
    useEffect(()=>{
        (async () => {
            const { value } = await cache.getLang("lang");
            setLang(value);
            setLoaded(true);
        })();
    }, [])
    const validationSchema = Yup.object().shape({
        email: Yup.string(lang === 'en'? 'Email is a string field.': 'البريد الإلكتروني هو حقل سلسلة.').required(lang === 'en'? 'Email is a required field.': 'إن البريد الإلكترونى حقل مطلوب.').email(lang === 'en'? 'Invalid email format.': 'تنسيق بريد إلكتروني غير صالح.').label("Email"),
        password: Yup.string(lang === 'en'? 'Password is a string field.': 'كلمة المرور هي حقل سلسلة.').required(lang === 'en'? 'Password is a required field.': 'كلمة المرور هي حقل مطلوب.').label("Password")
    })
    const authContext = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const windowWidth = Dimensions.get('window').width;
    const handleSubmit = async ({email, password}) => {
        setModalVisible(true)
        const result = await authApi.login(email, password);
       
        setModalVisible(false)
        if(result.data.success === false) 
        {
            console.log(result)
            return setLoginFailed(true);
        }
        setLoginFailed(false);
        setUserData(result.data.data)
        authContext.setUser(userData);
        authStorage.storeToken("_auth_token", userData);
    }

    if(loaded)
    {
        return (
            <Screen style={styles.container}>
            <View style={styles.containerCentered}>
              {(windowWidth > 600 || Dimensions.get('window').height > 600) && (
                <View style={styles.logoContainer}>
                  <Image style={styles.logo} source={require("../assets/logo.png")} />
                </View>
              )}
              <View style={styles.formContainer}>
                <AppForm
                  initialValues={{ email: '', password: '' }}
                  onSubmit={handleSubmit}
                  validationSchema={validationSchema}
                  style={styles.form}
                >
                 <AppFormField 
                        icon="email"
                        placeholder={lang === 'en'? 'Email':'البريد الإلكتروني'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        name="email"
                        keyboardType = "email-address"
                        textContentType="emailAddress"
                        lang={lang}
                        label={lang === 'en'? 'Email':'البريد الإلكتروني'}
                    />
                    <AppFormField 
                        icon="lock"
                        placeholder={lang === 'en'? 'Password':'كلمه السر'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                        textContentType="password"
                        name="password"
                        label={lang === 'en'? 'Password':'الرمز السري'}
                        lang={lang}
                    />
                    <SubmitButton title={ lang === 'en'? 'Login':'تسجيل الدخول'}  />
                </AppForm>
                <ErrorMessage error="Invalid email and/or password." visible={loginFailed} />
              </View>
            </View>
                <Modal visible={modalVisible} animationType="slide">
                <View style={styles.lottieViewContainer}>
                                <View style={styles.animationContainer}>
                                    <LottieView 
                                        source={require('../assets/animations/loader.json')}
                                        autoPlay
                                        loop={true}
                                        style={styles.animation}
                                    />
                                </View>
                                <AppText style={styles.animationText}>{lang === 'en'? 'Please wait verifying...':'انتظار التأكيد ...'}</AppText>
                            </View>
                   
                </Modal>

            </Screen>
        )
    }
    return <Loader lang={lang?lang:'en'} />
   
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      containerCentered: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
      },
      logoContainer: {
        flex: 1,
        marginHorizontal: 100
      },
      formContainer: {
        flex: 1,
      },
    logo:{
        height: 300,
        width: 300,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    animationContainer: {
        height: 200, 
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animationText: {
        marginTop: 20,
        color: colors.primary,
        textAlign: 'center', 
        fontSize: 14,
        fontWeight:'bold'
    },
    lottieViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: 250,
        height: 250,
      },
      form: {
        paddingHorizontal: 20,
      },
      languageSelectionContainer: {
        flex:1,
        width: "100%",
        justifyContent: "center"
        
    },
  
})
export default LoginScreen;


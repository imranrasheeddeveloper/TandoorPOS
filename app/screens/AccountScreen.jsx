import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Modal, Alert, Text , TouchableOpacity } from 'react-native';
import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import colors from '../config/colors';
import Icon from '../components/Icon';
import ListItemSeparator from '../components/ListItemSeparator';
import AuthContext from '../auth/context';
import authStorage from '../auth/storage';
import AppButton from '../components/AppButton';
import {MaterialIcons } from '@expo/vector-icons'
import cache from '../utility/cache';
import getAssignedActivity from '../api/getAssignedActivity';
import EventModal from './EventModal';

import * as Updates from 'expo-updates';
import Loader from '../components/Loader';
function AccountScreen({navigation}) {
    const {user, setUser} = useContext(AuthContext);
    const [loaded, setLoaded] = useState(false)
    const [lang, setLang] = useState("en");
    useEffect(()=>{
        (async () => {
        const { value } = await cache.getLang("lang");
        setLang(value);
        setLoaded(true)
        })();
    }, [navigation]);
    const menuItems =  [
        {
            title:lang === 'en'? 'Sale' : 'تاريخ المسح',
            icon: {
                name:"history",
                backgroundColor:colors.secondary
            },
            targetScreen: lang === 'en'? 'Scanning History' : 'تاريخ المسح'
        }
    ];
    const [modalVisible, setModalVisible] = useState(false);
    const [activityTypeModalVisble, setActivityTypeModalVisble] = useState(false);
    const [isGameModalVisible, setGameModalVisible] = useState(false);
    const [activityResult , setActivityResult] = useState('');
    const [logoutModalVisible , setlogoutModalVisible] = useState(false)
    const handleLogOut = () => {
        setUser(null);
        authStorage.removeToken("_auth_token");
    }
    const languageSelection= () => {
        setModalVisible(true);
    }
    const activityTypeSelection= () => {
        setActivityTypeModalVisble(true);
    }
    const selectArabic = () => {
        cache.storeLang("lang", "ar");
        Updates.reloadAsync();
        setModalVisible(false);
    }
    const selectEnglish = () => {
        cache.storeLang("lang", "en");
        Updates.reloadAsync();
        setModalVisible(false);
    }

    const openGameModal = () => {
        setGameModalVisible(true); 
      };
    
      const closeGameModal = () => {
        setGameModalVisible(false); 
      };

      const openLogoutModal = () => {
        setlogoutModalVisible(true); 
      };
    const selectEventTickets = () => {
        cache.storeActivityType('ActivityType' , "scanEvent")
        setActivityTypeModalVisble(false);
    }
    const selectActivityTickets = () => {
         cache.storeActivityType('ActivityType' , "scanActivity")
         setActivityTypeModalVisble(false);
     }
    const selectSellGameTickets = async () => {
        cache.storeActivityType('ActivityType' , "sell")
        const result = await getAssignedActivity.getAssignedActivity(user.token);
        let activityResult = result.data;
        cache.storeGameActivityData('gameData' , activityResult.data)
        setActivityResult(activityResult.data)
        if(activityResult.status === true){
            setActivityTypeModalVisble(false)
            openGameModal()
        }else{
            Alert.alert('Error' , activityResult.message)
        }
    }


    if(loaded)
    {
        return (
            <Screen style={styles.screen}>
                 <View style={styles.container}>
                     <ListItem
                         lang={lang}
                         title= {user.name}
                         subTitle={user.email}
                         image={require('../assets/profile.png')}
                     />
                 </View>
                 <View style={styles.container}>
                     <FlatList
                         data={menuItems}
                         keyExtractor = {menuItem => menuItem.title}
                         ItemSeparatorComponent = {ListItemSeparator}
                         renderItem={({item}) =>
                             <ListItem 
                                 lang={lang}
                                 title={item.title} 
                                 IconComponent={
                                     <Icon name={item.icon.name} backgroundColor={item.icon.backgroundColor} />
                             
                                 } 
                                 onPress={()=> navigation.navigate(item.targetScreen)}
                             />
                         }
                     />
                 </View>
                 <ListItem 
                        lang={lang}
                        title={lang === 'en'? 'Select Language' : 'اختار اللغة'}
                        IconComponent={
                             <View style={{
                                 width:40,
                                 height:40,
                                 backgroundColor:colors.secondary,
                                 borderRadius: 40/2,
                                 justifyContent: 'center',
                                 alignItems: "center",
                             }}>
                                 <MaterialIcons name="language" size={40*0.5} color="#fff" />
                             </View>
                        }
                        onPress={languageSelection}
                 />
                 
                 <ListItem 
                        lang={lang}
                        title={lang === 'en'? 'Log Out' : 'تسجيل خروج'} 
                        IconComponent={
                            <Icon name="logout" backgroundColor={colors.secondary} />
                        }
                        onPress={openLogoutModal}
                 />
     
                 <Modal visible={modalVisible} animationType="slide">
                     <View style={styles.languageSelectionContainer}>
                         <ListItem 
                             lang={lang}
                             title={lang === 'en'? 'English' : 'إنجليزي'} 
                             IconComponent={
                                 <View style={{
                                     width:40,
                                     height:40,
                                     backgroundColor:colors.primary,
                                     borderRadius: 40/2,
                                     justifyContent: 'center',
                                     alignItems: "center",
                                 }}>
                                     {/* <FontAwesome name="sort-alpha-asc" size={40*0.5} color="#fff" /> */}
                                 </View>
                             }
                             onPress={selectEnglish}
                         />
                         <ListItem 
                             lang={lang}
                             title={lang === 'en'? 'Arabic' : 'عربي'}  
                             IconComponent={
                                 <Icon name="abjad-arabic" backgroundColor={colors.primary} />
                             }
                             onPress={selectArabic}
                         />
                         <View style={{paddingHorizontal:10, marginVertical:50}}>
                             <AppButton title={lang === 'en'? 'Close' : 'يلغي'}  onPress={()=> setModalVisible(false)} />
                         </View>
                     </View>
                 </Modal>

                 <Modal visible={activityTypeModalVisble} animationType="slide">
                     <View style={styles.languageSelectionContainer}>
                         <ListItem 
                             lang={lang}
                             title={lang === 'en'? 'Scan Event Tickets' : 'مسح تذاكر الحدث'} 
                             onPress={selectEventTickets}
                         />
                         <ListItem 
                             lang={lang}
                             title={lang === 'en'? 'Scan Activity Tickets' : 'فحص تذاكر الفعالية'} 
                             onPress={selectActivityTickets}
                         />
                         <ListItem 
                             lang={lang}
                             title={lang === 'en'? 'Sell Game Tickets' : 'بيع تذاكر اللعبة'}  
                             onPress={selectSellGameTickets}
                         />
                         <View style={{paddingHorizontal:10, marginVertical:50}}>
                             <AppButton title={lang === 'en'? 'Close' : 'يلغي'}  onPress={()=> setActivityTypeModalVisble(false)} />
                         </View>
                     </View>
                 </Modal>

                 <Modal
                    animationType="slide"
                    transparent={true}
                    visible={logoutModalVisible}
                  >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Are you sure you want to sign out?</Text>

                            {/* Logout button */}
                            <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
                            <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>

                            {/* Cancel button */}
                            <TouchableOpacity onPress={() => setlogoutModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                 <EventModal isVisible={isGameModalVisible} closeModal={closeGameModal} eventData={activityResult} />

            </Screen>
         );
    }
    
    return (
       <Loader lang={lang} />
    )
    
}
const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.lightGrey,
    },
    container: {
        marginVertical:20,
    },
    languageSelectionContainer: {
        flex:1,
        width: "100%",
        justifyContent: "center"
        
    },
    logoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },

      signOutButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
      },
      logoutButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: 200,
      },
      cancelButton: {
        backgroundColor: '#2ecc71',
        padding: 10,
        borderRadius: 5,
        width: 200,
      },
})

export default AccountScreen;
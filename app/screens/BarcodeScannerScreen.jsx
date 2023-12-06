import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Button, Modal, Alert, Text , TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Screen from '../components/Screen';
import barcodeApi from '../api/barcodeResult';
import verifyTicket from '../api/verifyTicket';
import gamePurchaseApi from '../api/gamePurchase';
import AppText from '../components/AppText';
import {MaterialCommunityIcons, MaterialIcons, Fontisto   } from '@expo/vector-icons'
import colors from '../config/colors';
import AppButton from '../components/AppButton';
import ListItemSeparator from '../components/ListItemSeparator';
import cache from '../utility/cache';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../components/Loader';
import AuthContext from '../auth/context';
import base64 from 'react-native-base64';
import LottieView from 'lottie-react-native';
import { Touchable } from 'react-native';

import EventModal from './EventModal';
export default function BarcodeScannerScreen({navigation}) {
  const {user, setUser} = useContext(AuthContext);
  const [barcodeData, setBarcodeData] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [lang, setLang] = useState("en");
  const [activityType, setAtivityType] = useState("scan");
  const [loaded, setLoaded] = useState(false);
  const [apiCalled, setApiCalled] = useState(false); 
  const [inValidTickerModalVisible , setInValidTickerModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const[activityResult , setEventResult] = useState('')
  const isFocused = useIsFocused();
  const [isGameModalVisible, setGameModalVisible] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
      setModalVisible(false);
      setBarcodeData(false);
      (async () => {
          const { value } = await cache.getLang("lang");
          setLang(value);
          const  ativityTypeValue  = await cache.getActivityType("ActivityType");
          setAtivityType(ativityTypeValue.value);

          if(ativityTypeValue.value === 'sell'){
            const  gameData  = await cache.getGameActivityData("gameData");
            setEventResult(gameData.value);
          }
          
          setLoaded(true);
      })();
    });
    return unsubscribe;
  }, [navigation]);

  const openGameModal = () => {
    setGameModalVisible(true); 
  };

  const handleAlertOkayPress = () => {
    console.log('setApiCalled')
    setScanned(false)
    setApiCalled(false)
  };

  

  const closeGameModal = () => {
    setGameModalVisible(false); 
  };

  const handleBarCodeScanned = ({ data }) => {
    try {
       
        if (!apiCalled) {
          setApiCalled(true);
           if(activityType === 'sell'){
              getBarcodeResult(data);
           }else{
             const decodedData = base64.decode(data);
             const parsedData = JSON.parse(decodedData);
              getBarcodeResult(parsedData.qr_code);
           }
          
        }
    } catch (error) {
        console.error("Error decoding or parsing data:", error);
    }
  };


  const inValidTicketOnClose = () => {
      setModalVisible(false)
      setInValidTickerModalVisible(false)
      setScanned(false)
      setApiCalled(false)
  };
  const getBarcodeResult = async (hash) => {
   try {
     if(activityType === 'sell'){
      console.log(hash)
      const result = await gamePurchaseApi.gamePurchase(hash , activityResult.id , user.token)
      if(result.data.status){
        Alert.alert(
          'Success',
          result.data.message,
          [
            {
              text: 'Okay',
              onPress: handleAlertOkayPress,
            },
          ],
          { cancelable: false }
        );
      }else{
        Alert.alert(
          'Success',
          result.data.message,
          [
            {
              text: 'Okay',
              onPress: handleAlertOkayPress,
            },
          ],
          { cancelable: false }
        );
      }
     }else{
      //console.log("hash", hash)
      const result = await barcodeApi.scanBarcode(hash, user.token , activityType === 'scanActivity' ? 'activity' : 'event');
      let ticketDetails = result.data;
      setBarcodeData(ticketDetails.pass);
      
      if(result?.data?.status === true){
        setModalVisible(true);
        setScanned(true)
      }
      else{
        setModalVisible(false)
        setScanned(false)
        setApiCalled(true)
        setErrorMessage(result.data.message)
        setInValidTickerModalVisible(true)
      }
     }
     
   } catch (error) {
      setModalVisible(false)
      setScanned(false);
      return Alert.alert('error', 'invalid scan');
   }
   
  }
  const cacheTicketListing = async () => {
    var scannedTickets =  await cache.get('scannedTickets'+user.id);
    var data = [];
    var ticket = {
      'ticket_id' : barcodeData.result.ticket_id,
      'sub_ticket_id':barcodeData.result.sub_ticket_id,
      'name' : barcodeData.result.user_name,
      'used_at' :  moment(new Date()).format("DD/MM/YYYY hh:mm:ss", true)
    }
    if(!scannedTickets)
    {
      data.push(ticket);
    }
    else {
      data = scannedTickets.value;
      data.push(ticket); 
    }
    
    await cache.store('scannedTickets'+user.id, data);
  }

  const verifyUserTicket = async(result) => {
    const response = await verifyTicket.verifyTicket(result, user.access_token);
    setModalVisible(false);
    if(response.data.error === false)
    {
      cacheTicketListing();
      Alert.alert(lang === 'en'?'Message':'رسالة', lang === 'en'?'Ticket Verified!':'تم التحقق من التذكرة!');
    }
    else {
      Alert.alert(lang === 'en'?'Message':'رسالة', lang === 'en'?'Ticket has already been verified!':'تم التحقق من التذكرة بالفعل!');
    }
    
  }

  if (hasPermission === false) {
      alert('You need to enable permission to access the camera.');
  }
  if(loaded)
  {
      return (
        <Screen>    
          <View style={styles.container}>
          <View style={styles.scannerContainer}>
          {isFocused ? (
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            ) : null}
            {activityType === 'sell' && (
              <TouchableOpacity style={styles.gameButton} onPress={() => openGameModal()}>
                <Text style={styles.gameButtonText}>Game</Text>
              </TouchableOpacity>
            )}
          </View>
           
           {/* {scanned ? (
              <Button
                title={'Tap to Scan Again'}
                onPress={() => {
                  setScanned(false);
                  setApiCalled(false);
                }}
              />
            ) : (
              <></>
            )} */}
          </View>
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.ticketVerifiedModal}>
              <View style={styles.centeredContent}>
                
                <View style={styles.animationContainer}>
                  <LottieView
                    source={require('../assets/animations/ticketVerified.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                  />
                </View>
                <View style={styles.heading}>
                  <AppText style={styles.headingText}>
                    {lang === 'en' ? 'Ticket Details' : 'تفاصيل التذكرة'}
                  </AppText>
                </View>
                <View style={[styles.itemsContainer, {flexDirection: lang === 'en'? 'row':'row-reverse'}]}>
                          <MaterialIcons  name="event-seat" color={colors.mediumGrey} size={20}/>
                          <AppText style={[styles.itemTitle,  {textAlign: lang === 'en'? 'left':'right'}]}> {lang==='en'?'Event Name':'اسم الحدث'}</AppText>
                          <AppText style={styles.itemValue}>{scanned ? barcodeData.event_name_en : undefined}</AppText>
                 </View>
                    <View style={[styles.itemsContainer, {flexDirection: lang === 'en'? 'row':'row-reverse'}]}>
                          <MaterialCommunityIcons name="ticket" color={colors.mediumGrey} size={20}/>
                          <AppText style={[styles.itemTitle,  {textAlign: lang === 'en'? 'left':'right'}]}> {lang==='en'?'Ticket ID':'معرف التذكرة'}</AppText>
                          <AppText style={styles.itemValue}>{scanned ? barcodeData.ticket_id : undefined}</AppText>
                    </View>
                    <ListItemSeparator/>
                    <View style={[styles.itemsContainer, {flexDirection: lang === 'en'? 'row':'row-reverse'}]}>
                          {/* <FontAwesome name="user" color={colors.mediumGrey} size={20}/> */}
                          <AppText style={[styles.itemTitle,  {textAlign: lang === 'en'? 'left':'right'}]}> {lang==='en'?'User Name':'اسم االمستخدم'}</AppText>
                          <AppText style={styles.itemValue}>{scanned ? barcodeData.name : undefined}</AppText>
                    </View>
                    <ListItemSeparator/>
                    <View style={[styles.itemsContainer, {flexDirection: lang === 'en'? 'row':'row-reverse', display:scanned?barcodeData.name === 'ticket_user'?'flex':'none':'flex'}]}>
                          <Fontisto  name="date" color={colors.mediumGrey} size={20}/>
                          <AppText style={[styles.itemTitle,  {textAlign: lang === 'en'? 'left':'right'}]}> {lang==='en'?'Valid till':'صالح حتى'}</AppText>
                          <AppText style={styles.itemValue}>{scanned ? barcodeData.valid_till : undefined}</AppText>
                    </View>
                    {/* <View style={styles.error}>
                        {scanned ? barcodeData.error && barcodeData.result.user_type ==='ticket_user' ?  <AppText><MaterialCommunityIcons name="close-circle" size={50} color={colors.danger} /></AppText> : <AppText><FontAwesome name="check-circle" size={50} color={colors.success} /></AppText>: undefined}
                        {scanned ? barcodeData.message != ""  && barcodeData.result.user_type ==='ticket_user'?  <AppText style={styles.message}>{barcodeData.message}</AppText>:<View style={{marginTop:10, width:"100%"}}><AppButton title={lang === 'en'?'Verify':'يؤكد'} buttonStyle={{display:barcodeData.result.user_type === 'ticket_user'?'flex':'none'}} color ="successDark" onPress={()=> verifyUserTicket(barcodeData.result)} /></View> : undefined}
                    </View> */}
                    <View style={{paddingHorizontal:10}}>
                      {/* <AppButton title={lang === 'en'?'Close':'أغلق'} onPress={()=> setModalVisible(false)} /> */}
                      <TouchableOpacity onPress={inValidTicketOnClose} style={styles.okayButton}>
                        <Text style={styles.okayButtonText}>{lang === 'en'?'Close':'أغلق'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
          </Modal>
          <Modal visible={inValidTickerModalVisible} transparent animationType="slide">
          <View style={styles.inValidTickerModal}>
               <View style={styles.centeredContent}>
                <LottieView
                  source={require('../assets/animations/tickerInvalid.json')}
                  autoPlay
                  loop
                  style={{ width: 120, height: 120 }}
                />
                <Text style={styles.errorMessage}>{errorMessage}</Text>
                <TouchableOpacity onPress={inValidTicketOnClose} style={styles.okayButton}>
                  <Text style={styles.okayButtonText}>{lang === 'en'?'Close':'أغلق'}</Text>
                </TouchableOpacity>
              </View>
              </View>
          </Modal>
          <EventModal isVisible={isGameModalVisible} closeModal={() => setGameModalVisible(false)} eventData={activityResult} />
        </Screen>
  
      );
  }
  return <Loader lang={lang?lang:'en'} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  itemsContainer: {
    padding: 10,
    marginHorizontal: 5
  },
  itemTitle: {
    flex:1,
    fontWeight:"600",
  },
  message:{
    marginTop:19,
  },
  itemValue:{
    flexDirection:'row-reverse'
  },
  error: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    justifyContent:"center"
  },
  heading: {
    alignItems: "center",
    fontSize: 35,
    marginBottom: 20,
    color:colors.black,
    fontWeight: "600"
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  animation: {
    width: 80,
    height: 80,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  inValidTickerModal:{
    justifyContent:'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: 300,
    maxHeight: 250,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 20,
  },

  ticketVerifiedModal:{
    justifyContent:'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: 300,
    maxHeight: 400,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 20,
  },

  centeredContent: {
    alignItems: 'center', // Center content horizontally
  },

  okayButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  okayButtonText: {
    color: 'white', // Set your desired text color
    fontSize: 16,
    textAlign: 'center',
    fontWeight:'bold'
  },
  errorMessage:{
    color: colors.mediumGrey,
    fontSize: 16,
    textAlign: 'center',
   
  },
  gameButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  gameButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
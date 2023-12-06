import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Button, Modal, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import AppButton from '../components/AppButton';
import cache from '../utility/cache';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../components/Loader';
import AuthContext from '../auth/context';
import RadioGroup from 'react-native-radio-buttons-group';
import purchaseActivityTicket from '../api/purchaseTicket';
import base64 from 'react-native-base64';
export default function TicketTransactionBarcodeScreen({navigation}) {
  const {user, setUser} = useContext(AuthContext);
  const [barcodeData, setBarcodeData] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [lang, setLang] = useState("en");
  const [loaded, setLoaded] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState();
  const [activityName, setActivityName] = useState();
  const [radioButtons, setRadioButtons] = useState();
  const isFocused = useIsFocused();
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
          if(user.group === 'archer')
          {
              const response = await cache.getActivity('activityWithTypes'+user.id);
              if(!response)
              {
                  return navigation.navigate('SelectEvent');
              }
              let activityTypes = response.value.activity_types
              let radioButtons = []
              for (const key in activityTypes) {
                  if(key === '0' )
                  {
                    let value = {
                      'id' : activityTypes[key].event_activity_type_id, 
                      'organizer_id': activityTypes[key].organizer_id,
                      'price': activityTypes[key].price,
                      'activity_name': activityTypes[key].activity_en_name,
                      'activity_type_name': activityTypes[key].activity_type_en_name,
                    }
                    radioButtons.push({
                      id : activityTypes[key].event_activity_type_id,
                      label : activityTypes[key].activity_type_en_name + ' ' +activityTypes[key].price,
                      value : value,
                      containerStyle	: styles.radioButtons,
                      selected: true,
                      labelStyle: styles.labelName
                    })
                    setSelectedActivityType(value)
                  }
                  else {
                    radioButtons.push({
                      id : activityTypes[key].event_activity_type_id,
                      label : activityTypes[key].activity_type_en_name + ' ' +activityTypes[key].price,
                      value : {
                        'id' : activityTypes[key].event_activity_type_id, 
                        'organizer_id': activityTypes[key].organizer_id,
                        'price': activityTypes[key].price,
                        'activity_name': activityTypes[key].activity_en_name,
                        'activity_type_name': activityTypes[key].activity_type_en_name,
                      },
                      containerStyle	: styles.radioButtons,
                      selected: false,
                      labelStyle: styles.labelName
                    })
                  }
                setActivityName(activityTypes[key].activity_en_name)
                
              }
              console.log("here")
              setRadioButtons(radioButtons);
          }
          const { value } = await cache.getLang("lang");
          setLang(value);
          setLoaded(true);
      })();
    });
    return unsubscribe;
  }, [navigation]);

  const handleBarCodeScanned = ({ type, data }) => {
    //console.log(data)
     setBarcodeData(JSON.parse(base64.decode(data)));
    console.log(barcodeData)
    getBarcodeResult(data);
    
  };
  const getBarcodeResult = async (data) => {
    try {
      setBarcodeData(JSON.parse(base64.decode(data)));
      setModalVisible(true);
      setScanned(true);   
    } catch (error) {
      setModalVisible(false);
      setScanned(false);
      return Alert.alert('error', 'invalid scanning');   
    }
    if(!data)
    {
      alert("error")
    }

  }

  if (hasPermission === false) {
      alert('You need to enable permission to access the camera.');
  }
  function onPressRadioButton(radioButtonsArray) {
      for (const key in radioButtonsArray) {
          const element = radioButtonsArray[key];
          if(element.selected){
            setSelectedActivityType(element.value)
          }
      }
      setRadioButtons(radioButtonsArray);
  }
  const purchaseTicket = async () => {
    if(selectedActivityType && barcodeData && user)
    {
      const response = await purchaseActivityTicket.purchaseTicket(selectedActivityType, barcodeData.user_id, user.access_token);
      if(response.data.error)
      {
        alert(response.data.message)
        return;
      }
      //Caching ticket
      var activityScannedTickets =  await cache.get('activityScannedTickets'+user.id);
      var data = [];
      var ticket = {
        'ticket_id' : response.data.ticket_id,
        'name' : barcodeData.user_name,
        'activity_name' : activityName,
        'purchased_at' :  moment(new Date()).format("DD/MM/YYYY hh:mm:ss", true)
      }
      if(!activityScannedTickets)
      {
        data.push(ticket);
      }
      else {
        data = activityScannedTickets.value;
        data.push(ticket); 
      }
      await cache.store('activityScannedTickets'+user.id, data);
      //Caching ticket End

      setModalVisible(false);
      return Alert.alert(lang === 'en'?'Message':'رسالة', lang === 'en'?response.data.message:'تمت المعاملة بنجاح.')
    }
    else
    {
      if(!selectedActivityType)
      return Alert.alert(lang === 'en'?'Message':'رسالة', lang === 'en'?'Kindly select the activity type!':'يرجى تحديد نوع النشاط!')
      Alert.alert(lang === 'en'?'Error':'خطأ', lang === 'en'?'something went wrong!':'هناك خطأ ما!');
    }
    
  }
  if(loaded)
  {
    return (
      <Screen>    
        <View style={styles.container}>
          {isFocused ? (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          ) : null}
          {scanned?<Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} /> : <></>}
        </View>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.heading}>
            <AppText style={styles.heading}>{activityName? activityName: undefined}</AppText>
          </View>
          <View style={styles.formContainer}>
              <AppText style={styles.nameContainer}>Name: {barcodeData?barcodeData.user_name: undefined}</AppText>
              <View style={styles.radioButtonsContainer}>
                <RadioGroup 
                    radioButtons={radioButtons} 
                    onPress={onPressRadioButton} 
                />
              </View>
              <View style={{paddingHorizontal:10}}>
                <AppButton title={lang === 'en'?'Verify':'يؤكد'} buttonStyle={styles.verify} color ="successDark" onPress={()=> purchaseTicket()} />
                <AppButton title={lang === 'en'?'Close':'أغلق'} onPress={()=> setModalVisible(false)} />
              </View>
          </View>
        </Modal>
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
  radioButtons: {
    alignSelf:'flex-start',
    fontSize:15
  },
  radioButtonsContainer:{
    marginVertical:10
  },
  formContainer: {
    marginHorizontal:10,
    
  },
  nameContainer:{
    marginHorizontal:10,
    fontSize:20
  },
  verify:{
    marginVertical:10
  },
  labelName: {
    fontSize:18
  }
});
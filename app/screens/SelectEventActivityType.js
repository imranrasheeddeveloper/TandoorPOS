import React, { useContext, useEffect, useRef, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { AppForm, AppFormPicker, ErrorMessage, SubmitButton } from '../components/forms';
import * as Yup from 'yup';
import Screen from '../components/Screen';
import {Picker} from '@react-native-picker/picker';
import { Formik } from 'formik';
import eventWithActivityTickets from '../api/getEventWithActivity';
import AuthContext from '../auth/context';
import Loader from '../components/Loader';
import cache from '../utility/cache';
function SelectEventActivityType({navigation}) {
    const {user, setUser} = useContext(AuthContext);
    const [event, setEvent] = useState();
    const [eventWithActivities, setEventWithActivities] = useState();
    const [activitiesOfSelectedEvent, setActivitiesOfSelectedEvent] = useState(null);
    const [activityId, setActivityId] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const storeActivitytWithTypes = async (activityWithType) => {
        setLoaded(false);
        await cache.storeActivity('activityWithTypes'+user.id, activityWithType);
        navigation.navigate('TicketTransactionBarcodeScreen');
        setLoaded(true);
    }
    const handleSubmit=()=> {
        let activityTypes = [];
        for (const key in eventWithActivities) {
           
            if(key === event)
            {
                for (const key2 in eventWithActivities[key]) {
                    if(eventWithActivities[key][key2].activity_id === activityId){
                        activityTypes.push(eventWithActivities[key][key2]);
                    }
                }
                
            }
        }
        let activityWithType = {
            'activity_id' : activityId,
            'activity_types':activityTypes,
        }
        storeActivitytWithTypes(activityWithType);
        
    }
    useEffect(()=>{
        (async () => {
            const response = await eventWithActivityTickets.getEventWithActivityTickets(user.access_token);
            if(response.data.error)
            {
                return
            }
            const getData = JSON.parse(response.data.data.eventWithActivityTicket);
            setEventWithActivities(getData);
            let events = [];
            for (const key in getData) {
                const element = getData[key];
                events.push(key);
                    
            }
            setAllEvents(events);
            setLoaded(true);
        })();
    }, []); 
   
    const validationSchema = Yup.object().shape({
        event: Yup.string().required().label("event"),
        activity: Yup.string().required().label("activity"),
    })
    if(loaded)
    {
        const renderEventList = () => {
            return allEvents.map((event) => {
              return <Picker.Item key={event} label={event} value={event} />
            })
        }
        const renderActivityList = () => {
            var resArr = [];
            activitiesOfSelectedEvent.filter(function(item){
              var i = resArr.findIndex(x => (x.activity_id == item.activity_id));
              if(i <= -1){
                    resArr.push(item);
              }
              return null;
            });
            return resArr.map(({activity_en_name, activity_id}) => {
              return <Picker.Item key={activity_id} label={activity_en_name} value={activity_id} />
            })
        }
        return (
            <Screen style={styles.container}>
                    <View style={styles.formContianer}>
                        <Formik
                            initialValues={{event: '', activity: ''}}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >
                            {({handleChange, handleSubmit, errors, touched, setFieldValue}) => (
                                <>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.defaultPicker}
                                        mode='dropdown'
                                        selectedValue={event}
                                        onValueChange={(event)=>{
                                            setFieldValue('event', event)
                                            setEvent(event)
                                            if(event !== "")
                                            {
                                                for (const key in eventWithActivities) {
                                                    if(key === event)
                                                    {
                                                        const element = eventWithActivities[key];
                                                        return setActivitiesOfSelectedEvent(element);
                                                        
                                                    }
                                                    
                                                }
                                            }
                                            return setActivitiesOfSelectedEvent(null)
                                        }}>
                                        <Picker.Item label="Select Event" value="" />
                                        {renderEventList()}
                                                                
                                    </Picker>
                                </View>
                                {errors && <ErrorMessage error={errors['event']} visible={touched['event']} style={{alignSelf:'flex-start', marginBottom:10, marginLeft:10}} />}
                                {activitiesOfSelectedEvent &&
                                    <>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                style={styles.defaultPicker}
                                                mode='dropdown'
                                                selectedValue={activityId}
                                                onValueChange={(activity)=>{
                                                    setFieldValue('activity', activity)
                                                    setActivityId(activity)
                                                }}>
                                                <Picker.Item label="Select Activity" value="" />
                                                {renderActivityList()}
                                                                        
                                            </Picker>
                                        </View>
                                        {errors && <ErrorMessage error={errors['activity']} visible={touched['activity']} style={{alignSelf:'flex-start', marginBottom:10, marginLeft:10}} />}
                                    </>
                                }
                               
                                <SubmitButton title='submit'  />
                                </>
                            )}
                                
                        </Formik>
                    </View>
            </Screen>
        );
    }
    return <Loader lang='en' />
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#23374db5',
        
    },
    formContianer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:20
    },
    defaultPicker: {
        width:'100%',
        backgroundColor:'white',
        borderRadius:20,

    },
    pickerContainer: {
        borderRadius: 50, 
        borderWidth: 1, 
        borderColor: '#bdc3c7', 
        overflow: 'hidden', 
        width:'100%',
        marginVertical:10
    },
});

export default SelectEventActivityType;
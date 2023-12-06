import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const prefix = 'cache';
const expiryInMinutes = 1440;
const store = async (key, value) => {
  try {
      const item = {
          value,
          timestamp: Date.now(),
      }
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}
const isExpired = (item) => {
  const now = moment(Date.now())
  const storedTime = moment(item.timestamp);
  return now.diff(storedTime, 'minutes') > expiryInMinutes;
}
const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value);
    if(!item) return null;
  
    if(isExpired(item)) {
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }
    return item;
  } catch(error) {
    console.log(error)
  }
}
const storeLang = async (key, value) => {
  try {
      const item = {
          value,
          timestamp: Date.now()
      }
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}
const getLang = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value);
    if(!item) return null;
    return item;
  } catch(error) {
    console.log(error)
  }
}
const storeActivity = async (key, value) => {
  try {
      const item = {
          value,
          timestamp: Date.now()
      }
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}

const storeActivityType = async (key, value) => {
  try {
      const item = {
          value,
          timestamp: Date.now()
      }
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}

const getActivityType = async (key) => {
  try {
    console.log(key)
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value);
    if(!item) return null;
    return item;
  } catch(error) {
    console.log(error)
  }
}

const storeGameActivityData = async (key, value) => {
  try {
      const item = {
          value,
          timestamp: Date.now()
      }
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}

const getGameActivityData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value);
    if(!item) return null;
    return item;
  } catch(error) {
    console.log(error)
  }
}

const getActivity = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key)
    const item = JSON.parse(value);
    if(!item) return null;
    return item;
  } catch(error) {
    console.log(error)
  }
}
  export default {
    store,
    get,
    storeLang,
    getLang,
    storeActivity,
    getActivity,
    storeActivityType,
    getActivityType,
    storeGameActivityData,
    getGameActivityData

  }
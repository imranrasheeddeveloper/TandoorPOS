import {React,useCallback, useEffect, useState} from "react";
import {View} from 'react-native'
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AuthContext from "./app/auth/context";
import AppNavigator from "./app/navigation/AppNavigator";
import authStorage from './app/auth/storage';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';
import OfflineNotice from "./app/components/OfflineNotice";

import {
  storeDiscountsData,
  storeCategoriesData,
  storeAllProducts,
  
} from './app/auth/dataStorage';

import { storeClientData  , getClientsData} from "./app/auth/sqliteHelper";
import cache from "./app/utility/cache";
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState();
  const [authToken, setToken] = useState();
  const restoreToken = async () => {
    const token = await authStorage.getToken("_auth_token");
   
    if(!token)  return setAppIsReady(true);
    setUser(JSON.parse(token));
    setToken(token.token)
    setAppIsReady(true);
  }
  const storeLang = async() => {
    const getSelectLang = await cache.getLang("lang");
    if(getSelectLang === null)
    {
      await cache.storeLang("lang", "en");
    }
  }
  useEffect(()=>{
    restoreToken();
    storeLang();
   
  },[]);
  useEffect(() => {
    if (user && user.token) {
      offlineDataSync(user);
    }
  }, [user]); // Dependency on user state
  
  const offlineDataSync = async (currentUser) => {
  
    axios
    .get('https://fnb.glorek.com/api/getDiscountsList')
    .then((response) => {
      if (response.data.success) {
       
        storeDiscountsData(response.data.data);
      } else {
        console.error('Error fetching discounts:', response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching discounts:', error);
    });

   
  axios
  .get('https://fnb.glorek.com/api/getAllProductServiceCategoryData')
    .then((response) => {
      if (response.data.success) {
        // Store categories data locally
        storeCategoriesData(response.data.data);
      } else {
        console.error('Error fetching categories:', response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
    });

    axios
    .get('https://fnb.glorek.com/api/getAllProducts')
    .then((response) => {
      if (response.data.success) {
        // Store all products data locally
        storeAllProducts(response.data.data);
      } else {
        console.error('Error fetching all products:', response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching all products:', error);
    });
       
    axios.get('https://fnb.glorek.com/api/clientsDropdown' , {
      headers: {
          'Authorization': `Bearer ${currentUser.token}`
      }
  })
    .then(response => {

      if (response.data.success) {
        // Store client data in SQLite
        storeClientData(response.data.data);
      } else {
        console.error('Error fetching clients:', response.data.message);
      }
    })
    .catch(error => {
      console.log(user.token)
      console.error('Error fetching clients:', error);
    });
  }


  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  
  return (
    <AuthContext.Provider value={{user, setUser}}>
      <OfflineNotice />
      <View
        onLayout={onLayoutRootView}
        style={{flex:1}}  
      >
        <NavigationContainer theme={navigationTheme}>
          {user? <AppNavigator/> : <AuthNavigator />}
        </NavigationContainer>
      </View>
    </AuthContext.Provider>
  );
}

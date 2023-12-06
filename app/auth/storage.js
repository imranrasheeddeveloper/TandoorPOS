import * as SecureStore from 'expo-secure-store';

const storeToken = async (key, authToken) => {
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(authToken));
        
    } catch (error) {
        console.log('Error storing the auth token', error);
    }
}
const getToken = async (key) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.log("Error getting the auth token", error);
    }
}

const removeToken = async (key) => {
    try {
        return await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.log("Error removing the auth token", error);
    }
}

export default {getToken, removeToken, storeToken}
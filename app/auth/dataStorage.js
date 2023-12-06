import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a key for each API's data
const DISCOUNTS_KEY = 'discounts_data_key';
const CATEGORIES_KEY = 'categories_data_key';
const PRODUCTS_KEY = 'products_data_key';
const ALL_PRODUCTS_KEY = 'all_products_key';

// Store data in AsyncStorage
export const storeData = async (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Retrieve data from AsyncStorage
export const getData = async (key) => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData != null ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Clear data from AsyncStorage (optional)
export const clearData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Define your API data storage and retrieval functions
export const storeDiscountsData = (data) => storeData(DISCOUNTS_KEY, data);
export const getDiscountsData = () => getData(DISCOUNTS_KEY);

export const storeCategoriesData = (data) => storeData(CATEGORIES_KEY, data);
export const getCategoriesData = () => getData(CATEGORIES_KEY);

export const storeAllProducts = async (data) => {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(ALL_PRODUCTS_KEY, jsonData);
    } catch (error) {
      console.error('Error storing all products data:', error);
    }
  };
  
  // Retrieve all products data from AsyncStorage
  export const getAllProducts = async () => {
    try {
      const jsonData = await AsyncStorage.getItem(ALL_PRODUCTS_KEY);
      return jsonData != null ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error retrieving all products data:', error);
      return null;
    }
  };

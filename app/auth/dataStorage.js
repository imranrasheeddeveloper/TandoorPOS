import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a key for each API's data
const DISCOUNTS_KEY = 'discounts_data_key';
const CATEGORIES_KEY = 'categories_data_key';
const PRODUCTS_KEY = 'products_data_key';
const ALL_PRODUCTS_KEY = 'all_products_key';
const ON_HOLD_ORDERS_KEY = 'on_hold_orders_key';
const ORDERS_KEY = 'orders_key';

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

// export const storeOnHoldOrders = (orders) => storeData(ON_HOLD_ORDERS_KEY, orders);
// export const getOnHoldOrders = () => getData(ON_HOLD_ORDERS_KEY);

export const storeOnHoldOrders = async (order) => {
  try {
    // Retrieve existing orders if any
    const existingOrders = await getOnHoldOrders();
    const newOrders = existingOrders ? [...existingOrders, order] : [order];
    await AsyncStorage.setItem(ON_HOLD_ORDERS_KEY, JSON.stringify(newOrders));
  } catch (error) {
    console.error('Error storing order data:', error);
  }
};

// Retrieve order data from AsyncStorage
export const getOnHoldOrders = async () => {
  try {
    const jsonData = await AsyncStorage.getItem(ON_HOLD_ORDERS_KEY);
    return jsonData != null ? JSON.parse(jsonData) : [];
  } catch (error) {
    console.error('Error retrieving order data:', error);
    return [];
  }
};


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

  export const storeOrderData = async (updatedOrder) => {
    try {
      const existingOrders = await getOrdersData();
  
      // Check if existingOrders is an array
      if (!Array.isArray(existingOrders)) {
        console.error('Existing orders are not in array format');
        return;
      }
  
      // Find the index of the order to be updated
      const orderIndex = existingOrders.findIndex(o => o.orderNumber === updatedOrder.orderNumber);
  
      if (orderIndex !== -1) {
        // Update the order at the found index
        existingOrders[orderIndex] = updatedOrder;
      } else {
        console.error('Order not found for updating');
        return;
      }
  
      // Stringify and store the updated orders array
      const jsonData = JSON.stringify(existingOrders);
      await AsyncStorage.setItem(ORDERS_KEY, jsonData);
    } catch (error) {
      console.error('Error storing order data:', error);
    }
  };
  
  
  
  // Retrieve order data from AsyncStorage
  export const getOrdersData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem(ORDERS_KEY);
      return jsonData != null ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error('Error retrieving order data:', error);
      return [];
    }
  };

  export const cancelOrder = async (orderId) => {
    try {
      const existingOrders = await getOrdersData();
      const orderIndex = existingOrders.findIndex((o) => o.orderNumber === orderId);
      
      if (orderIndex !== -1) {
        existingOrders[orderIndex].orderState = 'Canceled';
        console.log( existingOrders[orderIndex])
        await storeOrderData(existingOrders);
      }
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };
  
  export const completeOrder = async (orderId) => {
    try {
      const existingOrders = await getOrdersData();
      const orderIndex = existingOrders.findIndex((o) => o.orderNumber === orderId);
      
      if (orderIndex !== -1) {
        existingOrders[orderIndex].orderState = 'Completed';
        console.log( existingOrders[orderIndex])
        await storeOrderData(existingOrders);
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };


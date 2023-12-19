import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('app.db');

const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY NOT NULL, orderNumber TEXT, orderData TEXT);',
      [],
      () => console.log('Table created successfully'),
      error => console.error('Error creating table', error)
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS clients (value TEXT PRIMARY KEY NOT NULL, text TEXT);',
      [],
      () => console.log('Clients table created successfully'),
      error => console.error('Error creating clients table', error)
    );
  });

  
};

export const storeClientData = (clients) => {
  db.transaction(tx => {
    clients.forEach(client => {
      tx.executeSql(
        'INSERT OR REPLACE INTO clients (value, text) VALUES (?, ?);',
        [client.value, client.text],
        () => console.log('Client stored successfully'),
        error => console.error('Error storing client', error)
      );
    });
  });
};


export const getClientsData = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM clients;',
      [],
      (_, { rows: { _array } }) => callback(_array),
      error => console.error('Error retrieving clients', error)
    );
  });
};

export const storeOrderData = (order) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT OR REPLACE INTO orders (orderNumber, orderData) VALUES (?, ?);',
      [order.orderNumber, JSON.stringify(order)],
      () => console.log('Order stored successfully'),
      error => console.error('Error storing order', error)
    );
  });
};

export const getOrdersData = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM orders;',
      [],
      (_, { rows: { _array } }) => callback(_array.map(row => JSON.parse(row.orderData))),
      error => console.error('Error retrieving orders', error)
    );
  });
};

export const updateOrderState = (orderNumber, newState) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE orders SET orderData = json_set(orderData, \'$.orderState\', ?) WHERE orderNumber = ?;',
      [newState, orderNumber],
      () => console.log(`Order ${orderNumber} updated successfully`),
      error => console.error('Error updating order', error)
    );
  });
};


// Initialize the database
initDB();

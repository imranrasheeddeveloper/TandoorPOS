import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getClientsData } from '../auth/sqliteHelper';
import colors from '../config/colors';


const ClientsDropdown = ({ onSelect }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
   
  useEffect(() => {
    getClientsData(setClients);
    const defaultClient = {
      "text": "Store Walk-In",
      "value": "1",
    }
    setSelectedClient(defaultClient)
   
  }, []);

  const handleSelect = (client) => {
    setSelectedClient(client);
    console.log(client)
    onSelect(client);
    setIsExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.headerText}>{selectedClient ? selectedClient.text : 'Select Client'}</Text>
        <MaterialCommunityIcons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={24} 
          color="black" 
        />
      </TouchableOpacity>
      {isExpanded && (
        <FlatList
          data={clients}
          keyExtractor={item => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.item} 
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundPrimary
  },
  headerText: {
    fontSize: 16,
    color: 'white', 
  },
  list: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.backgroundPrimary,
    borderRadius: 5,
    backgroundColor: colors.backgroundPrimary,
    width: screenWidth / 3.8,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary
  },
  itemText: {
    fontSize: 16,
    color: colors.white
  },
});


export default ClientsDropdown;

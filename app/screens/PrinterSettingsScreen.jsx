import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import PrinterModal from './PrinterModal'; // Adjust the path as necessary
import Screen from '../components/Screen';
import colors from '../config/colors';

const db = SQLite.openDatabase('printers.db');

const PrinterSettingsScreen = () => {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPrinter, setCurrentPrinter] = useState({
    id: null,
    name: '',
    ipAddress: '',
    paperSize: '80',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredPrinters = printers.filter((printer) => {
    return (
      printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      printer.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'create table if not exists printers (id integer primary key not null, name text, ipAddress text, paperSize text, setting text);',
        [],
        () => {
          console.log('Table created');
        },
        (txObj, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const fetchPrinters = (setting) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from printers where setting = ?;',
        [setting],
        (_, { rows: { _array } }) => setPrinters(_array),
        (_, error) => console.error('Error ', error)
      );
    });
  };

  const handleSelectSetting = (setting) => {
    setSelectedSetting(setting);
    fetchPrinters(setting);
  };

  const handleEditPrinter = (printer) => {
    setCurrentPrinter(printer);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const openAddPrinterModal = () => {
    setCurrentPrinter({ id: null, name: '', ipAddress: '', paperSize: '80' });
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleSavePrinter = (printerData) => {
    const { name, ipAddress, paperSize } = printerData;

    if (!name || !ipAddress) {
      alert('Please fill in all fields.');
      return;
    }

    const query = isEditMode
      ? 'UPDATE printers SET name = ?, ipAddress = ?, paperSize = ? WHERE id = ?;'
      : 'INSERT INTO printers (name, ipAddress, paperSize, setting) VALUES (?, ?, ?, ?);';

    const params = isEditMode
      ? [name, ipAddress, paperSize, currentPrinter.id]
      : [name, ipAddress, paperSize, selectedSetting];

    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            fetchPrinters(selectedSetting);
            setModalVisible(false);
          } else {
            alert('Failed to save printer.');
          }
        },
        (_, error) => {
          console.error('Error saving printer', error);
          alert('An error occurred while saving the printer.');
        }
      );
    });
  };

  const handleDeletePrinter = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'delete from printers where id = ?;',
        [id],
        () => fetchPrinters(selectedSetting),
        (txObj, error) => console.error('Error ', error)
      );
    });
  };

  const groupPrintersByHeader = () => {
    const groupedPrinters = {};

    filteredPrinters.forEach((printer) => {
      const headerKey = printer.name.toLowerCase().includes(searchQuery.toLowerCase())
        ? 'Name'
        : printer.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
        ? 'IP Address'
        : 'Actions';

      if (!groupedPrinters[headerKey]) {
        groupedPrinters[headerKey] = [];
      }

      groupedPrinters[headerKey].push(printer);
    });

    return groupedPrinters;
  };

  const groupedPrinters = groupPrintersByHeader();

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Printer Settings</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search printers..."
          placeholderTextColor={colors.lightGrey}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      <View style={styles.settingsButtons}>
        {['Invoice', 'Kitchen', 'Report'].map((setting) => (
          <TouchableOpacity
            key={setting}
            style={[
              styles.settingButton,
              selectedSetting === setting && styles.selectedButton,
            ]}
            onPress={() => handleSelectSetting(setting)}
          >
            <Text style={styles.buttonText}>{setting}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={Object.entries(groupedPrinters)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item: [header, items] }) => (
          <View key={header}>
            {/* <Text style={styles.sectionHeader}>{header}</Text> */}
            {items.map((item) => (
              <View style={styles.listItem} key={item.id}>
                <View style={styles.listItemInfo}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.itemText}>IP: {item.ipAddress}</Text>
                  <Text style={styles.itemText}>Size: {item.paperSize}mm</Text>
                </View>
                <View style={styles.listItemButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPrinter(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePrinter(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={openAddPrinterModal}
      >
        <Text style={styles.addButtonText}>Add Printer</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <PrinterModal
            onSave={handleSavePrinter}
            printer={currentPrinter}
            isEditMode={isEditMode}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimar,
  },
  header: {
    // backgroundColor: colors.backgroundSecondary,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.secondary,
    fontSize: 16,
    color: colors.white
  },
  settingsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  settingButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  selectedButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  listItemInfo: {
    flex: 3,
  },
  itemText: {
    fontSize: 16,
    color: colors.white
  },
  listItemButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default PrinterSettingsScreen;

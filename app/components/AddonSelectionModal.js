import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons
import colors from '../config/colors';

const AddonSelectionModal = ({ isVisible, addons, onClose, onApply, initialSelectedAddons }) => {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [numColumns] = useState(3); // Default to 3 columns

  const toggleAddon = (addon) => {
    setSelectedAddons((prevSelectedAddons) => {
      const isAddonSelected = prevSelectedAddons.some((selectedAddon) => selectedAddon.id === addon.id);

      if (isAddonSelected) {
        return prevSelectedAddons.filter((selectedAddon) => selectedAddon.id !== addon.id);
      } else {
        // If the addon is not selected, set its quantity to 1
        addon.quantity = 1;
        return [...prevSelectedAddons, addon];
      }
    });
  };

  useEffect(() => {
    if (isVisible) {
      setSelectedAddons(initialSelectedAddons || []);
    }
  }, [isVisible, initialSelectedAddons]);

  const handleApplyAddons = () => {
    onApply(selectedAddons);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.crossButton} onPress={onClose}>
          <MaterialCommunityIcons name="close-circle" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Addons</Text>

          <FlatList
            data={addons}
            numColumns={3}
            keyExtractor={(addon, index) => (addon?.id ? addon.id.toString() : index.toString())}
            renderItem={({ item: addon }) => (
              <TouchableOpacity
                style={[
                  styles.addonItem,
                  selectedAddons.some((selectedAddon) => selectedAddon.id === addon.id)
                    ? styles.addonItemSelected
                    : {},
                ]}
                onPress={() => toggleAddon(addon)}
              >
                <Text style={styles.addonName}>{addon.name}</Text>
                <Text style={styles.addonPrice}>Price: SAR {addon.price}</Text>
                {selectedAddons.some((selectedAddon) => selectedAddon.id === addon.id) && (
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => addon.quantity > 1 && setSelectedAddons((prevSelectedAddons) => {
                      return prevSelectedAddons.map((selectedAddon) => {
                        if (selectedAddon.id === addon.id) {
                          selectedAddon.quantity -= 1;
                        }
                        return selectedAddon;
                      });
                    })}>
                      <MaterialCommunityIcons name="minus" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{addon.quantity || 0}</Text>
                    <TouchableOpacity onPress={() => setSelectedAddons((prevSelectedAddons) => {
                      return prevSelectedAddons.map((selectedAddon) => {
                        if (selectedAddon.id === addon.id) {
                          selectedAddon.quantity += 1;
                        }
                        return selectedAddon;
                      });
                    })}>
                      <MaterialCommunityIcons name="plus" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyAddons}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.backgroundSecondary,
    width: '50%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  addonItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addonSelected: {
    backgroundColor: colors.secondary,
  },
  addonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  addonPrice: {
    fontSize: 14,
    color: colors.white,
  },
  crossButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure the button appears above the modal content
    backgroundColor: 'transparent',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  addonSelectButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addonSelectText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  addonItemSelected: {
    backgroundColor: colors.secondary,
  },
  addonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantity: {
    fontSize: 16,
    color: colors.white,
    marginHorizontal: 8,
  },
});

export default AddonSelectionModal;

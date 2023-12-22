import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { getDiscountsData } from '../auth/dataStorage';
import colors from '../config/colors';
import AddonSelectionModal from './AddonSelectionModal'; // Import the AddonSelectionModal

import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons
const ItemDetailModal = ({ isVisible, item, onClose, onApplyDiscount, onApplyAddons }) => {
  const [discounts, setDiscounts] = useState([]);
  const [itemNote, setItemNote] = useState(item?.note || '');
  const [selectedDiscount, setSelectedDiscount] = useState(item?.discount || null);
  const [isAddonModalVisible, setAddonModalVisible] = useState(false); // State for the AddonSelectionModal
  const [selectedAddons, setSelectedAddons] = useState();

  useEffect(() => {
    if (isVisible) {
      getDiscountsData().then((fetchedDiscounts) => {
        if (fetchedDiscounts) {
          setDiscounts(fetchedDiscounts);
        }
      });
      // Reset the note and discount if the item changes
      setItemNote(item?.note || '');
      setSelectedDiscount(item?.discount || null);
    }
  }, [isVisible, item]);

  const toggleDiscount = (discount) => {
    if (selectedDiscount && selectedDiscount.id === discount.id) {
      setSelectedDiscount(null); // Unselect if the same discount is clicked again
    } else {
      setSelectedDiscount(discount); // Select the new discount
    }
  };

  const handleApply = () => {
    onApplyDiscount({ ...item, note: itemNote, discount: selectedDiscount});
    onClose(); // Close the modal after applying
  };

  const handleAddonSelection = () => {
    setAddonModalVisible(true);
  };

  const handleApplyAddons = (selectedAddons) => {
    // Create a new object with itemId and addons array
    const updatedAddons = {
      
        itemId: item.id,
        addons: selectedAddons,
      
  }
  
    setSelectedAddons(selectedAddons);
    onApplyAddons(updatedAddons)
  };
  

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close-circle" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.itemName}>{item?.name}</Text>
          <KeyboardAvoidingView>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note for this item"
              placeholderTextColor={colors.mediumGrey}
              value={itemNote}
              onChangeText={setItemNote}
              multiline
              numberOfLines={4}
            />
          </KeyboardAvoidingView>

          

          <FlatList
            data={discounts}
            keyExtractor={(discount) => discount.id.toString()}
            numColumns={3}
            renderItem={({ item: discount }) => (
              <TouchableOpacity 
                style={[styles.discountItem, selectedDiscount?.id === discount.id ? styles.discountItemSelected : {}]} 
                onPress={() => toggleDiscount(discount)}
              >
                <View style={styles.discountCard}>
                  <Text style={styles.discountName}>{discount.name}</Text>
                  <Text style={styles.discountRate}>
                    {discount.discount_type === 'Percentage' ? `${discount.rate}%` : `SAR ${discount.rate}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

<View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
            {/* Addons button */}
            <TouchableOpacity style={styles.addonsButton} onPress={handleAddonSelection}>
              <Text style={styles.buttonText}>Addons</Text>
            </TouchableOpacity>
          </View>

          <AddonSelectionModal
            isVisible={isAddonModalVisible}
            addons={item?.productsAddons || []} // Pass the addons data to the modal
            onClose={() => setAddonModalVisible(false)}
            onApply={handleApplyAddons}
            initialSelectedAddons={selectedAddons}
          />
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
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: colors.backgroundPrimary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: colors.white
  },
  discountItem: {
    flex: 1,
    margin: 5,
  },
  discountCard: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 10,
    alignItems: 'center',
  },
  discountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  discountRate: {
    fontSize: 16,
    color: colors.white,
  },
  discountItemSelected: {
    backgroundColor: colors.lightPrimary, // Different background color to indicate selection
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
  addonsButton: {
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure the button appears above the modal content
  },
});

export default ItemDetailModal;

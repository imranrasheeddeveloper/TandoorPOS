import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { getDiscountsData } from '../auth/dataStorage';
import colors from '../config/colors';

const ItemDetailModal = ({ isVisible, item, onClose, onApplyDiscount }) => {
  const [discounts, setDiscounts] = useState([]);
  const [itemNote, setItemNote] = useState(item?.note || '');
  const [selectedDiscount, setSelectedDiscount] = useState(item?.discount || null);

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
    onApplyDiscount({ ...item, note: itemNote, discount: selectedDiscount });
    onClose(); // Close the modal after applying
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.itemName}>{item?.name}</Text>
          <KeyboardAvoidingView>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note for this item"
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
    width: '80%',
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
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
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
  discountItemSelected: {
    backgroundColor: colors.secondary,
  },
  
});

export default ItemDetailModal;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
    getDiscountsData,
  } from '../auth/dataStorage';
import axios from 'axios';
import colors from '../config/colors';

const DiscountListModal = ({ isVisible, applyDiscount , onClose }) => {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
   
      getDiscountsData().then((discountsData) => {
        if (discountsData) {
          // Use discountsData in your app
          setDiscounts(discountsData);
        }
      });
  }, []);

  const applySelectedDiscount = (discount) => {
    setSelectedDiscount(discount);
    applyDiscount(discount); // Pass the selected discount back to the parent component
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Available Discounts</Text>
          <FlatList
            data={discounts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.discountItem}
                onPress={() => applySelectedDiscount(item)} // Apply the selected discount
              >
                <View style={styles.discountCard}>
                  <Text style={styles.discountName}>{item.name}</Text>
                  <Text style={styles.discountRate}>
                    {item.discount_type === 'Percentage'
                      ? `${item.rate}%`
                      : `SAR ${item.rate}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    marginBottom: 10,
    color: 'white'
  },
  discountItem: {
    flex: 1,
    margin: 5,
  },
  discountCard: {
    borderWidth: 1,
    borderRadius: 5,
    color: colors.primary,
    padding: 10,
    alignItems: 'center',
  },
  discountName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.white
  },
  discountRate: {
    fontSize: 16,
    color: colors.primary
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white'
  },
});

export default DiscountListModal;

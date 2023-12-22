
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  StyleSheet, Image, TextInput
} from 'react-native';
import AddonsList from '../components/AddonsList'; // Import the AddonsList component

// Assuming these functions are correctly implemented in your dataStorage module
import { storeOrderData, getOrdersData , updateOrderState} from '../auth/sqliteHelper';

import CashChangeModal from '../components/CashChangeModal';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Hold');
  const [searchText, setSearchText] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigation = useNavigation(); 

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      await updateOrderState(selectedOrder.orderNumber, 'Canceled');
      setIsModalVisible(false); // Close the modal after updating
      fetchOrders(); // Fetch updated orders list
    }
  };
  
  const handleCompleteOrder = async () => {
    if (selectedOrder) {
      await updateOrderState(selectedOrder.orderNumber, 'Completed');
      setIsModalVisible(false); // Close the modal after updating
      fetchOrders(); // Fetch updated orders list
      createPOSOrder(selectedOrder)
    }
  };

  async function createPOSOrder(orderData) {
    const apiUrl = 'https://fnb.glorek.com/api/createPOSOrder';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw error;
    }
  }
  

  useEffect(() => {
    fetchOrders();
  }, [selectedFilter, searchText]);
  

  useEffect(() => {
    if (!Array.isArray(orders)) {
      console.error('Orders data is not an array:', orders);
      return;
    }
  
    const filtered = orders
      .filter(order => order.orderState === selectedFilter)
      .filter(order => {
        const orderData = `${order.orderNumber} ${order.orderDate} ${order.orderTime}`;
        return orderData.toLowerCase().includes(searchText.toLowerCase());
      });
    setFilteredOrders(filtered);
  }, [searchText, orders, selectedFilter]);
  

      const fetchOrders = async () => {
        getOrdersData((ordersData) => {
          console.log("ordersData", ordersData)
          if (!Array.isArray(ordersData)) {
            console.error('Orders data is not an array:', ordersData);
            return;
          }
      
          const filteredData = ordersData
            .filter(order => order.orderState === selectedFilter)
            .filter(order => {
              const orderData = `${order.orderNumber} ${order.orderDate} ${order.orderTime}`;
              return orderData.toLowerCase().includes(searchText.toLowerCase());
            });
      
          setOrders(ordersData);
          setFilteredOrders(filteredData);
        });
      };
  

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleEditOrder = (order) => {
    // Navigate to POSScreen with order data
    // This depends on your navigation setup
    navigation.navigate('POSScreen', { orderToEdit: order });

  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.row} onPress={() => openOrderDetails(item)}>
        <Text style={styles.cell}>{item.orderNumber}</Text>
        <Text style={styles.cell}>{item.orderTime}</Text>
        <Text style={styles.cell}>{item.orderDate}</Text>
        <Text style={styles.cell}> {item.client && item.client.text ? item.client.text : "N/A"}</Text>
        <Text style={styles.cell}>{item.subtotal}</Text>
        <Text style={styles.cell}>{item.total}</Text>
        {item.orderState === 'Hold' && (
        <TouchableOpacity onPress={() => handleEditOrder(item)}>
          <Text>Edit</Text>
        </TouchableOpacity>
      )}
        
        
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Orders</Text>

      <View style={styles.filterButtonsContainer}>
        {['Hold', 'Completed', 'Canceled'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilterButton
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.selectedFilterButtonText
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Orders"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Order #</Text>
        <Text style={styles.headerCell}>Time</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Client</Text>
        <Text style={styles.headerCell}>Subtotal</Text>
        <Text style={styles.headerCell}>Total</Text>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderNumber.toString()}
        renderItem={renderItem}
      />


      {/* Order Details Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        {/* Modal Content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Order Details</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <MaterialCommunityIcons name="close-circle" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
          {/* Display order details here */}
          <Text style={styles.modalOrderNumberText}>{selectedOrder?.orderNumber}</Text>
          {/* Display more order details here */}
          

            <FlatList
              data={selectedOrder?.orderItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                 <Image
                    source={{ uri: `https://fnb.glorek.com/${item.thumbnail}` }}
                    style={styles.itemImage}
                  />
                  
                  <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemInfo}>Quantity: {item.quantity}</Text>
                      <Text style={styles.itemInfo}>Price: {item.priceType === 'percentage' ? `${item.price}%` : `SAR ${item.price}`}</Text>
                      {item.discount && (
                        <Text style={styles.itemInfo}>Discount: {item.discount.rate}%</Text>
                      )}
                      {item.note && (
                        <Text style={styles.itemInfo}>Note: {item.note}</Text>
                      )}
                      <AddonsList addons={item.addons} />
                    </View>
                    

                </View>
              )}
              numColumns={2} // Set for a two-column grid
              columnWrapperStyle={{ justifyContent: 'space-between' }} // Adjust for spacing
            />
          {/* Display other order details like subtotal, vat, discount, order note */}
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.gridLabel}>Subtotal:</Text>
              <Text style={styles.gridValue}>SAR {selectedOrder?.subtotal.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.gridLabel}>VAT:</Text>
              <Text style={styles.gridValue}>SAR {selectedOrder?.vat.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.gridLabel}>Discount:</Text>
              <Text style={styles.gridValue}>SAR {selectedOrder?.discountAmount.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.orderNote}>
            <Text style={{color: 'lightgrey' , fontSize : 18 , fontWeight: 'bold'}}>Order Note {selectedOrder?.orderNote}</Text>
          </View>


          {/* Buttons for Cancel and Complete */}
          {selectedOrder && selectedOrder.orderState !== 'Canceled' && selectedOrder.orderState !== 'Completed' && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
              >
                <Text style={styles.buttonText}>Cancel Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteOrder}
              >
                <Text style={styles.buttonText}>Complete Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: 'lightgrey',
    marginBottom: 25,
    marginTop: 20
   
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginHorizontal: 5,
  },
  selectedFilterButton: {
    backgroundColor: colors.secondary,
  },
  filterButtonText: {
    color: 'lightgrey',
    fontSize: 16,
  },
  selectedFilterButtonText: {
    color: 'white',
  },
  searchContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: colors.backgroundSecondary,
    fontSize: 16,
    color: 'lightgrey'
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'lightgrey',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightgrey',
    textAlign : 'center',
  },
  
  closeButton: {
    fontSize: 26,
    color: '#34495E',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
  },
  cancelButton: {
    backgroundColor: '#E74C3C', // A more refined red
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    width: '45%',
  },
  completeButton: {
    backgroundColor: '#2ECC71', // A vibrant, yet not too bright green
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    width: '45%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    color: 'lightgrey'
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: '900',
    color: 'lightgrey'
  },
  modalOrderNumberText: {
    fontSize: 15,
    fontWeight: '900',
    color: 'lightgrey'
  },
  closeButton: {
    fontSize: 24,
    color: '#34495E',
  },
  orderDetails: {
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  orderDetailText: {
    fontSize: 16,
    color: 'lightgrey',
    marginBottom: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: '48%',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
    marginBottom: 5,
  },
  itemInfo: {
    fontSize: 16,
    color: 'lightgrey',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#3498DB', // Replace with your accent color
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  summaryCard: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 30,
    color: 'lightgrey',
    fontWeight: '700',
  },
  gridValue: {
    fontSize: 35,
    fontWeight: '900',
    color: 'lightgrey',
  },
  orderNote: {
    marginTop: 10,
    fontSize: 18,
    color: 'lightgrey',
    fontStyle: 'italic',
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.backgroundPrimary,
  },


  //List stle
});

export default OrderScreen;

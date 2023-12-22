import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import {
    getCategoriesData,
    getAllProducts,
    storeOnHoldOrders,
    getOnHoldOrders,
   
  } from '../auth/dataStorage';
  import { Swipeable } from 'react-native-gesture-handler';
  //import printKOT from '../components/KOTPrinter';
import { storeOrderData, getOrdersData } from '../auth/sqliteHelper';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Screen from '../components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
const windowWidth = Dimensions.get('window').width;
import DiscountListModal from '../components/DiscountList';
import ItemDetailModal from '../components/ItemDetailModal'; 
import CashChangeModal from '../components/CashChangeModal';
import ClientsDropdown from '../components/ClientsDropdown';
const POSScreen = ({ }) => {
  // const orderToEdit = route?.params?.orderToEdit;

  // const initialCart = orderToEdit || [];
 
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [numColumns, setNumColumns] = useState(3); // Number of columns for the grid

  // Format the date and time
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // Declare isModalVisible
  const [orderNote, setOrderNote] = useState('');
  const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clientForOrder, setClientForOrder] = useState({}); 
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  const selectClientForOrder = (client) => {
    console.log(client)
    setClientForOrder(client)
  };

  useEffect(() => {
    calculateCartTotals();
  }, [cart]);

  const renderRightActions = (progress, dragX, item) => {
    const onPress = () => {
      // Call a function to handle item removal
      removeFromCart(item.id);
    };

    return (
      <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setItemDetailModalVisible(true);
  };

  const handleApplyDiscount = (updatedItem) => {
    const updatedCart = cart.map(cartItem => {
      if (cartItem.id === updatedItem.id) {
        // Update the item with the new discount and optionally with the note
        return { 
          ...cartItem, 
          discount: updatedItem.discount, // Update discount
          note: updatedItem.note || cartItem.note // Update note if provided, else keep existing
        };
      }
      return cartItem;
    });
  
    setCart(updatedCart);
    setItemDetailModalVisible(false); // Close the modal after updating the item
    calculateCartTotals();
  };
  
  

  const handleCloseModal = () => {
    setItemDetailModalVisible(false);
  };

  const handleApplyAddons = (selectedAddons) => {
    const updatedCart = cart.map(cartItem => {
      if (cartItem.id === selectedAddons.itemId) {
        return { 
          ...cartItem, 
          addons: selectedAddons.addons
        };
      }
      return cartItem;
    });
  
    setCart([...updatedCart]);
    calculateCartTotals();
  };
  
  
  
  

  const removeFromCart = (productId) => {
    // Remove the item from the cart
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    calculateCartTotals();
  };


    const holdOrder = () => {
      const newOrder = createOrder(cart, selectedOrderOption, subtotal, vat, discountAmount, total, orderNote , 'Hold');
     // printKOT(newOrder);
      storeOrderData(newOrder);
      //createPOSOrder(newOrder)
  
    }

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
    
  
  const generateOrderNumber = () => {
    const timestamp = Date.now();
    return `ORDER-${timestamp}`;
  };

  const createOrder = (cart, selectedOrderOption, subtotal, vat, discountAmount, total, orderNote , orderState) => {
    const currentDate = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(currentDate);
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(currentDate);
  
    const orderNumber = generateOrderNumber(); // Generate a unique order number
  
    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      note: item.note,
      discount: item.discount,
      addons: item.addons
    }));
  
    const newOrder = {
      orderNumber,
      orderDate: formattedDate, // Set the formatted date
      orderTime: formattedTime, // Set the formatted time
      orderType: selectedOrderOption,
      orderItems,
      subtotal,
      vat,
      discountAmount,
      total,
      orderNote,
      orderState: orderState,
      client: clientForOrder
    };
    setIsModalVisible(false)
    setCart([]); // Clear the cart
    setSelectedDiscount(null); // Clear the selected discount
    setDiscountAmount(0); // Reset discount amount to 0
    setIsModalVisible(false); // Close the modal
    setSelectedOrderOption('dineIn'); // Reset order type to 'dineIn'
    setOrderNote(''); // Clear the order note input field
    return newOrder;
  };

  const applyDiscount = (discount) => {
    setSelectedDiscount(discount);
    setDiscountModalVisible(false); // Close the discount modal

    if (cart.length === 0) {
      return;
    }

    // const subtotal = calculateCartTotals();

    if (discount.discount_type === 'Percentage') {
      const discountValue = (subtotal * discount.rate) / 100;
      setDiscountAmount(discountValue);
    } else if (discount.discount_type === 'Fixed') {
      // Handle fixed amount discounts
      const discountValue = discount.rate;
      setDiscountAmount(discountValue);
    }
  };

  const openDiscountModal = () => {
    setDiscountModalVisible(true);
  };

  // Function to close the modal
  const closeDiscountModal = () => {
    setDiscountModalVisible(false);
  };

  const confirmOrder = () => {
    const newOrder = createOrder(cart, selectedOrderOption, subtotal, vat, discountAmount, total, orderNote , 'Completed');
    storeOrderData(newOrder);

  }
  const calculateCartSubtotal = (cart) => {
    const subtotal = calculateCartSubtotal(cart);

    return subtotal;
  };

 
 
  const calculateCartTotals = () => {
    let newSubtotal = 0;
    let newTotal = 0;
    let newVat = 0;
  
    if (cart.length > 0) {
      cart.forEach((item) => {
        // Check if item.price is valid and convert it to a number
        const itemPrice = parseFloat(item.price) || 0;
  
        // Calculate the item's total price without the discount
        let itemTotal = itemPrice;
  
        if (item.discount) {
          if (item.discount.discount_type === 'Percentage') {
            // Check if item.discount.rate is valid and convert it to a number
            const discountRate = parseFloat(item.discount.rate) || 0;
            // Apply percentage discount
            itemTotal -= (discountRate / 100) * itemPrice;
          } else if (item.discount.discount_type === 'Fixed') {
            // Check if item.discount.rate is valid and convert it to a number
            const discountAmount = parseFloat(item.discount.rate) || 0;
            // Apply fixed amount discount
            itemTotal -= discountAmount;
          }
        }
  
        // Calculate the total price for the addons
        let addonsTotal = 0;
  
        if (item.addons && item.addons.length > 0) {
          addonsTotal = item.addons.reduce(
            (acc, addon) => {
              // Check if addon.price and addon.quantity are valid and convert them to numbers
              const addonPrice = parseFloat(addon.price) || 0;
              const addonQuantity = parseInt(addon.quantity) || 0;
              return acc + addonPrice * addonQuantity;
            },
            0
          );
        }
  
        // Calculate the item's total price including addons
        const itemTotalWithAddons = itemTotal + addonsTotal;
  
        // Check if item.quantity is valid and convert it to a number
        const itemQuantity = parseInt(item.quantity) || 0;
        newSubtotal += itemTotalWithAddons * itemQuantity;
  
        // Log values for debugging
        console.log(`Item: ${item.name}`);
        console.log(`Item Total: ${itemTotal}`);
        console.log(`Addons Total: ${addonsTotal}`);
        console.log(`Item Total with Addons: ${itemTotalWithAddons}`);
        console.log(`Item Quantity: ${itemQuantity}`);
        console.log(`Current Subtotal: ${newSubtotal}`);
      });
  
      // Calculate VAT based on the subtotal
      newVat = newSubtotal * 0.15; // 15% VAT rate
    }
  
    // Calculate discountAmount (assuming you have it defined somewhere in your code)
    const discountAmount = 0; // You can replace this with your actual discount calculation
  
    newTotal = newSubtotal + newVat;
  
    // Log final values for debugging
    console.log(`New Subtotal: ${newSubtotal}`);
    console.log(`New VAT: ${newVat}`);
    console.log(`New Total: ${newTotal}`);
  
    // Update the state values for subtotal, vat, and total
    setSubtotal(newSubtotal);
    setVat(newVat);
    setTotal(newTotal);
  
    return { subtotal: newSubtotal, vat: newVat, total: newTotal };
  };
  
  
  
  
  
  

  // const { subtotal, vat } = calculateCartTotals();
  // const total = subtotal + vat - discountAmount;
  
  // Order options
  const orderOptions = [
    { id: 'dineIn', title: 'Dine In' },
    { id: 'takeAway', title: 'Take Away' },
    { id: 'delivery', title: 'Delivery' },
  ];
  const [selectedOrderOption, setSelectedOrderOption] = useState('dineIn');

  useEffect(() => {
    fetchCategories()
    // console.log(initialCart)
    // setCart(initialCart)
    // Recalculate discount whenever the cart or selectedDiscount changes
    if (cart.length > 0 && selectedDiscount) {
      const subtotal = calculateCartSubtotal(cart);

      if (selectedDiscount.discount_type === 'Percentage') {
        const discountValue = (subtotal * selectedDiscount.rate) / 100;
        setDiscountAmount(discountValue);
      } else if (selectedDiscount.discount_type === 'Fixed') {
        // Handle fixed amount discounts
        const discountValue = selectedDiscount.rate;
        setDiscountAmount(discountValue);
      }
    }
  }, [cart, selectedDiscount]);

  const fetchCategories = () => {

        getCategoriesData().then((categoriesData) => {
            if (categoriesData) {
                setCategories(categoriesData.reverse());
                setSelectedCategoryId(categoriesData[0].id)
                fetchProductsByCategory(categoriesData[0].id)
            }
          });
  
  };



  const fetchProductsByCategory = async (categoryId) => {
    // Retrieve all products data from local storage
    const allProducts = await getAllProducts();
  
    if (allProducts) {
      // Filter the products based on the provided categoryId
      const filteredProducts = allProducts.filter((product) => product.category_id === categoryId);
  
      // Now you have the filtered products
      setProducts(filteredProducts);
      
    } else {
      console.error('No products data available.');
      return [];
    }
  };

  

  

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    fetchProductsByCategory(categoryId);
  };

  const addToCart = (product) => {
    console.log(product)
    const existingProduct = cart.find(item => item.id === product.id);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        note: '', 
        discount: null 
      }]);
    }
    calculateCartTotals();
  };
  

  const decreaseQuantity = (productId) => {
    // Decrease the quantity of a product in the cart
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        item.quantity -= 1;
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCart(updatedCart);
    calculateCartTotals();
  };

  const handleOrderOptionSelect = (optionId) => {
    setSelectedOrderOption(optionId);
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      <View style={styles.container}>
        {/* Products List */}
        <View style={styles.productList}>
          {/* Title and Date/Time */}
          <View style={styles.header}>
            <Text style={styles.title}>Tandoor Fusion</Text>
            <Text style={styles.dateTime}>{formattedDateTime}</Text>
          </View>

          <View style={styles.categoryList}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCategorySelect(item.id)}
                  style={[
                    styles.categoryItem,
                    item.id === selectedCategoryId && styles.selectedCategoryItem,
                    { marginRight: 10 }, // Add marginRight for space between items
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      item.id === selectedCategoryId && styles.selectedCategoryText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => `${item.id}-${numColumns}`}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => addToCart(item)}
              >
                <Image
                  source={{ uri: `https://fnb.glorek.com/${item.thumbnail}` }}
                  style={styles.productThumbnail}
                />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{`SAR ${item.price}`}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Cart */}
        <View style={styles.cart}>
          <View style={styles.cartHeader}>
            <View style={styles.cartText}>
            <Text style={styles.orderNumber}>Cart</Text>
            <ClientsDropdown 
                onSelect={(client) => selectClientForOrder(client)}
              />
            </View>
            
            <View style={styles.orderOptions}>
              {orderOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOrderOptionSelect(option.id)}
                  style={[
                    styles.orderOptionItem,
                    option.id === selectedOrderOption && styles.selectedOrderOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.orderOptionText,
                      option.id === selectedOrderOption && styles.selectedOrderOptionText,
                    ]}
                  >
                    {option.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cart Items */}
          {cart.length === 0 ? (
          <Text style={styles.emptyCartMessage}>Add items to cart...</Text>
        ) : (
          <FlatList
  data={cart}
  keyExtractor={(item) => `${item.id}-${numColumns}`}
  renderItem={({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
    >
      <View style={styles.cartItem}>
        <View style={styles.cartItemNameContainer}>
          <TouchableOpacity onPress={() => handleSelectItem(item)}>
            <Text style={styles.cartItemName}>{item.name}</Text>
            <Text style={styles.itemNote}>{item.note}</Text>
            {item.discount && (
              <Text style={styles.itemDiscount}>
                Discount: {item.discount.discount_type === 'Percentage'
                  ? `${item.discount.rate}%`
                  : `SAR ${item.discount.rate}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
            <Icon name="remove-circle" size={24} color="red" />
          </TouchableOpacity>
          <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => addToCart(item)}>
            <Icon name="add-circle" size={24} color="green" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cartItemTotal}>
          SAR {((item.price - (item.discount?.discount_type === 'Percentage'
            ? (item.discount.rate / 100) * item.price
            : item.discount?.rate || 0)) * item.quantity).toFixed(2)}
        </Text>
      </View>
    </Swipeable>
  )}
/>

          )}
          {/* Order Note */}
          <TextInput
            style={styles.orderNote}
            placeholder="Add order note...."
            placeholderTextColor="grey"
            value={orderNote}
            onChangeText={text => setOrderNote(text)} // Handle changes to the text input
            multiline={true}
          />


          {/* Subtotal, Total, VAT */}
            <View style={styles.cartFooter}>
              <View style={styles.cartFooterItem}>
                <Text style={styles.cartFooterLabel}>Subtotal:</Text>
                <Text style={styles.cartFooterValue}>{`SAR ${subtotal.toFixed(2)}`}</Text>
                </View>
                <View style={styles.cartFooterItem}>
                <Text style={styles.cartFooterLabel}>VAT (15%):</Text>
                <Text style={styles.cartFooterValue}>{`SAR ${vat.toFixed(2)}`}</Text>
                </View>
                <View style={styles.cartFooterItem}>
                <Text style={styles.cartFooterLabel}>Discount:</Text>
                <Text style={styles.cartFooterValue}>{`- SAR ${discountAmount.toFixed(2)}`}</Text>
                </View>
                <View style={styles.cartFooterItem}>
                <Text style={styles.cartFooterLabel}>Total:</Text>
                <Text style={styles.cartFooterValue}>{`SAR ${total.toFixed(2)}`}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.addButtonsContainer}>
                {/* Add Order Button */}
                {/* Add Order Button */}
              <TouchableOpacity
                style={[styles.addButton, { opacity: cart.length === 0 ? 0.5 : 1 }]}
                onPress={() => setIsModalVisible(true)} // Update isModalVisible
                disabled={cart.length === 0}
              >
                <Text style={styles.addButtonText}>Add Order</Text>
              </TouchableOpacity>

              

                {/* Add Discount Button */}
                <TouchableOpacity
                 
                  style={[
                    styles.addButton,
                    { opacity: cart.length === 0 ? 0.5 : 1 } // Change opacity based on cart length
                  ]}
                  onPress={() => setDiscountModalVisible(true)}
                  disabled={cart.length === 0}
                >
                  <Text style={styles.addButtonText}>Discount</Text>
                </TouchableOpacity>
              </View>

              {/* Hold Button */}
              {selectedOrderOption === 'dineIn' && (
                <TouchableOpacity
                style={[
                  styles.holdButton,
                  { opacity: cart.length === 0 ? 0.5 : 1 } // Change opacity based on cart length
                ]}
                onPress={() => holdOrder()}
                disabled={cart.length === 0}
              >
                <Text style={styles.holdButtonText}>Hold</Text>
                </TouchableOpacity>
              )}
            </View>
        </View>
        <DiscountListModal
          isVisible={isDiscountModalVisible}
          applyDiscount={applyDiscount}
          onClose={closeDiscountModal} // Pass the closeDiscountModal function to the modal
        />
         <CashChangeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmOrder} // Update isModalVisible
        total={total} // Pass the total amount to the modal
      />
     <ItemDetailModal
        isVisible={itemDetailModalVisible}
        item={selectedItem}
        onClose={handleCloseModal}
        onApplyDiscount={handleApplyDiscount}
        onApplyAddons={handleApplyAddons} // Add this prop to receive selected addons
      />


      </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
 
    container: {
        flex: 1,
        flexDirection: 'row',
      },
      categoryList: {
        padding: 10,
      },
      categoryItem: {
        padding: 10,
       paddingHorizontal : 20
      },
      categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      selectedCategoryText: {
        color: 'lightgrey',
      },
      productList: {
        flex: 2,
        padding: 10,
      },
      productItem: {
        flex: 1,
        alignItems: 'center',
        margin: 8,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        padding: 10,
        elevation: 3,
      },
      productThumbnail: {
        width: 100,
        height: 100,
        marginBottom: 5,
        borderRadius: 50,
        resizeMode: 'center',
      },
      
      cart: {
        flex: 1,
        backgroundColor: '#1F1D2B',
        padding: 15,
        borderRadius: 15
      },
      cartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'lightgrey',
        marginBottom: 10,
      },
      cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      cartItemNameContainer: {
        flex: 1,
        flexDirection: 'column', // Stack name and quantity controls vertically
      },
      cartItemName: {
        fontSize: 16,
        color: 'lightgrey',
      },
      quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      cartItemQuantity: {
        fontSize: 18,
        color: 'lightgrey',
        marginHorizontal: 10,
      },
      cartItemTotal: {
        fontSize: 15,
        color: 'lightgrey',
        fontWeight: 'bold',
      },
      
      productItem: {
        flex: 1,
        alignItems: 'center',
        margin: 8,
        backgroundColor: '#1F1D2B',
        borderRadius: 10,
        padding: 10,
        elevation: 3,
      },
      productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'lightgrey',
        textAlign : 'center',
        marginTop: 10,
      },
      productPrice: {
        paddingTop: 10,
        fontSize: 16,
        color: '#F4C542',
      },
      selectedCategoryItem: {
        backgroundColor: colors.secondary,
        borderRadius: 5,
      },
      categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'lightgrey',
      },
      header: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: 10,
      },
      title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'lightgrey',
      },
      dateTime: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'lightgrey',
      },
      searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        color: 'lightgrey',
      },

  // Cart Header Styles
  cartHeader: {
    flexDirection: 'colunm',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
 
  cartText: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
},

  orderNumber: {
    flex : 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  orderOptions: {
    flexDirection: 'row',
  },
  orderOptionItem: {
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  orderOptionText: {
    fontSize: 14,
    color: colors.secondary,
  },
  selectedOrderOption: {
    backgroundColor: colors.secondary,
  },
  selectedOrderOptionText: {
    color: 'lightgrey',
    
  },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartItemNameContainer: {
    flex: 1,
    flexDirection: 'column', // Stack name and quantity controls vertically
  },
  cartItemName: {
    fontSize: 16,
    color: 'lightgrey',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemQuantity: {
    fontSize: 18,
    color: 'lightgrey',
    marginHorizontal: 10,
  },
  cartItemTotal: {
    fontSize: 15,
    color: 'lightgrey',
    fontWeight: 'bold',
  },
  orderNote: {
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
    height: 60,
    color: 'lightgrey',
  },
  cartFooter: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cartFooterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartFooterLabel: {
    fontSize: 17,
    color: 'grey',
  },
  cartFooterValue: {
    fontSize: 17,
    color: 'grey',
    fontWeight: 'bold',
  },
  
  addOrderButton: {
    backgroundColor: colors.secondary,
    borderRadius: 5,
    padding:10,
    alignItems: 'center',
    marginTop: 10,
  },
  addOrderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  addDiscountButton: {
    backgroundColor: colors.secondary,
    borderRadius: 5,
    padding:10,
    alignItems: 'center',
    marginTop: 10,
  },
  addDiscountButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  buttonContainer: {
    flexDirection: 'column', // Column layout to stack buttons vertically
    alignItems: 'center', // Center buttons horizontally
  },
  addButtonsContainer: {
    flexDirection: 'row', // Row layout to place "Add Order" and "Add Discount" buttons side by side
  },
  addButton: {
    flex: 1, // Equal flex for both "Add Order" and "Add Discount" buttons
    backgroundColor: colors.secondary,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    marginRight: 5, // Add some margin between the buttons
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  holdButton: {
    
    backgroundColor: colors.green,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    width : '100%'
  },
  holdButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
  },

  emptyCartMessage: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    alignItems : 'center'
  },

  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%', // Make sure the height matches the cart item
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemNote: {
    color: 'grey',
    fontSize: 12,
  },
  itemDiscount: {
    color: 'green',
    fontSize: 12,
  },
  dropdownContainer: {
    flex: 1,
    paddingHorizontal: 10,
    // Any additional styling for the dropdown container
  },
  
});

export default POSScreen;


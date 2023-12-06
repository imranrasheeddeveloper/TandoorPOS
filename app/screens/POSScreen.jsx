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
} from 'react-native';
import {
    getCategoriesData,
    getAllProducts
   
  } from '../auth/dataStorage';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Screen from '../components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
const windowWidth = Dimensions.get('window').width;
import DiscountListModal from '../components/DiscountList';
import CashChangeModal from '../components/CashChangeModal';
const POSScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [numColumns, setNumColumns] = useState(3); // Number of columns for the grid
  const token = 'YOUR_BEARER_TOKEN'; // Replace with your actual bearer token
  // Format the date and time
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // Declare isModalVisible
  const [orderNote, setOrderNote] = useState('');
  const order = {
    orderNumber: '', // You can generate a unique order number here
    dateTime: '', // Formatted date and time
    orderType: '', // Dine In, Take Away, or Delivery
    orderItems: [], // Array of order items
    subtotal: 0, // Subtotal amount
    vat: 0, // VAT amount
    discountAmount: 0, // Discount amount
    total: 0, // Total amount
    orderNote: '', // Order notes
    
  };

  const generateOrderNumber = () => {
    // Generate a unique order number here
    // You can use a combination of timestamps, random numbers, or any logic you prefer
    // For simplicity, let's use a timestamp as an example
    const timestamp = Date.now();
    return `ORDER-${timestamp}`;
  };

  const createOrder = (cart, selectedOrderOption, subtotal, vat, discountAmount, total, orderNote) => {
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
  
    const orderNumber = generateOrderNumber(); // You can implement this function
  
    const orderItems = cart.map((item) => ({
      id: item.id, // Assuming each item has an ID
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const newOrder = {
      orderNumber,
      dateTime: formattedDateTime,
      orderType: selectedOrderOption,
      orderItems, // Include order items in the order object
      subtotal,
      vat,
      discountAmount,
      total,
      orderNote,
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

    const subtotal = calculateCartSubtotal(cart);

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
    const newOrder = createOrder(cart, selectedOrderOption, subtotal, vat, discountAmount, total, orderNote);
    console.log('newOrder' , newOrder)

  }
  const calculateCartSubtotal = (cart) => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

 
 
// Calculate Subtotal, VAT, and Total
const calculateCartTotals = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const vat = subtotal * 0.15; // 15% VAT rate
    return { subtotal, vat };
  };
  const { subtotal, vat } = calculateCartTotals();
  const total = subtotal + vat - discountAmount;
  
  // Order options
  const orderOptions = [
    { id: 'dineIn', title: 'Dine In' },
    { id: 'takeAway', title: 'Take Away' },
    { id: 'delivery', title: 'Delivery' },
  ];
  const [selectedOrderOption, setSelectedOrderOption] = useState('dineIn');

  useEffect(() => {
    fetchCategories()
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

//   const fetchProductsByCategory = (categoryId) => {
//     const requestData = {
//       category_id: categoryId,
//     };

//     axios.post('https://fnb.glorek.com/api/getExpenceItemsByCategory', requestData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(response => {
//         setProducts(response.data.data);
//       })
//       .catch(error => {
//         console.error('Error fetching products:', error);
//       });
//   };

  // Fetch products by category_id

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
    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      // Increase the quantity if the product is already in the cart
      existingProduct.quantity += 1;
      setCart([...cart]);
    } else {
      // Add the product to the cart with a quantity of 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
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
  };

  const handleOrderOptionSelect = (optionId) => {
    setSelectedOrderOption(optionId);
  };

  return (
    <Screen style={styles.screen}>
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
            <Text style={styles.orderNumber}>Order #12345</Text>
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
          <FlatList
            data={cart}
            keyExtractor={(item) => `${item.id}-${numColumns}`}
            renderItem={({ item }) => (
                <View style={styles.cartItem}>
                <View style={styles.cartItemNameContainer}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
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
                <Text style={styles.cartItemTotal}>{`SAR ${item.price * item.quantity}`}</Text>
              </View>              
            )}
          />

          {/* Order Note */}
          <TextInput
            style={styles.orderNote}
            placeholder="Add order note...."
            placeholderTextColor="grey"
            value={orderNote}
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
          {/* Add Order Button */}
          <TouchableOpacity
                style={styles.addOrderButton}
                onPress={() => setIsModalVisible(true)} // Update isModalVisible
            >
                <Text style={styles.addOrderButtonText}>Add Order</Text>
            </TouchableOpacity>
          {/* Add Discount Button */}
          <TouchableOpacity
            style={styles.addDiscountButton}
            onPress={() => setDiscountModalVisible(true)}
            disabled={cart.length === 0}
          >
            <Text style={styles.addDiscountButtonText}>Add Discount</Text>
          </TouchableOpacity>
        </View>



          
        </View>
        <DiscountListModal
          isVisible={isDiscountModalVisible}
          applyDiscount={applyDiscount}
          onClose={closeDiscountModal} // Pass the closeDiscountModal function to the modal
        />
         <CashChangeModal
        isVisible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        onConfirm={confirmOrder} // Update isModalVisible
        total={total} // Pass the total amount to the modal
      />
      </View>
      
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
  orderNumber: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  
  },
});

export default POSScreen;

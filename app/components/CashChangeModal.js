import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

const CashChangeModal = ({ isVisible, onClose, onConfirm, total }) => {
  const [receivedCash, setReceivedCash] = useState('');
  const [cashAmount, setCashAmount] = useState(0);
  const [creditCardAmount, setCreditCardAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    calculateChange();
  }, [receivedCash, cashAmount, creditCardAmount, paymentMethod]);

  const calculateChange = () => {
    const received = parseFloat(receivedCash);
    const cash = parseFloat(cashAmount);
    const creditCard = parseFloat(creditCardAmount);

    if (!isNaN(received)) {
      let totalPaid = 0;

      if (paymentMethod === 'Cash') {
        totalPaid = cash;
      } else if (paymentMethod === 'Credit Card') {
        totalPaid = creditCard;
      } else if (paymentMethod === 'Split') {
        totalPaid = cash + creditCard;
      }

      const change = total - totalPaid;
      setChangeAmount(change);
    }
  };

  const handleKeyPress = (value) => {
    if (paymentMethod === 'Cash') {
      const newReceivedCash = receivedCash + value;
      setReceivedCash(newReceivedCash);
      const cash = parseFloat(newReceivedCash);
      setCashAmount(isNaN(cash) ? 0 : cash);
    } else if (paymentMethod === 'Credit Card') {
      const newCreditCardAmount = creditCardAmount + value;
      setCreditCardAmount(newCreditCardAmount);
      const creditCard = parseFloat(newCreditCardAmount);
      setCreditCardAmount(isNaN(creditCard) ? 0 : creditCard);
    }
  };

  const clearInput = () => {
    setReceivedCash('');
    setCashAmount(0);
    setCreditCardAmount(0);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons
              name="close-circle"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <View style={styles.paymentButtons}>
            <TouchableOpacity
              style={[
                styles.paymentButton,
                paymentMethod === 'Cash' && styles.selectedPaymentButton,
              ]}
              onPress={() => setPaymentMethod('Cash')}
            >
              <Text style={styles.paymentButtonText}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentButton,
                paymentMethod === 'Credit Card' && styles.selectedPaymentButton,
              ]}
              onPress={() => setPaymentMethod('Credit Card')}
            >
              <Text style={styles.paymentButtonText}>Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentButton,
                paymentMethod === 'Split' && styles.selectedPaymentButton,
              ]}
              onPress={() => setPaymentMethod('Split')}
            >
              <Text style={styles.paymentButtonText}>Split</Text>
            </TouchableOpacity>
          </View>
          {paymentMethod !== null && (
            <>
              {paymentMethod === 'Split' && (
                <>
                  <Text style={styles.amountText}>Enter Cash Amount</Text>
                  <Text style={styles.amountText}>Enter Credit Card Amount</Text>
                </>
              )}
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalAmount}>SAR {total.toFixed(2)}</Text>
              {paymentMethod === 'Cash' && (
                <Text style={styles.enteredCashText}>
                  Entered Cash: SAR {receivedCash}
                </Text>
              )}
              {paymentMethod === 'Credit Card' && (
                <Text style={styles.enteredCreditCardText}>
                  Entered Credit Card: SAR {creditCardAmount}
                </Text>
              )}
              {paymentMethod === 'Split' && (
                <>
                  <Text style={styles.enteredCashText}>
                    Entered Cash: SAR {cashAmount}
                  </Text>
                  <Text style={styles.enteredCreditCardText}>
                    Entered Credit Card: SAR {creditCardAmount}
                  </Text>
                </>
              )}
            </>
          )}
          {paymentMethod === 'Cash' && (
            <>
              <Text style={styles.modalChangeText}>
                Change: SAR {changeAmount.toFixed(2)}
              </Text>
              <View style={styles.numericKeypad}>
                <View style={styles.keypadRow}>
                  {[1, 2, 3].map((number) => (
                    <TouchableOpacity
                      key={number}
                      style={styles.keypadButton}
                      onPress={() => handleKeyPress(number.toString())}
                    >
                      <Text style={styles.keypadButtonText}>{number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keypadRow}>
                  {[4, 5, 6].map((number) => (
                    <TouchableOpacity
                      key={number}
                      style={styles.keypadButton}
                      onPress={() => handleKeyPress(number.toString())}
                    >
                      <Text style={styles.keypadButtonText}>{number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keypadRow}>
                  {[7, 8, 9].map((number) => (
                    <TouchableOpacity
                      key={number}
                      style={styles.keypadButton}
                      onPress={() => handleKeyPress(number.toString())}
                    >
                      <Text style={styles.keypadButtonText}>{number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keypadRow}>
                  <TouchableOpacity
                    style={styles.keypadButton}
                    onPress={() => handleKeyPress('0')}
                  >
                    <Text style={styles.keypadButtonText}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keypadButton}
                    onPress={clearInput}
                  >
                    <Text style={styles.keypadButtonText}>C</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          {paymentMethod === 'Credit Card' && (
            <Text style={styles.modalChangeText}>
              Change: SAR {changeAmount.toFixed(2)}
            </Text>
          )}
          {paymentMethod === 'Split' && (
            <>
              <Text style={styles.modalChangeText}>
                Remaining Change: SAR {changeAmount.toFixed(2)}
              </Text>
              <View style={styles.numericKeypad}>
                <View style={styles.keypadRow}>
                  {[1, 2, 3].map((number) => (
                    <TouchableOpacity
                      key={number}
                      style={styles.keypadButton}
                      onPress={() => handleKeyPress(number.toString())}
                    >
                      <Text style={styles.keypadButtonText}>{number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keypadRow}>
                  {[4, 5, 6].map((number) => (
                    <TouchableOpacity
                      key={number}
                      style={styles.keypadButton}
                      onPress={() => handleKeyPress(number.toString())}
                    >
                      <Text style={styles.keypadButtonText}>{number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keypadRow}>
                  {[7, 8, 9].map((number) => (
                    <TouchableOpacity
                      key={number}
                      style={styles.keypadButton}
                      onPress={() => handleKeyPress(number.toString())}
                    >
                      <Text style={styles.keypadButtonText}>{number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.keypadRow}>
                  <TouchableOpacity
                    style={styles.keypadButton}
                    onPress={() => handleKeyPress('0')}
                  >
                    <Text style={styles.keypadButtonText}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keypadButton}
                    onPress={clearInput}
                  >
                    <Text style={styles.keypadButtonText}>C</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
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
    backgroundColor: colors.backgroundPrimary,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '50%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'lightgrey',
  },
  paymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop : 15,
    marginBottom: 20,
  },
  paymentButton: {
    flex: 1,
    // backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedPaymentButton: {
    backgroundColor: colors.secondary,
  },
  paymentButtonText: {
    fontSize: 16,
    color: 'lightgrey',
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'lightgrey',
    textAlign : 'center'
  },
  totalAmount: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'lightgrey',
    textAlign : 'center'
  },
  enteredCashText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'lightgrey',
  },
  enteredChangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'lightgrey',
  },

  numericKeypad: {
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  keypadButton: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 5,
  },
  keypadButtonText: {
    fontSize: 24,
  },
  calculateButton: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalChangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'lightgrey',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 10, // Adjust the position as needed
    right: 10,
    zIndex: 1, // Ensure it's above the modal content
  },
});

export default CashChangeModal;

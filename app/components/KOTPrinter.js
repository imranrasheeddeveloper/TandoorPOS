import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import EscPos from 'react-native-esc-pos-printer';

const KotPrintScreen = () => {
  useEffect(() => {
   
    const printerIpOrName = '192.168.1.100';

   
    const kotText = generateKOTText(); 

    // Print KOT to the Epson printer
    EscPos.init({ width: 32, height: 40, characterSet: 'SLOVENIA' });
    EscPos.setStyles({ bold: true, align: 'center', width: 1, height: 1 });
    EscPos.text(kotText);
    EscPos.cut('partial');
    EscPos.printerStatus().then((status) => {
      if (status === 'OK') {
        EscPos.printUSB('unknown', printerIpOrName);
      } else {
        console.log('Printer is not ready');
      }
    });
  }, []);

  const generateKOTText = () => {
    const { orderNumber, orderDate, orderTime, orderItems } = neworder;
    let kotText = '';
    
    kotText += 'Kitchen Order Ticket\n';
    kotText += `Order Number: ${orderNumber}\n`;
    kotText += `Order Date: ${orderDate}\n`;
    kotText += `Order Time: ${orderTime}\n\n`;

    kotText += '--------------------------------\n';

    orderItems.forEach((item) => {
      kotText += `${item.name} x${item.quantity}\n`;
      if (item.addons && item.addons.length > 0) {
        kotText += '  Addons:\n';
        item.addons.forEach((addon) => {
          kotText += `    - ${addon.name}\n`;
        });
      }
      kotText += '\n';
    });

    kotText += '--------------------------------\n\n';
    kotText += 'Thank you for your order!';

    return kotText;
  };

  return (
    <View>
      <Button title="Print KOT" onPress={() => {}} />
    </View>
  );
};

export default KotPrintScreen;

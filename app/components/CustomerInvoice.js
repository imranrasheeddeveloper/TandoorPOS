import React, { useEffect } from 'react';
import EscPos from 'react-native-esc-pos-printer';

const CustomerInvoice = ({ orderData }) => {
  useEffect(() => {
    const printerIpOrName = '192.168.135.100';

    const invoiceText = generateInvoiceText(orderData);

    EscPos.init({ width: 32, height: 40, characterSet: 'SLOVENIA' });
    EscPos.setStyles({ bold: true, align: 'left', width: 1, height: 1 });
    EscPos.text(invoiceText);
    EscPos.cut('partial');
    EscPos.printerStatus().then((status) => {
      if (status === 'OK') {
        EscPos.printUSB('unknown', printerIpOrName);
      } else {
        console.log('Printer is not ready');
      }
    });
  }, [orderData]);

  const generateInvoiceText = (orderData) => {
    const {
      orderNumber,
      orderDate,
      orderTime,
      orderType,
      orderItems,
      subtotal,
      vat,
      discountAmount,
      orderNote,
      client,
    } = orderData;

    const customerName = client ? client.name || '[Customer Name]' : '[Customer Name]';

    let invoiceText = 'Tandoor Fusion Invoice\n\n';
    invoiceText += `Order Number: ${orderNumber}\n`;
    invoiceText += `Order Date: ${orderDate}\n`;
    invoiceText += `Order Time: ${orderTime}\n`;
    invoiceText += `Order Type: ${orderType}\n\n`;
    invoiceText += '--------------------------------------------\n';
    invoiceText += 'Item                  Quantity     Price\n';
    invoiceText += '--------------------------------------------\n';

    orderItems.forEach((item) => {
      invoiceText += `${item.name.padEnd(20)}x${item.quantity.toString().padStart(2)}${`$${item.price}`.padStart(13)}\n`;
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach((addon) => {
          invoiceText += `  - ${addon.name.padEnd(18)}${`$${addon.price}`.padStart(15)}\n`;
        });
      }
    });

    invoiceText += '--------------------------------------------\n';
    invoiceText += `Subtotal:                          $${subtotal.toFixed(2)}\n`;
    invoiceText += `VAT (15%):                       $${vat.toFixed(2)}\n`;
    invoiceText += `Discount Amount:                   $${discountAmount.toFixed(2)}\n`;
    invoiceText += '--------------------------------------------\n';
    invoiceText += `Total:                             $${(subtotal + vat - discountAmount).toFixed(2)}\n\n`;

    invoiceText += 'Order Note: ' + (orderNote || '(No order note provided)') + '\n\n';
    invoiceText += `Customer Name: ${customerName}\n`;

    return invoiceText;
  };

  return null;
};

export default CustomerInvoice;

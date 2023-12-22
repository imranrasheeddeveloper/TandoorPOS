import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../config/colors';

const PrinterModal = ({ visible, onClose, onSave, printer, isEditMode }) => {
    const [localPrinter, setLocalPrinter] = useState(printer);

    useEffect(() => {
        setLocalPrinter(printer);
    }, [printer]);

    const handleSave = () => {
        onSave(localPrinter);
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Printer Name"
                        placeholderTextColor={colors.mediumGrey}
                        value={localPrinter.name}
                        onChangeText={(text) => setLocalPrinter({ ...localPrinter, name: text })}
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="IP Address"
                        placeholderTextColor={colors.mediumGrey}
                        value={localPrinter.ipAddress}
                        onChangeText={(text) => setLocalPrinter({ ...localPrinter, ipAddress: text })}
                    />
                    <DropDownPicker
                        open={localPrinter.openDropdown}
                        setOpen={(open) => setLocalPrinter(prev => ({ ...prev, openDropdown: open }))}
                        items={[
                            { label: '80 mm', value: '80' },
                            { label: '58 mm', value: '58' },
                            { label: '50 mm', value: '50' },
                        ]}
                        value={localPrinter.paperSize}
                        containerStyle={{ height: 40 }}
                        style={styles.dropdown}
                        itemStyle={{ justifyContent: 'flex-start' }}
                        dropDownStyle={styles.dropdownBox}
                        onChangeItem={(item) => setLocalPrinter(prev => ({ ...prev, paperSize: item.value }))}
                        zIndex={5000}
                        elevation={5}
                        ModalProps={{ transparent: true }}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>{isEditMode ? "Update Printer" : "Add Printer"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '50%',
    },
    modalInput: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        color: colors.white,
        backgroundColor: colors.backgroundPrimary,
    },
    dropdown: {
        backgroundColor: colors.backgroundPrimary,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%', 
        color: colors.white
    },
    dropdownBox: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.secondary,
        color: colors.white
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    modalCloseButton: {
        backgroundColor: colors.red,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default PrinterModal;

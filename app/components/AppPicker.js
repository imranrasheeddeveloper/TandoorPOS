import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Modal, Button, Platform, TouchableWithoutFeedback, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../config/colors';
import AppText from './AppText';
import Screen from './Screen';
import PickerItem from './PickerItem';


function AppPicker({icon, items, placeholder, onSelectItem, selectedItem, PickerItemComponent = PickerItem,width = "100%", numberOfColumns =1}) {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                <View style={[styles.container, {width}]}>
                    {icon && <MaterialCommunityIcons size={20} color={colors.mediumGrey} style={styles.icon} name={icon} />}
                    {selectedItem? <AppText style={styles.text}>{selectedItem.label}</AppText>:<AppText style={styles.placeholder}>{placeholder}</AppText>}
                    <MaterialCommunityIcons size={20} color={colors.mediumGrey} name="chevron-down" />
                </View>
            </TouchableWithoutFeedback>
            <Modal visible={modalVisible} animationType="slide">
                <Screen>
                    <Button title="Close" onPress={()=> setModalVisible(false)} />
                    <FlatList 
                        numColumns={numberOfColumns}
                        data={items}
                        keyExtractor={item => item.value.toString() }
                        renderItem = {({item}) => (
                        <PickerItemComponent item={item} label={item.label} onPress={()=> {
                            setModalVisible(false);
                            onSelectItem(item);
                        }} />)}
                    />
                </Screen>
            </Modal>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightGrey,
        borderRadius: 25,
        flexDirection: "row",
        padding: 15,
        marginVertical: 10
    },
    icon: {
        marginRight: 10,
        marginTop: 4
    },
    text: {
        flex:1
    },
    placeholder:{
        color:colors.mediumGrey,
        flex: 1
    }
})
export default AppPicker;
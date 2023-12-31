import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../config/colors';
function ListItemSeparator(props) {
    return (
        <View style={styles.seperator} />
    );
}
const styles = StyleSheet.create({
    seperator: {
        width: '100%',
        height: 2,
        backgroundColor: colors.lightGrey
    }
})
export default ListItemSeparator;
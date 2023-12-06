import React from 'react';
import { Text } from 'react-native';
import styles from './Styles';
function AppText({children, style, ...otherProps}) {
    return (
        <Text style={[styles.text, style]} {...otherProps}>{children}</Text>
    );
}

export default AppText;
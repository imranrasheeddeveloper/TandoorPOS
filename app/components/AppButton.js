import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles';
import colors from '../config/colors';

function AppButton({ title, onPress, color = 'secondary', buttonStyle, buttonText, icon = null, lang = 'en', disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color], ...buttonStyle, opacity: disabled ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      {lang === 'en' ? icon : ''}
      <Text style={[styles.buttonText, buttonText]}>{title}</Text>
      {lang === 'ar' ? icon : ''}
    </TouchableOpacity>
  );
}

export default AppButton;

import React from 'react';
import { View, StyleSheet, TextInput, Text, Platform, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../config/colors';
import defaultStyles from './Styles';

function AppTextInput({ icon, width = "100%", lang = 'en', label, textStyle, onIconPress, ...otherProps }) {
  return (
    <View style={[styles.parentContainer, { width }]}>
      <Text style={[styles.labelStyle, defaultStyles.text, lang === 'ar' && { textAlign: 'right' }]}>{label}</Text>
      <View style={[styles.container, { flexDirection: lang === 'en' ? 'row' : 'row-reverse' }]}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color= {colors.secondary}
          style={styles.icon}
          onPress={() => onIconPress && onIconPress()}
        />
        <TextInput
          placeholderTextColor={colors.placeholderColor}
          style={[
            defaultStyles.text,
            styles.textInput,
            { textAlign: lang === 'en' ? 'left' : 'right' },
            textStyle
          ]}
          {...otherProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    color: "#344054",
    fontWeight: "700",
    fontStyle: "normal"
  },
  parentContainer: {
    width: "100%",
    overflow: 'hidden',
    paddingHorizontal: 10,
    marginBottom: 15
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: colors.strokeColor,
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10
  },
  textInput: {
    flex: 1
  }
});

export default AppTextInput;

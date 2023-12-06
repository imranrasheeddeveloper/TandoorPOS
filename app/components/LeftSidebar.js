import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../config/colors';

const LeftSidebar = ({ onIconPress }) => {
  const icons = ['home', 'rocket', 'user', 'power-off'];
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);

  const handleIconPress = (index) => {
    setSelectedIconIndex(index);
    onIconPress(index);
  };

  return (
    <View style={styles.container}>
      {icons.slice(0, -1).map((iconName, index) => (
        <TouchableOpacity key={index} onPress={() => handleIconPress(index)}>
          <View style={[
            styles.icon,
            index === selectedIconIndex ? styles.iconWrapper : null, // Apply iconWrapper style conditionally
          ]}>
            <Icon
              name={iconName}
              size={30}
              color={index === selectedIconIndex ? 'white' : colors.secondary} // Apply color conditionally
            />
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.bottomIcons}>
        {icons.slice(-1).map((iconName, index) => (
          <TouchableOpacity key={index} onPress={() => handleIconPress(icons.length - 1 + index)}>
            <View style={[
              styles.icon,
              index + icons.length - 1 === selectedIconIndex ? styles.iconWrapper : null, // Apply iconWrapper style conditionally
            ]}>
              <Icon
                name={iconName}
                size={30}
                color={index + icons.length - 1 === selectedIconIndex ? 'white' : colors.secondary} // Apply color conditionally
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    paddingTop: 50,
  },
  icon: {
    marginVertical: 20, // Adjust spacing between icons
  },
  iconWrapper: {
    borderRadius: 20, // This will be the border radius of the background
    backgroundColor: colors.secondary, // Make sure this is not transparent
    padding: 10, // Padding around the icon
    overflow: 'hidden', // This ensures the background color does not spill outside the border radius
  },
  bottomIcons: {
    marginTop: 'auto',
    marginBottom: 50, // Adjust bottom margin to push icons up if necessary
  },
});

export default LeftSidebar;

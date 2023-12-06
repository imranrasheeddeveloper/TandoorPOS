// MainContainer.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import LeftSidebar from '../components/LeftSidebar';
import ComponentOne from './POSScreen';
import ComponentTwo from './BarcodeScannerScreen';
import ComponentThree from './ScanningHistoryScreen';
import colors from '../config/colors';
import Screen from '../components/Screen';
const MainContainer = () => {
  const navigation = useNavigation(); // Access the navigation object
  const [selectedComponent, setSelectedComponent] = useState(0);

  const handleLeftSidebarIconPress = (index) => {
    console.log(`Left Sidebar Button ${index + 1} pressed`);

    // Set the selected component based on the button press
    switch (index) {
      case 0:
        setSelectedComponent('ComponentOne');
        break;
      case 1:
        setSelectedComponent('ComponentTwo');
        break;
      case 2:
        setSelectedComponent('ComponentThree');
        break;
      default:
        break;
    }
  };

  return (
   // <Screen>
<View style={styles.container}>
      <LeftSidebar onIconPress={handleLeftSidebarIconPress} />
      <View style={styles.mainContent}>
        {selectedComponent === 'ComponentOne' && <ComponentOne />}
        {selectedComponent === 'ComponentTwo' && <ComponentOne />}
        {selectedComponent === 'ComponentThree' && <ComponentThree />}
        {/* Add more components or screens as needed */}
      </View>
    </View>
   // </Screen>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundPrimary,
    flexDirection: 'row',
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
});

export default MainContainer;

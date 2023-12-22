import React from 'react';
import { View, Text } from 'react-native';
import colors from '../config/colors';

const AddonsList = ({ addons }) => {
  if (!addons || addons.length === 0) {
    return null;
  }

  return (
    <View style={{ marginLeft : 10}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 , marginTop : 10 , color: colors.white}}>Addons</Text>
      {addons.map((addon) => (
        <View key={addon.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={{ fontSize: 16, marginRight: 5 , color: colors.white }}>{addon.name}</Text>
          <Text style={{ fontSize: 16, color: colors.white }}>{`(+SAR ${addon.price})`}</Text>
        </View>
      ))}
    </View>
  );
};

export default AddonsList;

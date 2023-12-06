import React, { useEffect, useState } from "react";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
} from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";

function ListItem({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  renderRightActions,
  lang
}) {
  return (
    <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
            <View style={[styles.container,  {flexDirection: lang === 'en'? 'row':'row-reverse'}]}>
            {IconComponent}
            {image && <Image style={styles.image} source={image} />}
              <View style={styles.detailsContainer}>
                  <AppText style={[styles.title, {marginRight: lang === 'en'? 0:10}]} numberOfLines={1}>{title}</AppText>
                  {subTitle && <AppText numberOfLines={2} style={styles.subTitle}>{subTitle}</AppText>}
              </View>
              <MaterialCommunityIcons color={colors.mediumGrey} name="chevron-right" size={25} />
            </View>
        </TouchableHighlight>
        </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex:1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});

export default ListItem;

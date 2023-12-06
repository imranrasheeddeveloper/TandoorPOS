import React from "react";
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

function ScannedTicket({
  title,
  name,
  subTitle,
  IconComponent,
  onPress,
  renderRightActions,
  lang="en",
  activityName = null
}) {
  return (
    <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
            <View style={[styles.container,  {flexDirection: lang === 'en'? 'row':'row-reverse'}]}>
            {IconComponent}
              <View style={styles.detailsContainer}>
                  <AppText style={styles.title} numberOfLines={1}>{lang === 'en'?'Ticket ID:':'معرف التذكرة:'} {title}</AppText>
                  <AppText style={styles.title} numberOfLines={1}>{lang === 'en'?'Name:':'اسم:'} {name}</AppText>
                  {activityName && <AppText style={styles.title} numberOfLines={1}>{lang === 'en'?'Activity:':'نشاط:'} {activityName}</AppText>}
                  {subTitle && <AppText numberOfLines={2} style={styles.subTitle}>{lang === 'en'?'Scanned at:':'تم المسح في'} {subTitle}</AppText>}
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
    fontWeight: "600",
  },
});

export default ScannedTicket;

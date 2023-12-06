import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AppText from '../components/AppText';
import colors from '../config/colors';
import ListItem from '../components/ListItem';
import Screen from '../components/Screen';
function ListingDetailsScreen({route}) {
    const listing = route.params;
    return (
        <Screen>
            <View>
                <Image style={styles.image} source={listing.image} />
                <View style={styles.detailsContainer}>
                    <AppText style={styles.title}>{listing.title}</AppText>
                    <AppText style={styles.price}>${listing.price}</AppText>
                    <View style={styles.userContainer}>
                        <ListItem 
                            image={require("../assets/mosh.jpg")}
                            title="Mosh Hamedani"
                            subTitle="5 Listings"
                        />
                    </View>
                </View>
            </View>
        </Screen>
    );
}
const styles = StyleSheet.create({
    image:{
        width:'100%',
        height: 300
    },
    detailsContainer: {
        padding:20,
    },
    price:{
        color: colors.green,
        fontWeight: "bold",
        marginVertical: 10,

    },
    title:{
        fontSize: 24,
        fontWeight: "500",
        color: colors.black
    },
    userContainer: {
        marginVertical:40,
    }


})
export default ListingDetailsScreen;
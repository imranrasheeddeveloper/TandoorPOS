import {StyleSheet, Platform, Dimensions} from 'react-native';
import colors from '../config/colors';
function fontSizer (screenWidth) {
    if(screenWidth > 400){
        return 18;
    }else if(screenWidth > 250){
        return 15;
    }else { 
        return 12;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    text:{
        // color: "tomato",
        ...Platform.select({
            ios:{
                fontSize:fontSizer(Dimensions.get('window').width),
                fontFamily: "Avenir"
            },
            android: {
                fontSize:fontSizer(Dimensions.get('window').width),
                fontFamily: "Roboto"
            }
        })
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width:'100%',
    },
    buttonText: {
        color: colors.white,
        fontSize:fontSizer(Dimensions.get('window').width),
        textTransform: 'uppercase',
    },
    loginButton: {
        marginBottom:20,
        paddingHorizontal:10,
        width:'100%',
        
    },
    background: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 220,
        height: 120,
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center",
    },
    logoText: {
        color:'white', 
        textAlign:'center',
        fontWeight: 'bold',
        padding: 20,
        fontSize:fontSizer(Dimensions.get('window').width)
    }
})
export default styles;
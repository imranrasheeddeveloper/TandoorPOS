import React, { useState, useEffect, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import ScannedTicket from "../components/ScannedTicket";
import cache from '../utility/cache';
import AppText from "../components/AppText";
import colors from "../config/colors";
import Loader from "../components/Loader";
import AuthContext from "../auth/context";
function ScanningHistoryScreen({navigation}) {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const {user, setUser} = useContext(AuthContext);
  const scannedTicket= async () => {
    const getTickets = await cache.get("scannedTickets"+user.id);
    console.log(getTickets)
    if(getTickets != null)
    {
      setMessages(getTickets.value.reverse());
    }
  
  }
  const updateScannedTickets = async (updatedArray) => {
      await cache.store("scannedTickets"+user.id, updatedArray);
      scannedTicket();
  }

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
        scannedTicket();
    });
    (async () => {
      const { value } = await cache.getLang("lang");
      setLang(value);
      setLoaded(true);
    })();

    return unsubscribe;
  }, [navigation]);

  const handleDelete = ({sub_ticket_id}) => {
    // Delete the message from messages
    messages.forEach(element => {
        if(element.sub_ticket_id === sub_ticket_id){
          var index = messages.indexOf(element);
          if (index !== -1) {
            messages.splice(index, 1);
            updateScannedTickets(messages);
          }
        };
    });
  };
  if(loaded)
  {
    return (
      <Screen>
        {messages.length !== 0?<FlatList
          data={messages}
          keyExtractor={(message) => message.sub_ticket_id.toString()}
          renderItem={({ item }) => (
            <ScannedTicket
              title={item.ticket_id}
              name={item.name}
              subTitle={item.used_at}
              image={item.image}
              onPress={() => console.log("Message selected", item)}
              lang={lang}
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item)} />
              )}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
          refreshing={refreshing}
          onRefresh={() => {
            scannedTicket();
          }}
        /> : <View style={styles.historyMessage}><AppText color={colors.black}>{lang==='en'?'No History Available!':'لا يوجد سجل متاح!'}</AppText></View>}
      </Screen>
    );
  }
  return <Loader lang={lang?lang:'en'} />
}

const styles = StyleSheet.create({
  historyMessage: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default ScanningHistoryScreen;

import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import Screen from "../components/Screen";
const TicketForm = () => {
  const [tickets, setTickets] = useState([
    {
      ticket_id: 1,
      passes: [
        { name: 'P1', age: 22, gender: 'male', email: '', phone: '' },
        { name: 'P2', age: 20, gender: 'male', email: '', phone: '' },
      ],
    },
  ]);

  const handleAddPass = (ticketIndex) => {
    const newTickets = [...tickets];
    newTickets[ticketIndex].passes.push({
      name: `P${newTickets[ticketIndex].passes.length + 1}`,
      age: 0,
      gender: '',
      email: '',
      phone: '',
    });
    setTickets(newTickets);
  };

  const handleRemovePass = (ticketIndex, passIndex) => {
    const newTickets = [...tickets];
    newTickets[ticketIndex].passes.splice(passIndex, 1);
    setTickets(newTickets);
  };

  const handleAddTicket = () => {
    setTickets((prevTickets) => [
      ...prevTickets,
      {
        ticket_id: prevTickets.length + 1,
        passes: [{ name: `P1`, age: 0, gender: '', email: '', phone: '' }],
      },
    ]);
  };

  const handleRemoveTicket = (ticketIndex) => {
    const newTickets = [...tickets];
    newTickets.splice(ticketIndex, 1);
    setTickets(newTickets);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://your-api-url/ticket/purchase-offline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tickets),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Optionally, you can handle the API response or navigate to a success screen.
      Alert.alert('Success', 'Tickets submitted successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit tickets. Please try again.');
    }
  };

  return (
    <Screen>

<ScrollView contentContainerStyle={styles.container}>
      <View style={styles.ttileContainer}>
              <Text style={styles.screenTitle}>Purchased Tickets</Text>
        </View>
      {tickets.map((ticket, ticketIndex) => (
        <View key={ticket.ticket_id} style={styles.ticketContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.ticketTitle}>Ticket {ticket.ticket_id}</Text>
            <TouchableOpacity onPress={() => handleRemoveTicket(ticketIndex)}>
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {ticket.passes.map((pass, passIndex) => (
            <View key={passIndex} style={styles.passContainer}>
              <Text style={styles.passTitle}>Pass {pass.name}</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={pass.name}
                onChangeText={(value) => console.log(value)} // Update the pass name
              />
              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={pass.age.toString()}
                onChangeText={(value) => console.log(value)} // Update the pass age
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={pass.gender}
                onChangeText={(value) => console.log(value)} // Update the pass gender
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={pass.email}
                onChangeText={(value) => console.log(value)} // Update the pass email
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={pass.phone}
                onChangeText={(value) => console.log(value)} // Update the pass phone
              />
              <TouchableOpacity
                onPress={() => handleRemovePass(ticketIndex, passIndex)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove Pass</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => handleAddPass(ticketIndex)} style={styles.addButton}>
            <Text style={styles.buttonText}>Add Pass</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={handleAddTicket} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>


    </Screen>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketContainer: {
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  passContainer: {
    marginBottom: 12,
  },
  passTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 8, // Rounded corners
  },
  addButton: {
    marginVertical: 12,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ttileContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 16,
    marginTop: 16
  },
  screenTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'gray'
  },
});

export default TicketForm;

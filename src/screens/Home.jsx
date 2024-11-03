import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState([
    { id: '1', task: 'Task 1', time: '29 hrs', icon: 'facebook' },
    // Outras tasks...
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TO-DO</Text>
      </View>
      
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <FontAwesome name={item.icon} size={24} color="#4CAF50" />
            <View style={styles.todoTextContainer}>
              <Text style={styles.todoText}>{item.task}</Text>
              <Text style={styles.todoTime}>{item.time}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.todoList}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonCenter]} 
          onPress={() => navigation.navigate('AddTask')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#51c1f5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 20,
    width: '100%',
    backgroundColor: '#51c1f5',
    borderRadius: 10,
  },
  todoList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todoTextContainer: {
    marginLeft: 15,
    // backgroundColor: '#757575',
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  todoTime: {
    fontSize: 12,
    color: '#757575',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#51c1f5',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#51c1f5',
    borderRadius: 25,
  },
  navButtonCenter: {
    backgroundColor: '#FFC107',
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: -20,
  },
});

export default HomeScreen;

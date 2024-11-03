import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/Home';
import AddTaskScreen from './src/screens/addToDo'


const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} // Sem cabeçalho
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen} 
          options={{ title: 'Voltar' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


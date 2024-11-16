import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/Home';
import AddTaskScreen from './src/screens/addToDo';
import LoginScreen from './src/screens/LoginScreen';
import NewUsers from './src/screens/NewUser';

const Stack = createStackNavigator();

export default function App() {
  const [rotaInicial, setRotaInicial] = useState('Login'); // Define a rota inicial
  const [carregando, setCarregando] = useState(true); // Estado para indicar carregamento inicial

  useEffect(() => {
    const verificarLoginSalvo = async () => {
      try {
        const manterLogado = await AsyncStorage.getItem('manterLogado'); 
        if (manterLogado === 'true') {
          setRotaInicial('Home'); 
        }
      } catch (erro) {
        console.error('Erro ao verificar login salvo:', erro);
      } finally {
        setCarregando(false); 
      }
    };

    verificarLoginSalvo();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={rotaInicial}>
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
        <Stack.Screen
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }} // Sem cabeçalho 
        />
        <Stack.Screen
        name="NewUser" 
        component={NewUsers}
        options={{ title: 'Voltar' }}  // Sem cabeçalho 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

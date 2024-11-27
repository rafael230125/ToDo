import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/Home';
import AddTaskScreen from './src/screens/addToDo';
import LoginScreen from './src/screens/LoginScreen';
import NewUsers from './src/screens/NewUser';
import ConfigScreen from './src/screens/Config';
import Galeria from './src/screens/Galeria.jsx';
import { FontProvider } from './src/context/FontContext'; // Ajuste conforme o local do arquivo
import { ThemeProvider } from './src/context/ThemeContext.js'; // Importando o ThemeContext

const Stack = createStackNavigator();

export default function App() {
  const [rotaInicial, setRotaInicial] = useState('Login'); 
  const [carregando, setCarregando] = useState(true); 

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
    carregando ? null : (
      <ThemeProvider>
        <FontProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={rotaInicial}>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="AddTask" 
                component={AddTaskScreen} 
                options={{ title: 'Voltar' }} 
              />
              <Stack.Screen
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }} 
              />
              <Stack.Screen
                name="NewUser" 
                component={NewUsers}
                options={{ title: 'Voltar' }} 
              />
              <Stack.Screen 
                name="Config" 
                component={ConfigScreen} 
                options={{ title: 'Configurações' }} 
              />
              <Stack.Screen 
                name="Galeria" 
                component={Galeria} 
                options={{
                  title: 'Minha Galeria',
                  headerStyle: {
                    backgroundColor: '#333', 
                  },
                  headerTintColor: '#fff', 
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FontProvider>
      </ThemeProvider>
    )
  );
}

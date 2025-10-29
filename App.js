import React, { useState, useEffect, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontProvider } from './src/context/FontContext';
import { ThemeProvider } from './src/context/ThemeContext.js';

// Lazy loading de telas pesadas
const HomeScreen = React.lazy(() => import('./src/screens/Home/HomeScreen').then(module => ({ default: module.default || module.HomeScreen })));
const AddTaskScreen = React.lazy(() => import('./src/screens/addToDo'));
const LoginScreen = React.lazy(() => import('./src/screens/LoginScreen'));
const NewUsers = React.lazy(() => import('./src/screens/NewUser'));
const ConfigScreen = React.lazy(() => import('./src/screens/Config'));
const Galeria = React.lazy(() => import('./src/screens/Galeria.jsx'));

// Loading component
const Loading = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#51c1f5" />
  </View>
);

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
          <Suspense fallback={<Loading />}>
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
          </Suspense>
        </FontProvider>
      </ThemeProvider>
    )
  );
}

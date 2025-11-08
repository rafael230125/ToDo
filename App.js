import React, { useState, useEffect, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './src/services/firebaseConfig';
import { FontProvider } from './src/context/FontContext';
import { ThemeProvider } from './src/context/ThemeContext.js';

// Lazy loading de telas pesadas
const HomeScreen = React.lazy(() => import('./src/screens/Home').then(module => ({ default: module.default || module.HomeScreen })));
const AddTaskScreen = React.lazy(() => import('./src/screens/AddTask'));
const LoginScreen = React.lazy(() => import('./src/screens/Login'));
const NewUsers = React.lazy(() => import('./src/screens/NewUser'));
const ConfigScreen = React.lazy(() => import('./src/screens/Config'));

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
    // Sempre fazer logout ao iniciar o app
    // As credenciais salvas apenas preenchem os campos, mas não mantêm autenticação
    const resetAuth = async () => {
      try {
        // Sempre fazer logout para forçar novo login
        if (auth.currentUser) {
          await signOut(auth);
        }
      } catch (error) {
        // Erro silencioso ao fazer logout
      } finally {
        // Sempre vai para Login, as credenciais serão preenchidas automaticamente se existirem
        setRotaInicial('Login');
        setCarregando(false);
      }
    };

    resetAuth();
  }, []);

  if (carregando) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <FontProvider>
            <Loading />
          </FontProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
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
              </Stack.Navigator>
            </NavigationContainer>
          </Suspense>
        </FontProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

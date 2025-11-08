import React, { useState, useEffect, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './src/services/firebaseConfig';
import { FontProvider } from './src/context/FontContext';
import { ThemeProvider } from './src/context/ThemeContext.js';
import { ToastProvider } from './src/context/ToastContext';
import { TabNavigator } from './src/navigation/TabNavigator';

// Lazy loading de telas pesadas
const LoginScreen = React.lazy(() => import('./src/screens/Login'));
const NewUsers = React.lazy(() => import('./src/screens/NewUser'));

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
            <ToastProvider>
              <Loading />
            </ToastProvider>
          </FontProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FontProvider>
            <ToastProvider>
              <Suspense fallback={<Loading />}>
              <NavigationContainer>
              <Stack.Navigator 
                initialRouteName={rotaInicial}
                screenOptions={{
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                  transitionSpec: {
                    open: {
                      animation: 'spring',
                      config: {
                        stiffness: 1000,
                        damping: 500,
                        mass: 3,
                        overshootClamping: true,
                        restDisplacementThreshold: 0.01,
                        restSpeedThreshold: 0.01,
                      },
                    },
                    close: {
                      animation: 'spring',
                      config: {
                        stiffness: 1000,
                        damping: 500,
                        mass: 3,
                        overshootClamping: true,
                        restDisplacementThreshold: 0.01,
                        restSpeedThreshold: 0.01,
                      },
                    },
                  },
                }}
              >
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
                  name="MainTabs" 
                  component={TabNavigator} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="AddTask" 
                  component={React.lazy(() => import('./src/screens/AddTask'))} 
                  options={{ title: 'Voltar' }} 
                />
              </Stack.Navigator>
              </NavigationContainer>
              </Suspense>
            </ToastProvider>
          </FontProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

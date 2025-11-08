/**
 * TabNavigator
 * Navegação por tabs fixa na parte inferior com Safe Area
 * Design moderno com ícones coloridos e indicadores visuais
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/Home';
import AddTaskScreen from '../screens/AddTask';
import ConfigScreen from '../screens/Config';

const Tab = createBottomTabNavigator();

// Componente de ícone customizado com background e cores vibrantes
const TabIcon = ({ name, focused, iconType = 'home', size = 28, activeSize = 32 }) => {
  const { colors, semanticColors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Cores específicas para cada tab com gradientes sutis
  const iconColors = {
    home: {
      active: colors.primary, // Indigo vibrante #6366F1
      inactive: colors.textSecondary,
      bg: `${colors.primary}20`, // Background mais visível
      shadow: colors.primary,
    },
    add: {
      active: semanticColors.status.completed, // Verde #10B981
      inactive: colors.textSecondary,
      bg: `${semanticColors.status.completed}20`,
      shadow: semanticColors.status.completed,
    },
    config: {
      active: semanticColors.priority.medium, // Laranja #F59E0B
      inactive: colors.textSecondary,
      bg: `${semanticColors.priority.medium}20`,
      shadow: semanticColors.priority.medium,
    },
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  const config = iconColors[iconType];
  const iconColor = focused ? config.active : config.inactive;
  const bgColor = focused ? config.bg : 'transparent';
  const iconSize = focused ? activeSize : size;

  return (
    <Animated.View 
      style={[
        styles.iconContainer,
        { 
          backgroundColor: bgColor,
          transform: [{ scale: scaleAnim }],
          shadowColor: focused ? config.shadow : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: focused ? 0.3 : 0,
          shadowRadius: 4,
          elevation: focused ? 4 : 0,
        }
      ]}
    >
      <MaterialIcons 
        name={name} 
        size={iconSize} 
        color={iconColor}
      />
      <Animated.View 
        style={[
          styles.activeIndicator, 
          { 
            backgroundColor: iconColor,
            opacity: opacityAnim,
          }
        ]} 
      />
    </Animated.View>
  );
};

export const TabNavigator = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingHorizontal: 20,
          height: 65 + Math.max(insets.bottom, 0),
          elevation: 12,
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name={focused ? "dashboard" : "dashboard-customize"} 
              focused={focused}
              iconType="home"
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddTaskTab"
        component={AddTaskScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name={focused ? "add-task" : "note-add"} 
              focused={focused}
              iconType="add"
              size={30}
              activeSize={34}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ConfigTab"
        component={ConfigScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name={focused ? "tune" : "settings"} 
              focused={focused}
              iconType="config"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});


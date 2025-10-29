/**
 * Header Component
 * Cabeçalho do app
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const Header = ({ 
  userName = 'Usuário',
  appTitle = 'TO-DO',
  showLogo = true,
}) => {
  const { colors, fontSize } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <View style={styles.profileContainer}>
        <View style={styles.leftContainer}>
          {showLogo && (
            <Image
              source={require('../../images/favicon.png')}
              style={styles.logo}
            />
          )}
          <Text style={[styles.userName, { fontSize: fontSize * 1.1 }]}>
            {userName}
          </Text>
        </View>
        <Text style={[styles.appTitle, { fontSize: fontSize * 1.5 }]}>
          {appTitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingVertical: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    color: 'white',
  },
  appTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
});


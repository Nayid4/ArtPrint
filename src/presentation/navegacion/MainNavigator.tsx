import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from '../store/authStore';
import { RolUsuario } from '../../domain/entities/Usuario';
import AdminNavigator from './AdminNavigator';
import ClientNavigator from './ClientNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { userInfo } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo ? (
          userInfo.rol === RolUsuario.ADMIN ? (
            <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="Client" component={ClientNavigator} options={{ headerShown: false }} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
          
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;

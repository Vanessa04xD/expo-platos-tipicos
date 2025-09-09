import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'react-native';
import AddAppointmentScreen from './src/screens/AddAppointmentScreen';
import EditAppointmentScreen from './src/screens/EditAppointmentScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0b0b0b',
    card: '#0b0b0b',
    text: '#ffffff',
    border: '#2f2f2f',
    primary: '#22c55e',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={darkTheme}>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0b0b0b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="AddAppointment"
          component={AddAppointmentScreen}
          options={{ title: 'Agregar Cita' }}
        />
        <Stack.Screen
          name="EditAppointment"
          component={EditAppointmentScreen}
          options={{ title: 'Editar Cita' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

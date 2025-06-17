import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BluetoothDevice } from 'react-native-bluetooth-classic';
import CameraScreen from './screens/CameraScreen';
import HomeScreen from './screens/HomeScreen';
import MediaScreen from './screens/MediaScreen';
import BluetoothScreen from './screens/BluetoothScreen'
import ResultsScreen from './screens/ResultsScreen';


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#131C29' }, // Cor do background do header
        headerTintColor: '#fff', // Cor do texto e ícones do header
        headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }, // (opcional) Deixa o texto em negrito
        contentStyle: { backgroundColor: '#181F2A' }, // Cor do fundo da tela inteira
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Media" component={MediaScreen} />
      <Stack.Screen name="Bluetooth" component={BluetoothScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />

    </Stack.Navigator>
  );
}

export type RootStackParamList = {
  Home: undefined;
  Bluetooth: undefined;
  Camera: { deviceInfo: { name: string; address: string } };
  Media: {
    path: string;
    deviceInfo: { name: string; address: string };
  };
  Results: {
    imageUri: string;
    processedImage: string;
    similarity: string;
    isLive: boolean;
    deviceInfo: { name: string; address: string };
  };
};


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
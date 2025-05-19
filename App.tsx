import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BluetoothDevice } from 'react-native-bluetooth-classic';
import CameraScreen from './screens/CameraScreen';
import HomeScreen from './screens/HomeScreen';
import MediaScreen from './screens/MediaScreen';
import BluetoothScreen from './screens/BluetoothScreen'
import ResultsScreen from './screens/ResultsScreen';

// Cria o stack navigator (sem passar generics)
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
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
  Camera: { dispositivo: BluetoothDevice };
  Media: {
    path: string
    device: BluetoothDevice;
  };
  Results: {
    imageUri: string;
    processedImage: string;
    similarity: string;
    device: BluetoothDevice;
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

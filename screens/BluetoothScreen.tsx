import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    useColorScheme,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import type { RootStackParamList } from '../App';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

type BluetoothScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bluetooth'>;

function BluetoothScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation<BluetoothScreenNavigationProp>();

    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissão para localização',
                    message: 'Precisamos da sua localização para escanear dispositivos Bluetooth',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    useEffect(() => {
        const fetchBondedDevices = async () => {
            try {
                const bonded = await RNBluetoothClassic.getBondedDevices();
                setDevices(bonded);
            } catch (e: any) {
                Alert.alert('Erro ao listar dispositivos', e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBondedDevices();
    }, []);

    const scanDevices = async () => {
        const granted = await requestLocationPermission();
        if (!granted) return;

        setScanning(true);
        try {
            const unpaired = await RNBluetoothClassic.startDiscovery();
            const bonded = await RNBluetoothClassic.getBondedDevices();
            const allDevices = [...bonded, ...unpaired.filter(u => !bonded.some(b => b.address === u.address))];
            setDevices(allDevices);
        } catch (e: any) {
            Alert.alert('Erro durante a descoberta', e.message);
        } finally {
            setScanning(false);
        }
    };

    const connectToDevice = async (device: BluetoothDevice) => {
        try {
            const connected = await RNBluetoothClassic.connectToDevice(device.address);

            if (connected) {
                // Agora obtemos o objeto BluetoothDevice conectado
                const connectedDevice = await RNBluetoothClassic.getConnectedDevice(device.address);

                Alert.alert('Conectado com sucesso!', `Dispositivo: ${connectedDevice.name}`);

                // Passamos o objeto realmente conectado
                navigation.navigate('Camera', { dispositivo: connectedDevice });
            } else {
                Alert.alert('Falha na conexão');
            }
        } catch (e) {
            Alert.alert('Erro na conexão', (e as Error).message);
        }
    };


    return (
        <View style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                <View style={styles.container}>
                    <Text style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                        Dispositivos Bluetooth
                    </Text>

                    <TouchableOpacity style={styles.scanButton} onPress={scanDevices} disabled={scanning}>
                        <Text style={styles.scanButtonText}>
                            {scanning ? 'Procurando...' : 'Buscar dispositivos'}
                        </Text>
                    </TouchableOpacity>

                    {loading || scanning ? (
                        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
                    ) : (
                        devices.map((device) => (
                            <TouchableOpacity
                                key={device.address}
                                style={styles.deviceButton}
                                onPress={() => connectToDevice(device)}>
                                <Text style={styles.deviceText}>
                                    {device.name || 'Sem nome'} ({device.address})
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '5%',
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    deviceButton: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 10,
        width: '100%',
    },
    deviceText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    scanButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
    },
    scanButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BluetoothScreen;

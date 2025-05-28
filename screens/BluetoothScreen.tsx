import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
<<<<<<< HEAD
    Alert,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    Platform,
    ActivityIndicator,
    useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
=======
    useColorScheme,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
} from 'react-native';
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import type { RootStackParamList } from '../App';
<<<<<<< HEAD
=======
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f

type BluetoothScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bluetooth'>;

function BluetoothScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation<BluetoothScreenNavigationProp>();

    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);

    const backgroundStyle = {
<<<<<<< HEAD
        backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
        flex: 1,
    };

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 31) {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ];
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                return permissions.every(permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
=======
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
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
        }
        return true;
    };

    useEffect(() => {
        const fetchBondedDevices = async () => {
<<<<<<< HEAD
            const granted = await requestBluetoothPermissions();
            if (!granted) {
                Alert.alert('Permissões necessárias', 'Não foi possível obter permissões Bluetooth.');
                setLoading(false);
                return;
            }

=======
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
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
<<<<<<< HEAD
        const granted = await requestBluetoothPermissions();
        if (!granted) {
            Alert.alert('Permissões necessárias', 'Permissões Bluetooth não foram concedidas.');
            return;
        }
=======
        const granted = await requestLocationPermission();
        if (!granted) return;
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f

        setScanning(true);
        try {
            const unpaired = await RNBluetoothClassic.startDiscovery();
            const bonded = await RNBluetoothClassic.getBondedDevices();
<<<<<<< HEAD

            const allDevices = [
                ...bonded,
                ...unpaired.filter(u => !bonded.some(b => b.address === u.address)),
            ];
=======
            const allDevices = [...bonded, ...unpaired.filter(u => !bonded.some(b => b.address === u.address))];
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
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
<<<<<<< HEAD
            if (connected) {
                const connectedDevice = await RNBluetoothClassic.getConnectedDevice(device.address);
                navigation.navigate('Camera', {
                    deviceInfo: {
                        name: device.name,
                        address: device.address,
                    },
                });

            } else {
                Alert.alert('Falha na conexão');
            }
        } catch (e: any) {
            Alert.alert('Erro na conexão', e.message);
        }
    };

    return (
        <SafeAreaView style={backgroundStyle}>
=======

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
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
<<<<<<< HEAD
                <View style={{ paddingHorizontal: '5%', paddingTop: 0, alignItems: 'center' }}>
                    <View style={{
                        alignItems: 'center',
                        backgroundColor: isDarkMode ? '#131C29' : '#E5F9ED',
                        marginBottom: 20,
                        paddingBottom: 20,
                        borderRadius: 18,
                        elevation: 8,
                        shadowColor: '#4DC459',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        width: '100%',
                    }}>
                        <Image
                            source={require('../assets/maomao_2.png')}
                            style={[styles.icon, { marginBottom: 0 }]}
                        />
                        <Text style={[styles.welcome, { color: '#CBD5E1', fontSize: 20, marginTop: 0 }]}>
                            Dispositivos Bluetooth
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.customButton, { borderColor: '#4DC459' }]}
                        onPress={scanDevices}
                        disabled={scanning}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: '#4DC459', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
=======
                <View style={styles.container}>
                    <Text style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                        Dispositivos Bluetooth
                    </Text>

                    <TouchableOpacity style={styles.scanButton} onPress={scanDevices} disabled={scanning}>
                        <Text style={styles.scanButtonText}>
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
                            {scanning ? 'Procurando...' : 'Buscar dispositivos'}
                        </Text>
                    </TouchableOpacity>

                    {loading || scanning ? (
<<<<<<< HEAD
                        <ActivityIndicator size="large" color="#4DC459" style={{ marginTop: 30 }} />
=======
                        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
                    ) : (
                        devices.map((device) => (
                            <TouchableOpacity
                                key={device.address}
<<<<<<< HEAD
                                style={[styles.customButton, { borderColor: '#007bff', marginTop: 15 }]}
                                onPress={() => connectToDevice(device)}
                            >
                                <Text style={{
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                }}>
=======
                                style={styles.deviceButton}
                                onPress={() => connectToDevice(device)}>
                                <Text style={styles.deviceText}>
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
                                    {device.name || 'Sem nome'} ({device.address})
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
<<<<<<< HEAD
        </SafeAreaView>
=======
        </View>
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
    );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
    icon: {
        width: 250,
        height: 250,
        marginVertical: 20,
        resizeMode: 'contain',
    },
    welcome: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
    },
    customButton: {
        paddingVertical: 14,
        borderRadius: 18,
        borderWidth: 1,
        width: '100%',
    },
=======
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
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
});

export default BluetoothScreen;

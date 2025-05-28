import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import type { RootStackParamList } from '../App';

type BluetoothScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bluetooth'>;

function BluetoothScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation<BluetoothScreenNavigationProp>();

    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);

    const backgroundStyle = {
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
        }
        return true;
    };

    useEffect(() => {
        const fetchBondedDevices = async () => {
            const granted = await requestBluetoothPermissions();
            if (!granted) {
                Alert.alert('Permissões necessárias', 'Não foi possível obter permissões Bluetooth.');
                setLoading(false);
                return;
            }

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
        const granted = await requestBluetoothPermissions();
        if (!granted) {
            Alert.alert('Permissões necessárias', 'Permissões Bluetooth não foram concedidas.');
            return;
        }

        setScanning(true);
        try {
            const unpaired = await RNBluetoothClassic.startDiscovery();
            const bonded = await RNBluetoothClassic.getBondedDevices();

            const allDevices = [
                ...bonded,
                ...unpaired.filter(u => !bonded.some(b => b.address === u.address)),
            ];
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
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
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
                            {scanning ? 'Procurando...' : 'Buscar dispositivos'}
                        </Text>
                    </TouchableOpacity>

                    {loading || scanning ? (
                        <ActivityIndicator size="large" color="#4DC459" style={{ marginTop: 30 }} />
                    ) : (
                        devices.map((device) => (
                            <TouchableOpacity
                                key={device.address}
                                style={[styles.customButton, { borderColor: '#007bff', marginTop: 15 }]}
                                onPress={() => connectToDevice(device)}
                            >
                                <Text style={{
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                }}>
                                    {device.name || 'Sem nome'} ({device.address})
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
});

export default BluetoothScreen;

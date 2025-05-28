import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    useColorScheme,
    ScrollView,
    StatusBar,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RootStackParamList } from '../App';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

type ResultadosScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;
type ResultadosScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

function ResultsScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation<ResultadosScreenNavigationProp>();
    const route = useRoute<ResultadosScreenRouteProp>();
    const { imageUri, similarity, deviceInfo } = route.params;
    const similarityValue = parseFloat(similarity);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
        flex: 1,
    };

    const handleOpenDoor = async () => {
        if (!deviceInfo) {
            Alert.alert('Erro', 'Dispositivo Bluetooth não está conectado.');
            return;
        }

        try {
            const connected = await RNBluetoothClassic.isDeviceConnected(deviceInfo.address);
            if (!connected) {
                await RNBluetoothClassic.connectToDevice(deviceInfo.address);
            }

            await RNBluetoothClassic.writeToDevice(deviceInfo.address, 'open', 'utf-8');
            Alert.alert('Sucesso', 'Fechadura aberta!');
        } catch (error: any) {
            Alert.alert('Erro ao abrir a fechadura', error.message || error.toString());
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
                    <Text
                        style={[
                            styles.resultTitle,
                            {
                                color: isDarkMode ? '#CBD5E1' : '#131C29',
                                fontSize: 32,
                                marginTop: 0,
                            },
                        ]}>
                        Resultado
                    </Text>
                    <View
                        style={{
                            alignItems: 'center',
                            backgroundColor: isDarkMode ? '#131C29' : '#E5F9ED',
                            marginBottom: 20,
                            marginTop: 0,
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
                            source={require('../assets/Frieren_Himmel.png')}
                            style={[styles.icon, { marginBottom: 0 }]}
                        />
                        <Text style={[styles.similarity, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                            Similaridade: {(similarityValue * 100).toFixed(2)}%
                        </Text>

                    </View>



                    {similarityValue > 0.8 ? (
                        <>
                            <Text style={[styles.message, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                                ✅ Você foi reconhecido!
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.customButton,
                                    {
                                        backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
                                        borderColor: '#4DC459',
                                    },
                                ]}
                                onPress={handleOpenDoor}
                                activeOpacity={0.8}>
                                <Text style={styles.buttonText}>Abrir Fechadura</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={[styles.message, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                            ❌ Não reconhecido!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 200,
        height: 200,
        marginVertical: 20,
        resizeMode: 'contain',
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    similarity: {
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        color: '#666',
    },
    customButton: {
        paddingVertical: 14,
        borderRadius: 18,
        borderWidth: 0.5,
        width: '100%',
        marginTop: 20,
    },
    buttonText: {
        color: '#4DC459',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ResultsScreen;

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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import type { RootStackParamList } from '../App';
import { Button } from '@react-navigation/elements';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

type ResultadosScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;
type ResultadosScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

function ResultsScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const navigation = useNavigation<ResultadosScreenNavigationProp>();
    const route = useRoute<ResultadosScreenRouteProp>();


    const { imageUri, processedImage, similarity, device } = route.params;
    const similarityValue = parseFloat(similarity);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };
    const handleOpenDoor = async () => {
        if (!device) {
            Alert.alert('Erro', 'Dispositivo Bluetooth não está conectado.');
            return;
        }
        try {
            const connected = await RNBluetoothClassic.isDeviceConnected(device.address);
            if (!connected) {
                // Tenta reconectar se necessário
                await RNBluetoothClassic.connectToDevice(device.address);
            }
            if (!device || !device.address) {
                Alert.alert('Erro', 'Dispositivo Bluetooth inválido ou não selecionado');
                return;
            }

            // Enviar comando para abrir a porta (depende do seu dispositivo)
            // Exemplo enviando string "open" convertida para bytes:
            await RNBluetoothClassic.writeToDevice(device.address, 'open', 'utf-8');

            Alert.alert('Sucesso', 'Fechadura aberta!');
        } catch (error: any) {
            Alert.alert('Erro ao abrir a fechadura', error.message || error.toString());
        }

    };


    const safePadding = '5%';

    return (
        <View style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                <View
                    style={{
                        paddingHorizontal: safePadding,
                        paddingTop: 40,
                        alignItems: 'center',
                    }}>
                    <Text
                        style={[
                            styles.title,
                            { color: isDarkMode ? Colors.light : Colors.dark },
                        ]}>
                        Resultado
                    </Text>

                    {processedImage && (
                        <Image
                            source={{ uri: `http://192.168.100.103:5000${processedImage}` }}
                            style={styles.image}
                        />
                    )}

                    <Text
                        style={[
                            styles.similarity,
                            { color: isDarkMode ? Colors.light : Colors.dark },
                        ]}>
                        Similaridade: {(similarityValue * 100).toFixed(2)}%
                    </Text>
                    {similarityValue > 0.8 ? (
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Text
                                style={[
                                    styles.message,
                                    { color: isDarkMode ? Colors.light : Colors.dark },
                                ]}>
                                ✅ Você foi reconhecido!
                            </Text>
                            <Button onPress={handleOpenDoor}> Abrir Fechadura</Button>
                        </View>
                    ) : (
                        <Text
                            style={[
                                styles.message,
                                { color: isDarkMode ? Colors.light : Colors.dark },
                            ]}>
                            ❌ Não reconhecido!
                        </Text>
                    )}

                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        borderRadius: 8,
    },
    similarity: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        color: '#666',
    },
});

export default ResultsScreen;

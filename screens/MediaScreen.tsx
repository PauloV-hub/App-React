import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    useColorScheme,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import { Button } from '@react-navigation/elements';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import type { RootStackParamList } from '../App';

type MediaScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Media'>;
type MediaScreenRouteProp = RouteProp<RootStackParamList, 'Media'>;

function MediaScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const navigation = useNavigation<MediaScreenNavigationProp>();
    const route = useRoute<MediaScreenRouteProp>();

    const { path, device } = route.params;

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };

    const safePadding = '5%';


    const sendToBackend = async () => {
        const formData = new FormData();
        formData.append('image', {
            uri: 'file://' + path, // ajuste aqui, para enviar a imagem correta
            name: 'foto.jpg',
            type: 'image/jpeg',
        } as unknown as Blob);

        try {
            const response = await fetch('http://192.168.100.103:5000/upload', {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const result = await response.json();

            console.log('Resposta do servidor:', result);

            // Navega para a tela de resultados, passando os dados
            if (!device || !device.address) {
                Alert.alert('Erro', 'Dispositivo Bluetooth inválido ou não selecionado');
                return;
            }
            navigation.navigate('Results', {
                imageUri: 'file://' + path,
                processedImage: result.image,
                similarity: result.similarity.toString(),
                device: device
            });
        } catch (error) {
            console.error('Erro ao enviar:', error);
        }
    };

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
                    }}
                >
                    <Text>Foto tirada</Text>
                    <Image
                        source={{ uri: 'file://' + path }}
                        style={styles.icon}
                    />
                    <View style={styles.buttonContainer}>
                        <Button onPress={sendToBackend}>Enviar Para Backend</Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 300,
        height: 300,
        marginVertical: 20,
        resizeMode: 'contain',
    },
    buttonContainer: {
        marginTop: 20,
        width: '60%',
    },
});

export default MediaScreen;

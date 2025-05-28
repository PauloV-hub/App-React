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
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    const { path, deviceInfo } = route.params;

    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
        flex: 1,
    };

    const safePadding = '5%';

    const sendToBackend = async () => {
        const formData = new FormData();
        formData.append('file', {
            uri: 'file://' + path,
            name: 'foto.jpg',
            type: 'image/jpeg',
        } as any);

        try {
            const response = await fetch('http://192.168.100.103:8000/detect', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            console.log('Resposta do servidor:', result);

            if (!deviceInfo || !deviceInfo.address) {
                Alert.alert('Erro', 'Dispositivo Bluetooth inválido ou não selecionado');
                return;
            }
            navigation.navigate('Results', {
                imageUri: 'file://' + path,
                processedImage: result.image,
                similarity: result.similarity?.toString() ?? '',
                deviceInfo: deviceInfo
            });
        } catch (error) {
            console.error('Erro ao enviar:', error);
        }
    };
    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                <View
                    style={{
                        paddingHorizontal: safePadding,
                        paddingTop: 0,
                        alignItems: 'center',
                    }}
                >
                    <View style={{
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
                            source={require('../assets/pikachu.png')}
                            style={[styles.icon, { marginBottom: 0 }]}
                        />
                        <Text
                            style={[
                                styles.welcome,
                                {
                                    color: '#CBD5E1',
                                    fontSize: 20,
                                    marginTop: 0,
                                },
                            ]}>
                            Foto capturada com sucesso!
                        </Text>

                    </View>
                    <Image
                        source={{ uri: 'file://' + path }}
                        style={[styles.icon,
                        { width: 300, height: 300, marginBottom: 10 }]}
                    />
                    <TouchableOpacity
                        style={[
                            styles.customButton,
                            {
                                backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
                                borderColor: '#4DC459',
                            },
                        ]}
                        onPress={sendToBackend}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={{
                                color: '#4DC459',
                                fontWeight: 'bold',
                                fontSize: 16,
                                textAlign: 'center',
                            }}
                        >
                            Analisar Imagem
                        </Text>
                    </TouchableOpacity>
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
    welcome: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    buttonContainer: {
        marginTop: 60,
        width: '60%',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    customButton: {
        paddingVertical: 14,
        borderRadius: 18,
        borderWidth: 0.5,
        width: '100%',
    },
});

export default MediaScreen;
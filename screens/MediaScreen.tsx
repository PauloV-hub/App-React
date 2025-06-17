import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    useColorScheme,
    StatusBar,
    Alert,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('Enviando vídeo...');

    // Animação de pulsação para o ícone
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    // Iniciar animação de pulsação
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    // Iniciar envio assim que a tela for montada
    useEffect(() => {
        sendToBackend();
    }, []);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
        flex: 1,
    };

    const sendToBackend = async () => {
        const formData = new FormData();
        formData.append('file', {
            uri: 'file://' + path,
            name: 'video.mp4',
            type: 'video/mp4',
        } as any);

        try {
            // Simulação de progresso de upload
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    const newProgress = prev + 0.03;
                    if (newProgress >= 0.7) {
                        setProcessingStatus('Analisando face...');
                    }
                    if (newProgress >= 0.85) {
                        setProcessingStatus('Verificando liveness...');
                        clearInterval(progressInterval);
                        return 0.85;
                    }
                    return newProgress;
                });
            }, 300);

            const response = await fetch('http://192.168.100.103:8000/detect', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            clearInterval(progressInterval);
            setUploadProgress(1);
            setProcessingStatus('Concluído!');

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Resposta do servidor:', result);

            if (!deviceInfo || !deviceInfo.address) {
                Alert.alert('Erro', 'Dispositivo Bluetooth inválido ou não selecionado');
                return;
            }

            // Pequeno atraso antes de navegar para mostrar que concluiu
            setTimeout(() => {
                navigation.navigate('Results', {
                    imageUri: 'file://' + path,
                    processedImage: result.image,
                    similarity: result.similarity?.toString() ?? '',
                    isLive: result.is_live,
                    deviceInfo: deviceInfo
                });
            }, 800);
        } catch (error) {
            console.error('Erro ao enviar:', error);
            Alert.alert(
                'Erro ao processar',
                'Não foi possível processar o vídeo. Tente novamente.'
            );
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={styles.container}>
                <View style={styles.loadingCard}>
                    <Animated.Image
                        source={require('../assets/pikachu.png')}
                        style={[
                            styles.icon,
                            {
                                transform: [{ scale: pulseAnim }],
                            }
                        ]}
                    />

                    <Text style={styles.loadingTitle}>Processando</Text>
                    <Text style={styles.loadingText}>{processingStatus}</Text>

                    {/* Barra de progresso */}
                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                { width: `${uploadProgress * 100}%` }
                            ]}
                        />
                    </View>

                    <Text style={styles.progressPercentage}>
                        {Math.round(uploadProgress * 100)}%
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 30,
        width: '90%',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#4DC459',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    icon: {
        width: 120,
        height: 120,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 16,
        color: '#CBD5E1',
        marginBottom: 25,
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4DC459',
    },
    progressPercentage: {
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default MediaScreen;
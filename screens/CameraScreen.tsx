// Modificações no CameraScreen.tsx

// Importe apenas o necessário
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Animated, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');
const RECORDING_DURATION = 5; // Segundos de gravação

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

export default function CameraScreen(): React.JSX.Element {
    const navigation = useNavigation<CameraScreenNavigationProp>();
    const route = useRoute<CameraScreenRouteProp>();
    const { deviceInfo } = route.params;

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const camera = useRef<Camera>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(3); // Contagem regressiva inicial
    const [recordingTime, setRecordingTime] = useState(0);

    const progressAnim = useRef(new Animated.Value(0)).current;
    const countdownTimer = useRef<NodeJS.Timeout | null>(null);
    const recordingTimer = useRef<NodeJS.Timeout | null>(null);

    // Verificação de permissão
    useEffect(() => {
        const checkPermission = async () => {
            if (!hasPermission) {
                await requestPermission();
            }
        };
        checkPermission();
    }, [hasPermission, requestPermission]);

    // Iniciar contagem regressiva quando a tela carrega
    useEffect(() => {
        startCountdown();
        return () => {
            if (countdownTimer.current) clearInterval(countdownTimer.current);
            if (recordingTimer.current) clearInterval(recordingTimer.current);
        };
    }, []);

    // Animação da barra de progresso
    useEffect(() => {
        if (isRecording) {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: RECORDING_DURATION * 1000,
                useNativeDriver: false,
            }).start();
        }
    }, [isRecording, progressAnim]);

    const startCountdown = () => {
        countdownTimer.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownTimer.current!);
                    startRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Função para iniciar a gravação
    async function startRecording() {
        if (camera.current == null) return;

        setIsRecording(true);
        setRecordingTime(0);

        // Timer para parar a gravação após o tempo definido
        recordingTimer.current = setInterval(() => {
            setRecordingTime((prev) => {
                if (prev >= RECORDING_DURATION - 1) {
                    stopRecording();
                    clearInterval(recordingTimer.current!);
                    return RECORDING_DURATION;
                }
                return prev + 1;
            });
        }, 1000);

        try {
            camera.current.startRecording({
                onRecordingFinished: (video) => {
                    // Navegar para a tela Media (agora de loading) com o caminho do vídeo

                    navigation.navigate('Media', {
                        path: video.path,
                        deviceInfo: deviceInfo
                    });
                },
                onRecordingError: (error) => {
                    console.error('Recording error:', error);
                    setIsRecording(false);
                    Alert.alert('Erro', 'Falha ao gravar o vídeo.');
                },
            });
        } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
        }
    }

    // Função para parar a gravação
    async function stopRecording() {
        if (camera.current == null) return;

        if (recordingTimer.current) {
            clearInterval(recordingTimer.current);
        }

        try {
            await camera.current.stopRecording();
            setIsRecording(false);
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    }

    // Verificações de permissão/disponibilidade de câmera
    if (!device) {
        return <Text>Nenhuma câmera disponível</Text>;
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>Permissão de câmera não concedida.</Text>
                <Button title="Tentar Novamente" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                video={true}
                audio={false}
            />

            {/* Guia oval para posicionamento do rosto */}
            <View style={styles.overlay}>
                <View style={styles.faceGuideContainer}>
                    <View style={styles.faceGuide} />
                </View>

                {countdown > 0 ? (
                    <View style={styles.countdownContainer}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                        <Text style={styles.instructionText}>Posicione seu rosto dentro do oval</Text>
                    </View>
                ) : isRecording ? (
                    <View style={styles.recordingStatusContainer}>
                        <Text style={styles.recordingText}>Gravando verificação facial</Text>
                        <Text style={styles.instructionText}>Mantenha seu rosto dentro do oval</Text>

                        {/* Barra de progresso */}
                        <View style={styles.progressContainer}>
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    }
                                ]}
                            />
                        </View>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

// Manter os estilos iguais
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceGuideContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    faceGuide: {
        width: width * 0.7,
        height: height * 0.45,
        borderRadius: 200,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    countdownContainer: {
        alignItems: 'center',
        marginTop: height * 0.6,
    },
    countdownText: {
        fontSize: 60,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 10,
        textAlign: 'center',
        marginHorizontal: 40,
    },
    recordingStatusContainer: {
        alignItems: 'center',
        marginTop: height * 0.6,
    },
    recordingText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    progressContainer: {
        width: width * 0.8,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        marginTop: 15,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
});
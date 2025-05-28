import React, { useEffect, useRef, useState } from 'react';
<<<<<<< HEAD
import { View, Text, Button, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
=======
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App'; // o tipo do seu navigator principal
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

export default function CameraScreen(): React.JSX.Element {
    const navigation = useNavigation<CameraScreenNavigationProp>();

    const route = useRoute<CameraScreenRouteProp>();

<<<<<<< HEAD
    const { deviceInfo } = route.params;
=======
    const { dispositivo } = route.params;
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const camera = useRef<Camera>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    useEffect(() => {
<<<<<<< HEAD
        const checkPermission = async () => {
            if (!hasPermission) {
                await requestPermission();
            }
        };
        checkPermission();
    }, [hasPermission, requestPermission]);

    useEffect(() => {
        setPhotoUri(null);
    }, []);

=======
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
    if (!device) {
        return <Text>Nenhuma câmera disponível</Text>;
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
<<<<<<< HEAD
                <Text>Permissão de câmera não concedida.</Text>
                <Button title="Tentar Novamente" onPress={requestPermission} />
=======
                <Text>Permissão de câmera não concedida</Text>
                <Button title="Permitir Câmera" onPress={requestPermission} />
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
            </View>
        );
    }

<<<<<<< HEAD

=======
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
    async function takePhoto() {
        if (camera.current == null) return;

        try {
            const photo = await camera.current.takePhoto();
            setPhotoUri('file://' + photo.path);

<<<<<<< HEAD
            navigation.navigate('Media', {
                path: photo.path, deviceInfo: {
                    address: deviceInfo.address,
                    name: deviceInfo.name,
                },
            });
=======
            navigation.navigate('Media', { path: photo.path, device: dispositivo });
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
        } catch (error) {
            console.error('Erro ao tirar foto:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />
            <View style={styles.buttonContainer}>
<<<<<<< HEAD
                <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
                    <View style={styles.outerCircle}>
                        <View style={styles.innerCircle} />
                    </View>
                </TouchableOpacity>
            </View>
=======
                <Button title="Tirar Foto" onPress={takePhoto} />
            </View>

            {photoUri && (
                <View style={styles.preview}>
                    <Text>Foto capturada:</Text>
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                </View>
            )}
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
<<<<<<< HEAD

    buttonContainer: {
        position: 'absolute', // Geralmente o botão da câmera fica sobre a visualização da câmera
        bottom: 50,          // Ajuste a posição conforme necessário
        alignSelf: 'center', // Centraliza o botão horizontalmente
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        width: 80,
        height: 80,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(200, 200, 200, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    innerCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
=======
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
>>>>>>> 10e256de878adb94c37bfe48b1236c52f6fa0f1f
    },
    preview: {
        position: 'absolute',
        top: 50,
        alignItems: 'center',
    },
    photo: {
        width: 200,
        height: 300,
        marginTop: 10,
        borderRadius: 10,
    },
});

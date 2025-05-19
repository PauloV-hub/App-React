import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App'; // o tipo do seu navigator principal
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

export default function CameraScreen(): React.JSX.Element {
    const navigation = useNavigation<CameraScreenNavigationProp>();

    const route = useRoute<CameraScreenRouteProp>();

    const { dispositivo } = route.params;

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const camera = useRef<Camera>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    if (!device) {
        return <Text>Nenhuma câmera disponível</Text>;
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>Permissão de câmera não concedida</Text>
                <Button title="Permitir Câmera" onPress={requestPermission} />
            </View>
        );
    }

    async function takePhoto() {
        if (camera.current == null) return;

        try {
            const photo = await camera.current.takePhoto();
            setPhotoUri('file://' + photo.path);

            navigation.navigate('Media', { path: photo.path, device: dispositivo });
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
                <Button title="Tirar Foto" onPress={takePhoto} />
            </View>

            {photoUri && (
                <View style={styles.preview}>
                    <Text>Foto capturada:</Text>
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
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

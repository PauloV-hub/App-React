import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    useColorScheme,
    ScrollView,
    StatusBar,
} from 'react-native';

import { Button } from '@react-navigation/elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


function HomeScreen(): React.JSX.Element {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
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
                            styles.welcome,
                            { color: isDarkMode ? '#61dafb' : '#007bff' },
                        ]}>
                        Bem-vindo!
                    </Text>
                    <Text
                        style={[
                            styles.title,
                            { color: isDarkMode ? Colors.light : Colors.dark },
                        ]}>
                        Você será analisado!!
                    </Text>

                    <Image
                        source={require('../assets/maomao.png')}
                        style={styles.icon}
                    />

                    <View style={styles.buttonContainer}>
                        <Button onPress={() => navigation.navigate("Bluetooth")}>
                            Parear Dispositivo
                        </Button>
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
    welcome: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: '#999',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
        width: '60%',
    },
});

export default HomeScreen;

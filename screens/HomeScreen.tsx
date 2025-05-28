import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    useColorScheme,
    ScrollView,
    StatusBar,
    TouchableOpacity
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function HomeScreen(): React.JSX.Element {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
        flex: 1,
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
                        paddingHorizontal: '10%',
                        paddingTop: 40,
                        alignItems: 'center',
                    }}
                >
                    <Text style={[styles.welcome, { color: '#CBD5E1', fontSize: 32 }]}>
                        Bem Vindo
                    </Text>

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
                            source={require('../assets/maomao.png')}
                            style={[styles.icon, { marginBottom: 0 }]}
                        />

                        <Text style={[styles.welcome, {
                            color: isDarkMode ? Colors.light : Colors.dark,
                            fontSize: 20,
                            marginTop: 10,
                        }]}>
                            Você será analisado!!
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.customButton,
                            {
                                borderColor: '#4DC459',
                                backgroundColor: isDarkMode ? '#131C29' : Colors.lighter,
                                marginTop: 20,
                            }
                        ]}
                        onPress={() => navigation.navigate('Bluetooth')}
                        activeOpacity={0.8}
                    >
                        <Text style={{
                            color: '#4DC459',
                            fontWeight: 'bold',
                            fontSize: 16,
                            textAlign: 'center',
                        }}>
                            Parear Dispositivo
                        </Text>
                    </TouchableOpacity>
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
    },
    customButton: {
        paddingVertical: 14,
        borderRadius: 18,
        borderWidth: 1,
        width: '100%',
    },
});

export default HomeScreen;

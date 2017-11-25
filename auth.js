import { AsyncStorage } from 'react-native';
import Expo from 'expo';
import aws from './aws';

async function login(accessKey, secretKey, region) {
    await Expo.SecureStore.setItemAsync('accessKey', accessKey);
    await Expo.SecureStore.setItemAsync('secretKey', secretKey);
    await AsyncStorage.setItem('region', region);

    aws.updateCredentials(accessKey, secretKey, region);
    return aws.loadECSServicesWithAlarms();
}

async function getCredentialsFromKeystore() {
    let accessKey = await Expo.SecureStore.getItemAsync('accessKey');
    let secretKey = await Expo.SecureStore.getItemAsync('secretKey');
    let region = await AsyncStorage.getItem('region');

    return {
        accessKey,
        secretKey,
        region
    };
}

async function logout() {
    await Expo.SecureStore.deleteItemAsync('accessKey');
    await Expo.SecureStore.deleteItemAsync('secretKey');
    await AsyncStorage.removeItem('region');

    aws.clearCredentials();
}

async function isLoggedIn() {
    const {accessKey, secretKey, region} = await getCredentialsFromKeystore();
    let services;

    if(accessKey && secretKey && region) {
        aws.updateCredentials(accessKey, secretKey, region);
        services = await aws.loadECSServicesWithAlarms();
    }

    return !!services;
}

export default {
    login,
    logout,
    isLoggedIn
};

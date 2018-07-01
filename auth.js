import { AsyncStorage } from 'react-native';
import Expo from 'expo';
import aws from './aws';

async function saveCredentials(accessKey, secretKey, region) {
    await Expo.SecureStore.setItemAsync('accessKey', accessKey);
    await Expo.SecureStore.setItemAsync('secretKey', secretKey);
    await AsyncStorage.setItem('region', region);

    aws.updateCredentials(accessKey, secretKey, region);
}

async function getCredentials() {
    let accessKey = await Expo.SecureStore.getItemAsync('accessKey');
    let secretKey = await Expo.SecureStore.getItemAsync('secretKey');
    let region = await AsyncStorage.getItem('region');

    return {
        accessKey,
        secretKey,
        region
    };
}

async function clearCredentials() {
    await Expo.SecureStore.deleteItemAsync('accessKey');
    await Expo.SecureStore.deleteItemAsync('secretKey');
    await AsyncStorage.removeItem('region');

    aws.clearCredentials();
}

async function loadCredentialsFromStore() {
    const {accessKey, secretKey, region} = await getCredentials();

    if(accessKey && secretKey && region) {
        aws.updateCredentials(accessKey, secretKey, region);

        return {
            accessKey,
            secretKey,
            region
        };
    }

}

export default {
    saveCredentials,
    clearCredentials,
    loadCredentialsFromStore
};

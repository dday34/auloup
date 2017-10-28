import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import Expo from 'expo';

const config = new AWS.Config({
    region: 'eu-west-1'
});

function setCredentials(accessKey, secretKey) {
    Expo.SecureStore.setItemAsync('accessKey', accessKey);
    Expo.SecureStore.setItemAsync('secretKey', secretKey);
    config.update({accessKeyId: accessKey, secretAccessKey: secretKey});
}

async function getCredentialsFromKeystore() {
    let accessKey = await Expo.SecureStore.getItemAsync('accessKey');
    let secretKey = await Expo.SecureStore.getItemAsync('secretKey');

    return {
        accessKey,
        secretKey
    };
}

async function getECSServices() {
    const ecs = new AWS.ECS(config);
    const cluster = 'prod-news-monitoring';
    const {serviceArns} = await ecs.listServices({cluster}).promise();
    const {services} = await ecs.describeServices({cluster, services: serviceArns}).promise();

    return services.map(({serviceName, status, serviceArn}) => {
        return {key: serviceArn, name: serviceName, status};
    });
}

async function clearCredentials() {
    await Expo.SecureStore.deleteItemAsync('accessKey');
    await Expo.SecureStore.deleteItemAsync('secretKey');

    config.update({accessKeyId: null, secretAccessKey: null});
}

module.exports = {
    setCredentials,
    getCredentialsFromKeystore,
    clearCredentials,
    getECSServices
};

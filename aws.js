import { AsyncStorage } from 'react-native';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import Expo from 'expo';

const config = new AWS.Config();

const regions = [
    {
        label: 'US East (Ohio)',
        value: 'us-east-2'
    },
    {
        label: 'US East (N. Virginia)',
        value: 'us-east-1'
    },
    {
        label: 'US West (Oregon)',
        value: 'us-west-2'
    },
    {
        label: 'US West (N. California)',
        value: 'us-west-1'
    },
    {
        label: 'Canada (Central)',
        value: 'ca-central-1'
    },
    {
        label: 'EU (Frankfurt)',
        value: 'eu-central-1'
    },
    {
        label: 'EU (London)',
        value: 'eu-west-2'
    },
    {
        label: 'EU (Ireland)',
        value: 'eu-west-1'
    },
    {
        label: 'Asia Pacific (Seoul)',
        value: 'ap-northeast-2'
    },
    {
        label: 'Asia Pacific (Tokyo)',
        value: 'ap-northeast-1'
    },
    {
        label: 'Asia Pacific (Sydney)',
        value: 'ap-southeast-2'
    },
    {
        label: 'Asia Pacific (Singapore)',
        value: 'ap-southeast-1'
    }
];

async function setCredentials(accessKey, secretKey, region) {
    await Expo.SecureStore.setItemAsync('accessKey', accessKey);
    await Expo.SecureStore.setItemAsync('secretKey', secretKey);
    await AsyncStorage.setItem('region', region);

    config.update({accessKeyId: accessKey, secretAccessKey: secretKey, region});
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

async function getECSServices(cluster) {
    const ecs = new AWS.ECS(config);
    const {serviceArns} = await ecs.listServices({cluster}).promise();
    const {services} = await ecs.describeServices({cluster, services: serviceArns}).promise();

    return services.map(({serviceName, status, serviceArn}) => {
        return {key: serviceArn, name: serviceName, status};
    });
}

async function getAllECSServices() {
    const ecs = new AWS.ECS(config);
    const {clusterArns} = await ecs.listClusters().promise();

    const services = await Promise.all(clusterArns.map(getECSServices));

    return [].concat.apply([], services);
}

async function clearCredentials() {
    await Expo.SecureStore.deleteItemAsync('accessKey');
    await Expo.SecureStore.deleteItemAsync('secretKey');
    await AsyncStorage.removeItem('region');

    config.update({accessKeyId: null, secretAccessKey: null, region: null});
}

module.exports = {
    regions,
    setCredentials,
    getCredentialsFromKeystore,
    clearCredentials,
    getECSServices,
    getAllECSServices
};

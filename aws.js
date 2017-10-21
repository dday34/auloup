import AWS from 'aws-sdk/dist/aws-sdk-react-native';

const config = new AWS.Config({
    region: 'eu-west-1'
});

function setCredentials(accessKey, secretKey) {
    config.update({accessKeyId: accessKey, secretAccessKey: secretKey});
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

module.exports = {
    setCredentials,
    getECSServices
};

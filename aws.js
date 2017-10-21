import AWS from 'aws-sdk/dist/aws-sdk-react-native';

const config = new AWS.Config({
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    region: 'eu-west-1'
});

const ecs = new AWS.ECS(config);

async function getECSServices() {
    const cluster = 'prod-news-monitoring';
    const {serviceArns} = await ecs.listServices({cluster}).promise();
    const {services} = await ecs.describeServices({cluster, services: serviceArns}).promise();

    return services.map(({serviceName, status}) => {
        return {name: serviceName, status};
    });
}

module.exports = {
    getECSServices
};

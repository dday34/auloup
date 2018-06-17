import {configure, observable, flow } from 'mobx';
import aws from '../aws';

configure({enforceActions: true});

function byName(service1, service2) {
    if(service1.name < service2.name) return -1;
    if(service1.name > service2.name) return 1;

    return 0;
}

class Store {
    @observable services = []

    fetchServices = flow(function * () {
        const services = yield aws.getECSServicesWithAlarms();

        this.services = services.sort(byName);
    })

    healthyServices = function() {
        return this.services.filter(s => s.state === 'OK');
    }

    unhealthyServices = function() {
        return this.services.filter(s => s.state !== 'OK');
    }

    fetchServiceLogs = flow(function * (service) {
        service.isLoading = true;
        service.isRefreshing = !!service.logs;
        const logs = yield aws.getCloudwatchLogsForECSService(service.taskDefinitionArn);
        service.logs = logs;
        service.isLoading = false;
        service.isRefreshing = false;
    })
}

export default new Store;


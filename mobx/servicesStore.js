import {configure, observable, flow, computed } from 'mobx';
import aws from '../aws';
import auth from '../auth';

configure({enforceActions: true});

function byName(service1, service2) {
    if(service1.name < service2.name) return -1;
    if(service1.name > service2.name) return 1;

    return 0;
}

class Store {
    @observable services = []
    @observable fetchingServicesError;
    @observable isLoadingServices = true;
    @observable isAuthenticated = false

    saveCredentials = flow(function * (accessKey, secretKey, region) {
        yield auth.saveCredentials(accessKey, secretKey, region);

        this.isAuthenticated = true;
    })

    loadCredentials = flow(function * () {
        const credentials = yield auth.loadCredentialsFromStore();

        if(credentials) {
            this.isAuthenticated = true;
        }

        return credentials;
    })

    logout = flow(function * () {
        yield auth.clearCredentials();
        this.services = [];
        this.isAuthenticated = false;
    })

    fetchServices = flow(function * () {
        try {
            this.isLoadingServices = true;
            this.fetchingServicesError = null;
            const services = yield aws.getECSServicesWithAlarms();
            this.services = services.sort(byName);
        } catch (error) {
            this.fetchingServicesError = error;
        }
        this.isLoadingServices = false;
    })

    @computed get healthyServices() {
        return this.services.filter(s => s.state === 'OK');
    }

    @computed get unhealthyServices() {
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

    fetchServiceEvents = flow(function * (service) {
        service.isRefreshing = true;
        const services = yield aws.getServices(service.cluster, [service.key]);
        service.events = services[0].events;
        service.isRefreshing = false;
    })
}

export default new Store;


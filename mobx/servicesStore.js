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
    @observable isLoadingServices = false;
    @observable isLoadingCredentials = true;
    @observable isRefreshingServices = false;
    @observable isAuthenticated = false

    saveCredentials = flow(function * (accessKey, secretKey, region) {
        yield auth.saveCredentials(accessKey, secretKey, region);

        this.isAuthenticated = true;
    })

    loadCredentials = flow(function * () {
        this.isLoadingCredentials = true;
        const credentials = yield auth.loadCredentialsFromStore();

        if(credentials) {
            this.isAuthenticated = true;
        }

        this.isLoadingCredentials = false;
    })

    logout = flow(function * () {
        yield auth.clearCredentials();
        this.services = [];
        this.isAuthenticated = false;
    })

    fetchServices = flow(function * () {
        try {
            this.fetchingServicesError = null;
            const services = yield aws.getECSServicesWithAlarms();
            this.services = services.sort(byName);
        } catch (error) {
            this.fetchingServicesError = error;
        }
    })

    loadServices = flow(function * () {
        this.isLoadingServices = true;
        yield this.fetchServices();
        this.isLoadingServices = false;
    })

    refreshServices = flow(function * () {
        this.isRefreshingServices = true;
        yield this.fetchServices();
        this.isRefreshingServices = false;
    })

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


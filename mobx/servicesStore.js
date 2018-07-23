import {configure, observable, flow, computed, action } from 'mobx';
import aws from '../aws';
import auth from '../auth';

configure({enforceActions: true});

function byName(service1, service2) {
    if(service1.name < service2.name) return -1;
    if(service1.name > service2.name) return 1;

    return 0;
}

function hasAlarm(service) {
    return !!service.alarms.find(alarm => alarm.status === 'ALARM');
}

function byAlarmAndName(service1, service2) {
    if(hasAlarm(service1) && !hasAlarm(service2)) return -1;
    if(hasAlarm(service2) && !hasAlarm(service1)) return 1;

    return byName(service1, service2);
}

function includeSearchTerm(searchTerm, service) {
    return service.get('displayName').toLowerCase().includes(searchTerm.toLowerCase());
}

class Store {
    @observable isAuthenticated = false
    @observable isAuthenticatingAndLoadingServices = false;
    @observable isLoadingServices = true;
    @observable isRefreshingServices = false;
    @observable fetchingServicesError;
    @observable services = []
    @observable searchTerm = '';

    saveCredentials = flow(function * (accessKey, secretKey, region) {
        yield auth.saveCredentials(accessKey, secretKey, region);
    })

    loadCredentials = flow(function * () {
        return yield auth.loadCredentialsFromStore();
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
            this.services = services.sort(byAlarmAndName).map(service => observable.map(service));

        } catch (error) {
            this.fetchingServicesError = error;
        }
    })

    @computed get filteredServices() {
        return this.services.filter(s => includeSearchTerm(this.searchTerm, s));
    }

    authenticateAndLoadServices = flow(function * (accessKey, secretKey, region) {
        this.isAuthenticatingAndLoadingServices = true;
        yield this.saveCredentials(accessKey, secretKey, region);
        yield this.fetchServices();

        if(!this.fetchingServicesError) {
            this.isAuthenticated = true;
        }

        this.isAuthenticatingAndLoadingServices = false;
    })

    loadCredentialsAndServices = flow(function * () {
        this.isLoadingServices = true;
        const credentials = yield this.loadCredentials();

        if(credentials) {
            yield this.fetchServices();

            if(!this.fetchingServicesError) {
                this.isAuthenticated = true;
            }
        }

        this.isLoadingServices = false;
    })

    refreshServices = flow(function * () {
        this.isRefreshingServices = true;
        yield this.fetchServices();
        this.isRefreshingServices = false;
    })

    fetchServiceLogs = flow(function * (service) {
        service.set('isLoading', true);
        service.set('isRefreshing', !!service.get('logs'));
        const logs = yield aws.getCloudwatchLogsForECSService(service.get('taskDefinitionArn'));
        service.set('logs', logs);
        service.set('isLoading', false);
        service.set('isRefreshing', false);
    })

    fetchServiceEvents = flow(function * (service) {
        service.set('isRefreshing', true);
        const services = yield aws.getServices(service.get('cluster'), [service.get('key')]);
        service.set('events', services[0].events);
        service.set('isRefreshing', false);
    })

    @action.bound
    setFilter(term) {
        this.searchTerm = term;
    }
}

export default new Store;


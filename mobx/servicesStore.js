import {configure, observable, flow, computed, action } from 'mobx';
import aws from '../aws';
import auth from '../auth';

configure({enforceActions: true});

function byName(service1, service2) {
    if(service1.name < service2.name) return -1;
    if(service1.name > service2.name) return 1;

    return 0;
}

function includeSearchTerm(searchTerm, service) {
    return service.displayName.toLowerCase().includes(searchTerm.toLowerCase());
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
            this.services = services.sort(byName);
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

    @action.bound
    setFilter(term) {
        this.searchTerm = term;
    }
}

export default new Store;


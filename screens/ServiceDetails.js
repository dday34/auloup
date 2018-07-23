import React from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    FlatList,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import {
    TabRouter,
    createNavigator,
    createNavigationContainer,
    SafeAreaView
} from 'react-navigation';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import aws from '../aws';
import { brandColor } from '../styles';

const styles = StyleSheet.create({
    serviceDetailsTabView: {
        flex: 1
    },
    tabBar: {
        flexDirection: 'row',
        height: 48,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.17,
        shadowRadius: 2,
        zIndex: 1,
        elevation: 2
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: brandColor
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: 'white'
    },
    tabText: {
        color: 'white',
        fontSize: 15,
    },
    activeTabText: {
        fontWeight: 'bold'
    },
    infoScreenView: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 16
    },
    eventsScreenView: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10
    },
    logsScreenView: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10
    },
    status: {
        fontSize: 17
    },
    alarm: {
        fontSize: 17,
        lineHeight: 17,
        marginTop: 10
    },
    logSectionHeader: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: 'white',
        fontSize: 15,
        color: '#828282'
    },
    event: {
        marginBottom: 10,
        marginHorizontal: 16,
    },
    eventDate: {
        marginBottom: 5,
    },
    eventMessage: {
        marginBottom: 10,
    },
    loadingPage: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: 20
    }
});

function LogSectionHeader({section}) {
    return (<Text style={styles.logSectionHeader}>{section.title}</Text>);
}

function LogLine(log) {
    const logDate = moment(log.item.timestamp).format('DD/MM/YY hh:mm:ss');
    return (
        <View style={styles.event}>
            <Text style={styles.eventDate}>{logDate}</Text>
            <Text style={styles.eventMessage}>{log.item.message}</Text>
        </View>
    );
}

@inject('servicesStore')
@observer
class LogsScreen extends React.Component {

    loadLogs() {
        const { screenProps: { service }, servicesStore } = this.props;

        servicesStore.fetchServiceLogs(service);
    }

    componentDidMount() {
        this.loadLogs();
    }

    render() {
        const { screenProps: { service } } = this.props;

        if(service.get('isLoading') && !service.get('isRefreshing')) {
            return (
                <View style={styles.loadingPage}>
                    <ActivityIndicator size="large" color={brandColor} />
                </View>
            );
        }

        if(!service.get('logs')) {
            return (<View></View>)
        }

        const sections = service.get('logs').map(c => ({
            title: c.name,
            data: c.logs.events
        }));

        return (
            <View style={styles.logsScreenView}>
                <SectionList
                    sections={sections}
                    renderItem={LogLine}
                    renderSectionHeader={LogSectionHeader}
                    keyExtractor={(item, index) => index}
                    refreshControl={
                        <RefreshControl
                            refreshing={service.get('isRefreshing')}
                            onRefresh={this.loadLogs.bind(this)}
                        />
                    }
                ></SectionList>
            </View>
        );
    }
}

function EventLine(event) {
    const eventDate = moment(event.item.createdAt).format('DD/MM/YY hh:mm:ss');
    return (
        <View style={styles.event}>
            <Text style={styles.eventDate}>{eventDate}</Text>
            <Text style={styles.eventMessage}>{event.item.message}</Text>
        </View>
    );
}

@inject('servicesStore')
@observer
class EventsScreen extends React.Component {

    loadEvents() {
        const { screenProps: { service }, servicesStore } = this.props;

        servicesStore.fetchServiceEvents(service);
    }

    componentDidMount() {
        this.loadEvents();
    }

    render() {
        const { screenProps: { service } } = this.props;

        return (
            <View style={styles.eventsScreenView}>
                <FlatList
                    data={service.get('events').slice(0, 20)}
                    renderItem={EventLine}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={service.get('isRefreshing') || false}
                            onRefresh={this.loadEvents.bind(this)}
                        />
                    }
                />
            </View>
        );
    }
}

function AlarmLine(alarm) {
    const operatorFormat = {
        GreaterThanOrEqualToThreshold: '>=',
        GreaterThanThreshold: '>',
        LessThanThreshold: '<',
        LessThanOrEqualToThreshold: '<='
    };
    const color = alarm.item.state === 'ALARM' ? '#E31020' : '#118445';

    return <Text style={[styles.alarm, {color}]}>{alarm.item.metric} {operatorFormat[alarm.item.operator]} {alarm.item.threshold} {alarm.item.state}</Text>;
}

class InfoScreen extends React.Component {
    render() {
        const { screenProps: { service } } = this.props;

        return (
            <View style={styles.infoScreenView}>
                <Text style={styles.status}>Status: {service.get('status')}</Text>
                <FlatList data={service.get('alarms')} renderItem={AlarmLine} keyExtractor={(item, index) => index.toString()}/>
            </View>

        );
    }
};

function ServiceDetailsTabBar({ navigation }) {
    const { routes, index: activeTabIndex } = navigation.state;

    return (
        <SafeAreaView style={styles.tabBar}>
            {routes.map((route, index) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate(route.routeName)}
                    key={route.routeName}
                    style={[styles.tab, index === activeTabIndex && styles.activeTab]}
                    >
                    <Text style={[styles.tabText, index === activeTabIndex && styles.activeTabText]}>{route.routeName}</Text>
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    );
}

class ServiceDetailsTabView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { navigation, descriptors } = this.props;
        const { routes, index } = navigation.state;
        const service = navigation.getParam('service');

        const ActiveScreen = descriptors[routes[index].routeName].getComponent();

        return (
            <SafeAreaView style={styles.serviceDetailsTabView}>
                <ServiceDetailsTabBar navigation={navigation} />
                <ActiveScreen
                    screenProps={{service}}
                />
            </SafeAreaView>
        );
    }
}

const ServiceDetailsTabRouter = TabRouter({
    Info: {
        screen: InfoScreen,
        path: 'info'
    },
    Events: {
        screen: EventsScreen,
        path: 'events'
    },
    Logs: {
        screen: LogsScreen,
        path: 'logs'
    }
}, {
    initialRouteName: 'Info',
    animationEnabled: true
});

const ServiceDetailsTabs = createNavigationContainer(
    createNavigator(ServiceDetailsTabView, ServiceDetailsTabRouter)
);

class ServiceDetails extends React.Component {

    static router = ServiceDetailsTabs.router;

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('service').get('displayName')
        };
    };

    render() {
        const { navigation } = this.props;

        return (
            <ServiceDetailsTabs navigation={navigation} />
        );
    }
}

export default ServiceDetails;

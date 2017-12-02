import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import {
    TabRouter,
    createNavigator,
    createNavigationContainer,
    SafeAreaView,
    addNavigationHelpers,
} from 'react-navigation';
import { brandColor } from '../styles';
import aws from '../aws';

const styles = StyleSheet.create({
    settingsIcon: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    servicesTabView: {
        flex: 1
    },
    tabBar: {
        flexDirection: 'row',
        height: 48,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.17,
        shadowRadius: 2,
        zIndex: 1
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
        fontSize: 14,
        letterSpacing: 1
    },
    service: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderColor: '#F2F2F2',
        borderWidth: 1
    },
    serviceTitle: {
        fontSize: 16,
        lineHeight: 19,
        color: 'black'
    },
    alarm: {
        color: '#828282',
        fontSize: 14,
        lineHeight: 16,
        marginTop: 5
    },
});

function AlarmLine(alarm) {
    const operatorFormat = {
        GreaterThanOrEqualToThreshold: '>=',
        GreaterThanThreshold: '>',
        LessThanThreshold: '<',
        LessThanOrEqualToThreshold: '<='
    };

    return <Text style={styles.alarm}>{alarm.item.metric} {operatorFormat[alarm.item.operator]} {alarm.item.threshold}</Text>
}

function ServiceTile({item}) {
    return (
        <View style={styles.service}>
            <Text style={styles.serviceTitle}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            <FlatList data={item.alarms.filter(a => a.state !== 'OK')} renderItem={AlarmLine} keyExtractor={(item, index) => index}/>
        </View>
    );
}

function ServicesScreen({ services }) {
    return (
        <FlatList data={services} renderItem={ServiceTile} />
    );
}

function UnhealthyScreen({ screenProps }) {
    const unhealthyServices = screenProps.services.filter(s => s.state !== 'OK');

    return ServicesScreen( { services: unhealthyServices } );
}

function HealthyScreen({ screenProps }) {
    const healthyServices = screenProps.services.filter(s => s.state === 'OK');

    return ServicesScreen( { services: healthyServices } );
}

const ServicesTabRouter = TabRouter({
    Unhealthy: {
        screen: UnhealthyScreen,
        path: 'unhealthy'
    },
    Healthy: {
        screen: HealthyScreen,
        path: 'healthy'
    }
}, {
    initialRouteName: 'Unhealthy',
    animationEnabled: true
});

function ServicesTabBar({ navigation }) {
    const { routes, index: activeTabIndex } = navigation.state;

    return (
        <SafeAreaView style={styles.tabBar}>
            {routes.map((route, index) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate(route.routeName)}
                    key={route.routeName}
                    style={[styles.tab, index === activeTabIndex && styles.activeTab]}
                    >
                    <Text style={styles.tabText}>{route.routeName.toUpperCase()}</Text>
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    );
}

function byName(service1, service2) {
    if(service1.name < service2.name) return -1;
    if(service1.name > service2.name) return 1;

    return 0;
}

class ServicesTabView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            services: []
        };
    }

    componentDidMount() {
        aws.getECSServicesWithAlarms()
           .then(services => this.setState({services}));
    }

    render() {
        const { navigation, router } = this.props;
        const { routes, index } = navigation.state;
        const ActiveScreen = router.getComponentForRouteName(routes[index].routeName);
        const orderedServices = this.state.services.sort(byName);

        return (
            <SafeAreaView style={styles.servicesTabView}>
                <ServicesTabBar navigation={navigation} />
                <ActiveScreen
                    navigation={addNavigationHelpers({
                            dispatch: navigation.dispatch,
                            state: routes[index],
                    })}
                    screenProps={{services: orderedServices}}
                />
            </SafeAreaView>
        );
    }
}

const ServicesTabs = createNavigationContainer(
    createNavigator(ServicesTabRouter)(ServicesTabView)
);

class Services extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Services',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image source={require('../images/settings.png')} style={styles.settingsIcon}  />
            </TouchableOpacity>
        )
    });

    render() {
        return <ServicesTabs />;
    }
}

export default Services;

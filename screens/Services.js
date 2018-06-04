import React from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import {
    TabRouter,
    createNavigator,
    createNavigationContainer,
    SafeAreaView
} from 'react-navigation';
import ServiceTile from '../components/ServiceTile';
import globalStyles from '../styles';
import aws from '../aws';

const styles = StyleSheet.create({
    settingsIcon: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    servicesTabView: {
        flex: 1
    }
});

function ServicesScreen({ services }) {
    return (
        <FlatList data={services} renderItem={({item}) => <ServiceTile item={item}></ServiceTile>} />
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

function ServicesTabBar({ navigation }) {
    const { routes, index: activeTabIndex } = navigation.state;

    return (
        <SafeAreaView style={globalStyles.tabBar}>
            {routes.map((route, index) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate(route.routeName)}
                    key={route.routeName}
                    style={[globalStyles.tab, index === activeTabIndex && globalStyles.activeTab]}
                    >
                    <Text style={globalStyles.tabText}>{route.routeName.toUpperCase()}</Text>
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
        const { navigation, descriptors } = this.props;
        const { routes, index } = navigation.state;

        const ActiveScreen = descriptors[routes[index].routeName].getComponent();
        const orderedServices = this.state.services.sort(byName);

        return (
            <SafeAreaView style={styles.servicesTabView}>
                <ServicesTabBar navigation={navigation} />
                <ActiveScreen
                    screenProps={{services: orderedServices}}
                />
            </SafeAreaView>
        );
    }
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

const ServicesTabs = createNavigationContainer(
    createNavigator(ServicesTabView, ServicesTabRouter)
);

class Services extends React.Component {

    static router = ServicesTabs.router;

    static navigationOptions = ({ navigation }) => ({
        title: 'Services',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image source={require('../images/settings.png')} style={styles.settingsIcon}  />
            </TouchableOpacity>
        )
    });

    render() {
        return <ServicesTabs navigation={this.props.navigation} />;
    }
}

export default Services;

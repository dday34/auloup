import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl
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

@inject('servicesStore')
@observer
class ServicesScreen extends React.Component {

    render() {
        const { services, servicesStore } = this.props;

        return (
            <FlatList
                data={services}
                renderItem={({item}) => <ServiceTile item={item}></ServiceTile>}
                refreshControl={
                    <RefreshControl
                        refreshing={servicesStore.isRefreshingServices || false}
                        onRefresh={() => servicesStore.refreshServices(true)}
                    />
                }
            />
        );
    }
}

@inject('servicesStore')
@observer
class UnhealthyScreen extends React.Component {
    render() {
        const { servicesStore } = this.props;

        return (
            <ServicesScreen services={servicesStore.unhealthyServices}></ServicesScreen>
        );
    }
}

@inject('servicesStore')
@observer
class HealthyScreen extends React.Component {
    render() {
        const { servicesStore } = this.props;

        return (
            <ServicesScreen services={servicesStore.healthyServices}></ServicesScreen>
        );
    }
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

class ServicesTabView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { navigation, descriptors } = this.props;
        const { routes, index } = navigation.state;

        const ActiveScreen = descriptors[routes[index].routeName].getComponent();

        return (
            <SafeAreaView style={styles.servicesTabView}>
                <ServicesTabBar navigation={navigation} />
                <ActiveScreen />
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

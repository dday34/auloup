import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl
} from 'react-native';

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
        const { servicesStore } = this.props;

        return (
            <FlatList
                data={servicesStore.services}
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

export default Services;

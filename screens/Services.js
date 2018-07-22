import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    View,
    TextInput
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
    filterInput: {
        height: 50,
        fontSize: 15,
        paddingLeft: 10
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
            <View>
                <TextInput
                    style={styles.filterInput}
                    placeholder={"Filter"}
                    onChangeText={servicesStore.setFilter}
                />
                <FlatList
                    data={servicesStore.filteredServices}
                    renderItem={({item}) => <ServiceTile item={item}></ServiceTile>}
                    keyExtractor={(item, index) => item.get('name')}
                    refreshControl={
                        <RefreshControl
                            refreshing={servicesStore.isRefreshingServices || false}
                                       onRefresh={() => servicesStore.refreshServices(true)}
                        />
                    }
                />
            </View>
        );
    }
}

export default Services;

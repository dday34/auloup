import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    View,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ServiceTile from '../components/ServiceTile';
import globalStyles from '../styles';
import aws from '../aws';

const styles = StyleSheet.create({
    settingsIcon: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    searchSection: {
        flex: 0,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 2
    },
    searchIcon: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 16,
        height: 50,
        color: '#828282'
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
        paddingLeft: 0
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
                <View style={styles.searchSection}>
                    <Ionicons style={styles.searchIcon} name="md-search" size={30}></Ionicons>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Services"
                        onChangeText={servicesStore.setFilter}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
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
